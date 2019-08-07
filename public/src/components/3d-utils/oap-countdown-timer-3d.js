import * as THREE from 'three';

import { GetTextGeometry, GetTextMesh } from  '../3d-utils/oap-cached-text-geometry';
import { Tween, Easing, update as UpdateTween } from 'es6-tween';
import { Get2DEmoji } from '../3d-utils/oap-2d-emojis';
import { Color } from 'three';

class CountDownTimer3D {

  constructor (scene, camera, renderer, composer, clock, font3d, quizComponent, welcomeTexts, width, height) {
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

    this.completedTextTweens = 0;

    this.secondsLeft=15;
    this.clock = clock;
    this.currentTime = 0;
    this.createTextGeometries();
    this.init();

    this.winPoints = 5;
    setTimeout(()=>{
      this.cacheWinPoints()
    }, 100)
  }

  async createTextGeometries() {
    this.welcomeFontMeshes = [];

    for (var i=0;i<this.welcomeTexts.length;i++) {
      const textMaterial = new THREE.MeshStandardMaterial( {
        color: "#a0a0a0",
        roughness: 0.4,
        metalness: 1.0,
        side: THREE.DoubleSide
      });
      const textMesh = new THREE.Mesh(GetTextGeometry(this.welcomeTexts[i].title, this.font3d, { large: true }), textMaterial );
      this.welcomeFontMeshes.push(textMesh);
      textMesh.position.z = -500
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  async addTextGeometriesAndRun() {
    this.pointLight2.intensity=0.001;
    this.pointLight1.intensity=0.5
    this.pointLight3.intensity=0.5
    this.pointLight1.color = new Color(0xffffff);
    this.pointLight3.color = new Color(0xffffff);

    for (var i=0;i<this.welcomeFontMeshes.length;i++) {
      const fontMesh = this.welcomeFontMeshes[i];
      this.scene.add(fontMesh);
      const animationLength = this.welcomeTexts[i].animationLength;
      let myEasing = this.welcomeTexts[i].easing ? eval(this.welcomeTexts[i].easing) : Easing.Quadratic.InOut;
      new Tween(fontMesh.position)
      .to({ z: 32 }, animationLength)
      .easing(myEasing)
      .delay(0)
      .on('complete', (event, blah) => {
        fontMesh.visible = false;
        this.scene.remove(fontMesh);
        this.completedTextTweens+=1;
        if (this.completedTextTweens==this.welcomeFontMeshes.length) {
          this.quizComponent.introFinished();
          this.cleanupIntro();
          this.pointLight2.intensity=0.1;
        }
      })
      .start();
      fontMesh.material.transparent=true;
      new Tween(fontMesh.material)
      .to({ opacity: 0.0 },500)
      .delay(animationLength-200)
      .easing(Easing.Quadratic.InOut)
      .start();

      await new Promise(resolve => setTimeout(resolve, animationLength));
    }
    this.pointLight2.intensity=0.06;
    this.pointLight1.intensity=0.5;
    this.pointLight3.intensity=0.5;
    this.pointLight1.color = new Color(0xff0000);
    this.pointLight3.color = new Color(0x0000ff);


  }

  startIntro() {
    const logoStartZ=-5;
    const logoEndZ= 48;

    setTimeout(()=>{
      if (this.welcomeFontMeshes.length==this.welcomeTexts.length) {
        this.addTextGeometriesAndRun();
      } else {
        setTimeout(()=>{
          this.addTextGeometriesAndRun();
        }, 1000);
      }
    }, 2520);

    var spriteMap = new THREE.TextureLoader().load( "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/clientAssets/3d/textures/makeyourlogo2.png" );
    var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
    this.logoSprite = new THREE.Sprite( spriteMaterial );
    this.scene.add( this.logoSprite );
    this.logoSprite.position.z = logoStartZ;
    this.logoSprite.scale.y=1.5;
    this.logoSprite.position.y=0.1;
    this.logoSprite.position.x=4.7;

    this.logoTween = new Tween(this.logoSprite.position)
    .to({ z: logoEndZ, x: -1.5, y: this.logoSprite.position.y }, 3100)
    .delay(0)
    .easing(Easing.Quadratic.In)
    .on('complete', () => {
      this.logoTween = null;
      /*this.logoSprite.position.z=logoStartZ;
      this.logoSprite.visible=false;*/
    })
    .start();

    this.logoSprite.material.transparent=true;
    new Tween(this.logoSprite.material)
    .to({ opacity: 0.0 }, 500)
    .delay(2600)
    .on('complete', () => {
      this.scene.remove(this.logoSprite);
    })
    .start();
  }

  init() {
    this.roughness = 0.3;
    const settings = {
      metalness: 0.1,
      roughness: 0.1,
      ambientIntensity: 0.2,
      aoMapIntensity: 1.0,
      envMapIntensity: 1.0,
      displacementScale: 2.436143, // from original model
      normalScale: 1.0
    };
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.pointLight1 = new THREE.PointLight( 0xff00000, 0.15 );
		this.pointLight1.position.z = 2500;
		this.scene.add(this.pointLight1 );

		this.pointLight2 = new THREE.PointLight( 0xffffff, 0.07 );
    this.camera.add( 	this.pointLight2  );

    this.pointLight3 = new THREE.PointLight( 0x0000ff, 0.15 );
    this.pointLight3.position.x = - 1000;
    this.pointLight3.position.z = 1000;
    this.scene.add( this.pointLight3 );

    const path = "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/clientAssets/3d/textures/SwedishCastla/";
    const format = '.jpg';
    const urls = [
      path + 'px' + format, path + 'nx' + format,
      path + 'py' + format, path + 'ny' + format,
      path + 'pz' + format, path + 'nz' + format
    ];

  	const reflectionCube = new THREE.CubeTextureLoader().load( urls );

    const textureLoader = new THREE.TextureLoader();
    const normalMap = textureLoader.load( "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/clientAssets/3d/textures/SwedishCastla/normal.jpg" );
    const aoMap = textureLoader.load( "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/clientAssets/3d/textures/SwedishCastla/ao.jpg" );
    const displacementMap = textureLoader.load( "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/clientAssets/3d/textures/SwedishCastla/displacement.jpg" );

    this.material = new THREE.MeshStandardMaterial( {
      color: 0x888888,
      roughness: this.roughness ,
      metalness: settings.metalness,

      side: THREE.DoubleSide
    } );

    const materials = [
      new THREE.MeshPhongMaterial( { color: "#FF0000", flatShading: true } ), // front
      new THREE.MeshPhongMaterial( { color: "#FF0000"} ) // side
    ];

    this.countDownDigitGeometry=GetTextGeometry(this.secondsLeft.toString(), this.font3d, { large: true });

    this.countDownMesh = new THREE.Mesh(this.countDownDigitGeometry, this.material);
    this.countDownMesh.visible = false;

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
    this.pointLight2.intensity = 0.32;
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
    let emojiStartZ = -120;
    let emojiEndZ = 40;
    let digitsStartZ = -190;
    let digitsHoldZ = -2090;
    let digitsEndZ = -55;
    this.secondsLeft = 15;

    if (!this.startEmojiSprite) {
      this.startEmojiSprite = Get2DEmoji("⏳", '120px Arial');
      this.startEmojiSprite.position.y = 0.7;
      this.countdownDigitGroup.add(this.startEmojiSprite);
    }

    if (this.startEmoji2DTween) {
      this.startEmoji2DTween.stop();
      this.startEmoji2DTween = null;
    }

    const roughness = Math.random();
    const metalness = Math.random();

    this.material = new THREE.MeshStandardMaterial( {
      color: 0x888888,
      roughness: roughness,
      metalness:metalness,

      side: THREE.DoubleSide
    } );

    this.countDownMesh.material = this.material;

    this.startEmojiSprite.position.z=emojiStartZ;
    this.startEmojiSprite.visible=true;
    this.startEmojiSprite.material.opacity = 1.0;
    this.countDownMesh.position.z=digitsHoldZ;
    this.countDownMesh.position.y=-3.7;
    this.countdownDigitGroup.visible=true;
    this.countDownMesh.visible=true;
    const startDateMs = Date.now();

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
    .start();

    this.countdownTween3 = new Tween(this.countDownMesh.position)
    .to({ z: digitsEndZ }, 3400)
    .easing(this.getRandomEasing())
    .delay(0)
    .on('complete', () => {
      this.countdownTween3 = null;
    })
    .start();

    this.countdownTween4 = new Tween(this)
    .to({ roughness: 0.5 }, 3400)
    .easing(Easing.Cubic.Out)
    .delay(0)
    .on('complete', () => {
      this.countdownTween4 = null;
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
    this.countdownTween3 = new Tween(this.countDownMesh.position)
    .to({ y: 70 }, 1200)
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
    this.countdownTween3 = new Tween(this.countDownMesh.position)
    .to({ y: 70 }, 1200)
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

    this.startEmojiSprite.visible = false;
    this.countdownDigitGroup.visible = false;
  }

  resetAfterStop() {
    this.secondsLeft = 15;
    this.roughness = 0.1;
    this.countDownMesh.geometry = this.countDownDigitGeometry=GetTextGeometry(this.secondsLeft.toString(), this.font3d, { large: true });
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
          this.countDownMesh.geometry = this.countDownDigitGeometry=GetTextGeometry(this.secondsLeft.toString(), this.font3d, { large: true });
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
    this.pointLight1.position.x = 2500 * Math.cos( this.r );
    this.pointLight1.position.z = 2500 * Math.sin( this.r );
    this.pointLight3.position.z = 2500 * Math.cos( this.r );
    this.pointLight3.position.x = 2500 * Math.sin( this.r );

    this.r += 0.005;
  }
}

export const CreateCountDownTimer3D = (scene, camera, renderer, composer, clock, font, quizComponent, welcomeTexts, width, height) => {
  return new CountDownTimer3D(scene, camera, renderer, composer, clock, font, quizComponent, welcomeTexts, width, height);
}
