import * as THREE from 'three';

import { GetTextGeometry, GetTextMesh } from  '../3d-utils/oap-cached-text-geometry';
import { Tween, Easing, update as UpdateTween } from 'es6-tween';
import { Get2DEmoji } from '../3d-utils/oap-2d-emojis';

class CountDownTimer {

  constructor (scene, camera, renderer, composer, clock, font3d, quizComponent, width, height) {
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

    this.secondsLeft=15;
    this.clock = clock;
    this.currentTime = 0;
    this.init();
  }

  init() {
    const settings = {
      metalness: 1.0,
      roughness: 0.4,
      ambientIntensity: 0.2,
      aoMapIntensity: 1.0,
      envMapIntensity: 1.0,
      displacementScale: 2.436143, // from original model
      normalScale: 1.0
    };
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.pointLight1 = new THREE.PointLight( 0xff00000, 0.5 );
		this.pointLight1.position.z = 2500;
		this.scene.add(this.pointLight1 );

		this.pointLight2 = new THREE.PointLight( 0xff6666, 1 );
    this.camera.add( 	this.pointLight2  );

    this.pointLight3 = new THREE.PointLight( 0x0000ff, 1.5 );
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
      roughness: settings.roughness,
      metalness: settings.metalness,

      aoMap: aoMap,
      aoMapIntensity: 1,

      displacementMap: displacementMap,
      displacementScale: settings.displacementScale,
      displacementBias: - 0.428408, // from original model

      envMap: reflectionCube,
      envMapIntensity: settings.envMapIntensity,

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

  startCountDown() {
    this.stopCountDown();
    let emojiStartZ = -120;
    let emojiEndZ = 40;
    let digitsStartZ = -190;
    let digitsHoldZ = -2090;
    let digitsEndZ = 3;
    this.secondsLeft = 15;

    if (!this.startEmojiSprite) {
      this.startEmojiSprite = Get2DEmoji("⏲️", '120px Arial');
      this.startEmojiSprite.position.y = 2.9;
      this.countdownDigitGroup.add(this.startEmojiSprite);
    }

    if (this.startEmoji2DTween) {
      this.startEmoji2DTween.stop();
      this.startEmoji2DTween = null;
    }

    this.startEmojiSprite.position.z=emojiStartZ;
    this.startEmojiSprite.visible=true;
    this.countDownMesh.position.z=digitsHoldZ;
    this.countDownMesh.position.y=1.4;
    this.countdownDigitGroup.visible=true;
    this.countDownMesh.visible=true;
    const startDateMs = Date.now();

    this.startEmoji2DTween = new Tween(this.startEmojiSprite.position)
    .to({ z: emojiEndZ }, 2500)
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

    this.countdownTween3 = new Tween(this.countDownMesh.position)
    .to({ z: digitsEndZ }, 3100)
    .easing(Easing.Cubic.Out)
    .delay(0)
    .on('complete', () => {
      this.countdownTween3 = null;
    })
    .start();
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
  }

  resetAfterStop() {
    this.secondsLeft = 15;
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

    this.r += 0.025;
  }
}

export const CreateCountDownTimer = (scene, camera, renderer, composer, clock, font, quizComponent, width, height) => {
  return new CountDownTimer(scene, camera, renderer, composer, clock, font, quizComponent, width, height);
}
