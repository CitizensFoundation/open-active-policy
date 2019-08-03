import * as THREE from 'three';

import { LightningStorm } from 'three/examples/jsm/objects/LightningStorm.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

class Lightning3D {

  constructor (scene, camera, renderer, composer, clock, width, height) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.composer = composer;
    this.width = width;
    this.height = height;

    this.clock = clock;
    this.raycaster = new THREE.Raycaster();
    this.currentTime = 0;
    this.init();
  }

  init() {
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.setupScene();
  }

  set visible(value) {
    if (value===true) {
      this.addRenderPass()
    } else {
      this.removeRenderPass();
    }
    this.storm.visible=value;
  }

  get visible() {
    return this.storm.visible;
  }

  set opacity(value) {
    this.scene.userData.lightningMaterial.opacity = value;
  }

  get material() {
    return this.scene.userData.lightningMaterial;
  }

  getEdgeGlow() {
    return this.edgeGlow;
  }

  getOutLinePass() {
    return this.outlinePass;
  }
  removeStorm() {
    this.scene.remove( this.storm );
  }

  setupScene() {
    this.scene.userData.canGoBackwardsInTime = false;
    this.scene.userData.camera = this.camera;

    this.scene.userData.lightningColor = new THREE.Color( 0xffd5b0 );
    this.scene.userData.outlineColor = new THREE.Color( 0xFF0000 );

    this.scene.userData.lightningMaterial = new THREE.MeshBasicMaterial( { color: this.scene.userData.lightningColor } );

    var rayDirection = new THREE.Vector3( 0, - 1, 0 );
    var rayLength = 0;
    var vec1 = new THREE.Vector3();
    var vec2 = new THREE.Vector3();

    this.scene.userData.rayParams = {
      radius0: 1,
      radius1: 0.5,
      minRadius: 0.3,
      maxIterations: 7,

      timeScale: 0.15,
      propagationTimeFactor: 0.2,
      vanishingTimeFactor: 0.9,
      subrayPeriod: 4,
      subrayDutyCycle: 0.6,

      maxSubrayRecursion: 3,
      ramification: 3,
      recursionProbability: 0.4,

      roughness: 0.85,
      straightness: 0.65,

      onSubrayCreation: function ( segment, parentSubray, childSubray, lightningStrike ) {

        lightningStrike.subrayConePosition( segment, parentSubray, childSubray, 0.6, 0.6, 0.5 );

        // Plane projection

        rayLength = lightningStrike.rayParameters.sourceOffset.y;
        vec1.subVectors( childSubray.pos1, lightningStrike.rayParameters.sourceOffset );
        var proj = rayDirection.dot( vec1 );
        vec2.copy( rayDirection ).multiplyScalar( proj );
        vec1.sub( vec2 );
        var scale = proj / rayLength > 0.5 ? rayLength / proj : 1;
        vec2.multiplyScalar( scale );
        vec1.add( vec2 );
        childSubray.pos1.addVectors( vec1, lightningStrike.rayParameters.sourceOffset );

      }

    };

    var GROUND_SIZE = 64;

    this.storm = new LightningStorm( {

      size: GROUND_SIZE,
      minHeight: 90,
      maxHeight: 200,
      maxSlope: 0.6,
      maxLightnings: 16,

      lightningParameters: this.scene.userData.rayParams,

      lightningMaterial: this.scene.userData.lightningMaterial,

      onLightningDown: function ( lightning ) {

      }

    });

    this.scene.userData.timeRate = 1;
    this.scene.add( this.storm );
    this.createRenderPasses();
    this.composer.addPass( this.outlinePass );
    this.outlinePass.enabled = false;
    this.storm.visible = false;
  }

  addRenderPass() {
    this.outlinePass.enabled = true;
  }

  removeRenderPass() {
    this.outlinePass.enabled = false;
  }

  createRenderPasses() {
    this.outlinePass = new OutlinePass( new THREE.Vector2( this.width, this.height ), this.scene, this.scene.userData.camera, this.storm.lightningsMeshes );
    this.outlinePass.edgeStrength = 2.5;
    this.outlinePass.edgeGlow = 0.7;
    this.outlinePass.edgeThickness = 2.8;
    this.outlinePass.visibleEdgeColor = this.scene.userData.outlineColor;
    this.outlinePass.hiddenEdgeColor.set( 0 );
    this.outlinePass.renderToScreen = true;
    this.scene.userData.outlineEnabled = true;
  }

  update () {
    this.currentTime += this.scene.userData.timeRate * this.clock.getDelta();
    if ( this.currentTime < 0 ) {
      this.currentTime = 0;
    }

    this.storm.update( this.currentTime );
  }
}

export const CreateLightning3D = (scene, camera, renderer, composer, clock, width, height) => {
  return new Lightning3D(scene, camera, renderer, composer, clock, width, height);
}
