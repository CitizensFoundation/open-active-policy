import * as THREE from 'three';

import { GetTextGeometry, GetTextMesh } from  './oap-cached-text-geometry';
import { Tween, Easing, update as UpdateTween } from 'es6-tween';
import { Get2DEmoji } from './oap-2d-emojis';
import { Color } from 'three';

class IntroScene3D {

  constructor (scene, camera, renderer, composer, clock, font3d, component, welcomeTexts, width, height) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.composer = composer;
    this.width = width;
    this.height = height;
    this.font3d = font3d;
    this.r = 0.0;
    this.inCountDown = false;
    this.component = component;
    this.welcomeTexts = welcomeTexts;

    this.completedTextTweens = 0;

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
          this.component.introFinished();
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
    this.pointLight2.intensity=0.05;
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
   this.startIntro()
  }

  cleanupIntro() {
    this.welcomeFontMeshes = [];
    this.scene.remove(this.logoSprite);
    setTimeout(()=>{
      //this.component.disableLightShaftAfterNextAnswer();
    }, 20000);
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


  getRandomEasing() {
    const myArray = [Easing.Circular.Out,Easing.Cubic.Out,Easing.Quintic.Out,
                    Easing.Quadratic.Out,Easing.Quartic.Out,Easing.Sinusoidal.Out];
    const randomItem = myArray[Math.floor(Math.random()*myArray.length)];
    return randomItem;
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

export const CreateIntroScene3D = (scene, camera, renderer, composer, clock, font, component, welcomeTexts, width, height) => {
  return new IntroScene3D(scene, camera, renderer, composer, clock, font, component, welcomeTexts, width, height);
}
