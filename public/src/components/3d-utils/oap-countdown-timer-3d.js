import * as THREE from 'three';

import { GetTextGeometry, GetTextMesh } from  '../3d-utils/oap-cached-text-geometry';
import { Tween, Easing, update as UpdateTween } from 'es6-tween';
import { Get2DEmoji } from '../3d-utils/oap-2d-emojis';
import { Color } from 'three';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

class CountDownTimer3D {

  constructor (scene, camera, renderer, composer, clock, font3d, quizComponent, welcomeTexts, configFromServer, width, height) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.composer = composer;
    this.width = width;
    this.height = height;
    this.font3d = font3d;
    this.r = 0.0;
    this.inCountDown = false;
    this.quizComponent = quizComponent;
    this.welcomeTexts = welcomeTexts;
    this.configFromServer = configFromServer;

    this.completedTextTweens = 0;

    this.secondsLeft=15;
    this.clock = clock;
    this.currentTime = 0;
    this.init();

    this.winPoints = 5;
    setTimeout(()=>{
      this.cacheWinPoints()
    }, 100)
  }

  init() {
    this.roughness = 0.3;
    const settings = {
      metalness: 1.0,
      roughness: 0.4,
      ambientIntensity: 0.2,
      aoMapIntensity: 1.0,
      envMapIntensity: 1.0,
      displacementScale: 0.436143, // from original model
      normalScale: 0.5
    };

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.95);
    this.directionalLight.position.setScalar(100);
    this.scene.add(this.directionalLight);
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.97);
    this.scene.add(this.ambientLight);

		this.pointLight2 = new THREE.PointLight(0xffffff, 0.8 );
    this.camera.add( 	this.pointLight2  );

    const effectFXAA = new ShaderPass( FXAAShader );
    effectFXAA.uniforms.resolution.value.set( 1 / this.width, 1 / this.height );

    this.bloomPass = new UnrealBloomPass( new THREE.Vector2( this.width, this.height ), 1.5, 0.4, 0.85 );
    this.bloomPass.threshold = 0.12;
    this.bloompassInitialStrength = 4.3;
    this.bloomPass.strength =  this.bloompassInitialStrength;
    this.bloomPass.radius = 1.10;
    this.bloomPass.renderToScreen = true;

    this.composer.addPass( effectFXAA );
    this.composer.addPass( this.bloomPass );

    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.toneMappingExposure = Math.pow( 0.9, 4.0 );

    this.material = new THREE.MeshStandardMaterial( {
      color: 0xFF0000,
      side:THREE.BackSide,
      transparent: true,
      opacity: 0.3
    } );

    this.colorArray =   Object.values(this.configFromServer.client_config.moduleTypeColorLookup);

    this.countDownMesh = new THREE.LineSegments( this.getCountDownOutlineGeometry(), new THREE.LineBasicMaterial({
      color: this.colorArray [Math.floor(Math.random()*this.colorArray.length)]
    } ));
    this.countDownMesh.visible = false;
    this.countDownMesh.scale.set(1,2,1);

    this.countdownDigitGroup = new THREE.Group();
    this.countdownDigitGroup.add(this.countDownMesh);
    this.countdownDigitGroup.position.z = -22;
    this.countdownDigitGroup.position.y = -2;
    this.countdownDigitGroup.position.x = 0;
    this.scene.add( this.countdownDigitGroup );
  }

  cleanupIntro() {
    this.welcomeFontMeshes = [];
    this.scene.remove(this.logoSprite);
    setTimeout(()=>{
      //this.quizComponent.disableLightShaftAfterNextAnswer();
    }, 20000);
  }

  cacheWinPoints() {
    this.cacheWinPointsGeometry = GetTextGeometry("+"+ this.winPoints+"cp", this.font3d, { large: true });
  }

  getLeftOfCamera() {
    let fudgetFactor;
    if (window.innerWidth<450) {
      fudgetFactor = 8;
    } else if (window.innerWidth<950) {
      fudgetFactor = -8;
    } else {
      fudgetFactor = -16;
    }
    var fov = this.camera.fov / 180 * Math.PI / 2;
    var adjacent = this.camera.position.distanceTo( this.scene.position );
    return -((Math.tan( fov ) * adjacent  * this.camera.aspect)+fudgetFactor);
  }

  showWinPoints() {
    const winPointZ=-300;
    if (!this.winPointsMesh) {
      this.winPointsMaterial = new THREE.MeshStandardMaterial( {
        color: 0x00FF00,
        roughness: 0.4,
        metalness: 0.92,

        side: THREE.DoubleSide
      } );
      this.winPointsMesh = new THREE.Mesh(this.cacheWinPointsGeometry ? this.cacheWinPointsGeometry : GetTextGeometry("+"+ this.winPoints+"cp", this.font3d, { large: true }),this.winPointsMaterial );
      this.winPointsMesh.position.x=-50;
      this.winPointsMesh.position.y=-6.2;
      this.winPointsMesh.position.z=winPointZ;
      this.scene.add(this.winPointsMesh);
    }

    let startFudge = 100;
    let endFudge = 10;
    if (window.innerWidth<600) {
      startFudge = 36;
      endFudge = 20;
    }

    let votesWidth = window.innerWidth<600 ? window.innerWidth : 600;
    const xText = votesWidth*0.069;

    this.winPointsMesh.visible = true;
//    this.pointLight2.intensity = 0.32;
    this.winPointsTween = new Tween(this.winPointsMesh.position)
    .to({ x: xText+endFudge, y: this.winPointsMesh.position.y, z: -40}, 3000) // relative animation
    .delay(0)
    .on('complete', () => {
      this.winPointsMesh.position.x=-50;
      this.winPointsMesh.position.z=winPointZ;
      this.pointLight2.intensity = 0.1;
      this.winPointsMesh.visible=false;
      this.winPointsTween=null;
    })
    .start();
  }

  startCountDown() {
    let emojiStartZ = -50;
    let emojiEndZ = 70;
    let digitsStartZ = -190;
    let digitsHoldZ = -1350;
    let digitsEndZ = -50;
    this.secondsLeft = 15;

    if (false && !this.startEmojiSprite) {
      this.startEmojiSprite = Get2DEmoji("⏳", '120px Arial');
      this.startEmojiSprite.position.y = 10.7;
      this.countdownDigitGroup.add(this.startEmojiSprite);
    }

    if (this.startEmoji2DTween) {
      this.startEmoji2DTween.stop();
      this.startEmoji2DTween = null;
    }

    const roughness = Math.random();
    const metalness = Math.random();

    /*this.material = new THREE.MeshStandardMaterial( {
      color: 0x888888,
      roughness: roughness,
      metalness:metalness,

      side: THREE.DoubleSide
    } );*/

   // this.countDownMesh.material = this.material;

    this.countDownMesh.position.z=digitsHoldZ;
    this.countDownMesh.position.y=1.0;
    this.countdownDigitGroup.visible=true;
    this.countDownMesh.visible=true;
    const startDateMs = Date.now();

    this.inCountDown = true;
    this.doCountDown();
    /*
    this.startEmoji2DTween = new Tween(this.startEmojiSprite.position)
    .to({ z: emojiEndZ }, 2400)
    .delay(0)
    .on('update', (val, deg) => {
      if (!this.inCountDown && (startDateMs+1400)< Date.now()) {
        this.inCountDown = true;
        this.doCountDown();
      }
    })
    .on('complete', () => {
      this.startEmoji2DTween = null;
      this.startEmojiSprite.position.z=emojiStartZ;
      this.startEmojiSprite.visible=false;
    })
    .start();


    this.opacityEmoji2DTween = new Tween(this.startEmojiSprite.material)
    .to({ opacity: 0.0 }, 600)
    .delay(1800)
    .on('complete', () => {
      this.opacityEmoji2DTween = null;
    })
    .start();*/

    this.countdownTween3 = new Tween(this.countDownMesh.position)
    .to({ z: digitsEndZ }, 2000)
    .easing(this.getRandomEasing())
    .delay(0)
    .on('complete', () => {
      this.countdownTween3 = null;
    })
    .start();
  }

  getRandomEasing() {
    const myArray = [Easing.Circular.Out,Easing.Cubic.Out,Easing.Quintic.Out,
                    Easing.Quadratic.Out,Easing.Quartic.Out,Easing.Sinusoidal.Out];
    const randomItem = myArray[Math.floor(Math.random()*myArray.length)];
    return randomItem;
  }

  stopCountDownWin() {
    this.stopCountDown();
    this.bloomPass.strength = 0.2;
    this.countdownTween3 = new Tween(this.countDownMesh.position)
    .to({ y: 70 }, 2000)
    .easing(Easing.Elastic.Out)
    .delay(0)
    .on('complete', () => {
      this.countdownTween3 = null;
      this.resetAfterStop();
    })
    .start();
  }

  stopCountDownFail() {
    this.stopCountDown();
    this.bloomPass.strength = 0.2;
    this.countdownTween3 = new Tween(this.countDownMesh.position)
    .to({ y: 70 }, 2000)
    .easing(Easing.Bounce.InOut)
    .delay(0)
    .on('complete', () => {
      this.countdownTween3 = null;
      this.resetAfterStop();
    })
    .start();
  }

  stopCountDown() {
    this.inCountDown = false;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if (this.countDownMeshRotation) {
      this.countDownMeshRotation.stop();
      this.countDownMeshRotation=null;
    }

    if (this.countdownTween3) {
      this.countdownTween3.stop();
      this.countdownTween3=null;
    }

    if (this.countdownTween4) {
      this.countdownTween4.stop();
      this.countdownTween4=null;
    }

    if (this.opacityEmoji2DTween) {
      this.opacityEmoji2DTween.stop();
      this.opacityEmoji2DTween=null;
    }

    if (this.startEmojiSprite)
      this.startEmojiSprite.visible = false;

    this.countdownDigitGroup.visible = false;
  }

  getCountDownOutlineGeometry() {
    const countDownDigitGeometry=GetTextGeometry(this.secondsLeft.toString(), this.font3d, { large: true });
    return new THREE.EdgesGeometry( countDownDigitGeometry );
//    return new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xff0000 } ) );
  }

  resetAfterStop() {
    this.secondsLeft = 15;
    this.bloomPass.strength = this.bloompassInitialStrength;
    this.roughness = 0.1;
    this.countDownMesh.geometry = this.getCountDownOutlineGeometry();
    this.countDownMesh.material = new THREE.LineBasicMaterial({
      color: this.colorArray [Math.floor(Math.random()*this.colorArray.length)]
    } )
  }

  doCountDown() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(()=>{
      this.timeout=null;
      if (this.inCountDown) {
        if (this.secondsLeft>0) {
          this.secondsLeft-=1;
          this.countDownMesh.geometry = this.getCountDownOutlineGeometry();
          if (this.secondsLeft<8) {
            if (this.countDownMeshRotation) {
              this.countDownMeshRotation.stop();
              this.countDownMeshRotation = null;
            }
            this.countDownMeshRotation = new Tween(this.countDownMesh.rotation)
            .to({ y: "-" + this.countDownMesh.rotation.y+(Math.PI*2)}, 1000-(500-this.secondsLeft*200))
            .delay(0)
            .on('complete', () => {
              this.countDownMeshRotation = null;
              this.countDownMesh.rotation.y=0;
            })
            .start();
          }
          this.doCountDown();
        } else {
          this.stopCountDownFail();
          this.quizComponent.ranOutOfTime();
        }
      }
    }, 1000);
  }

  set visible(value) {
    if (value===true) {
      this.pointLight1.visible = true;
      this.pointLight2.visible = true;
      this.pointLight3.visible = true;
    } else {
      this.pointLight1.visible = false;
      this.pointLight2.visible = false;
      this.pointLight3.visible = false;
    }

    if (this.countdownDigitGroup) {
      this.countdownDigitGroup.visible=value;
    }
  }

  get visible() {
    return this.countdownDigitGroup.visible;
  }


  getMaterial() {
    return this.material;
  }

  update () {
    /*
    this.pointLight1.position.x = 2500 * Math.cos( this.r );
    this.pointLight1.position.z = 2500 * Math.sin( this.r );
    this.pointLight3.position.z = 2500 * Math.cos( this.r );
    this.pointLight3.position.x = 2500 * Math.sin( this.r );

    this.r += 0.005;
    */
  }
}

export const CreateCountDownTimer3D = (scene, camera, renderer, composer, clock, font, quizComponent, welcomeTexts,configFromServer, width, height) => {
  return new CountDownTimer3D(scene, camera, renderer, composer, clock, font, quizComponent, welcomeTexts, configFromServer, width, height);
}
