import * as THREE from 'three';

import { LightningStorm } from 'three/examples/jsm/objects/LightningStorm.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { GetTextGeometry, GetTextMesh } from  '../3d-utils/oap-cached-text-geometry';

class CountDownTimer {

  constructor (scene, camera, renderer, composer, clock, font3d, width, height) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.composer = composer;
    this.width = width;
    this.height = height;
    this.font3d = font3d;
    this.r = 0.0;

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
    this.pointLight1 = new THREE.PointLight( 0xff0000, 0.5 );
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

      normalMap: normalMap,
      normalScale: new THREE.Vector2( 1, - 1 ), // why does the normal map require negation in this case?

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
      new THREE.MeshPhongMaterial( { color: "#FF000", flatShading: true } ), // front
      new THREE.MeshPhongMaterial( { color: "#FF000"} ) // side
    ];

    this.countDownDigitGeometry=GetTextGeometry(this.secondsLeft.toString(), this.font3d, { large: true });

    this.countDownMesh = new THREE.Mesh(this.countDownDigitGeometry, this.material);

    this.countdownDigitGroup = new THREE.Group();
    this.countdownDigitGroup.add(this.countDownMesh);
    this.countdownDigitGroup.position.z = -20;
    this.countdownDigitGroup.position.y = -2;
    this.countdownDigitGroup.position.x = 0;
    this.countdownDigitGroup.scale.x = 1;
    this.countdownDigitGroup.scale.y = 1;
    this.countdownDigitGroup.scale.z = 1;
    this.scene.add( this.countdownDigitGroup );
    setTimeout(()=>{
      this.startCountDown();
    }, 2000);
  }

  startCountDown() {
    this.doCountDown();
  }

  doCountDown() {
    setTimeout(()=>{
      if (this.secondsLeft>0) {
        this.secondsLeft-=1;
        this.countDownMesh.geometry = this.countDownDigitGeometry=GetTextGeometry(this.secondsLeft.toString(), this.font3d, { large: true });
        this.doCountDown();
      } else {
        this.secondsLeft=15;
        this.doCountDown();
      }
    }, 1000);
  }

  set visible(value) {
    debugger;
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

  set opacity(value) {
    this.scene.userData.lightningMaterial.opacity = value;
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

export const CreateCountDownTimer = (scene, camera, renderer, composer, clock, width, height) => {
  return new CountDownTimer(scene, camera, renderer, composer, clock, width, height);
}
