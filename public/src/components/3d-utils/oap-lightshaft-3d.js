import * as THREE from 'three';

import { GetTextGeometry, GetTextMesh } from  './oap-cached-text-geometry';
import { Tween, Easing, update as UpdateTween } from 'es6-tween';
import { Get2DEmoji } from './oap-2d-emojis';

const vertexShader = ()=> {
  return `
  	#include <common>

		uniform float speed;
		uniform float time;
		uniform float timeOffset;
		varying vec2 vUv;
		varying float vAlpha;

		void main() {

			vec3 pos = position;

			float l = ( time * speed * 0.01 ) + timeOffset;
			float f = fract( l ); // linear time factor [0,1)
			float a = f * f; // quadratic time factor [0,1)

			// slightly animate the vertices of light shaft if necessary

			// pos.x += cos( l * 20.0 ) * sin( l * 10.0 );

			vAlpha = saturate( 0.7 + min( 1.0, a * 10.0 ) * ( sin( a * 40.0 ) * 0.25 ) );

		  vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
		}
  `.toString();
}

const fragmentShader = ()=> {
  return `
    uniform float attenuation;
    uniform vec3 color;
    uniform sampler2D colorTexture;

    varying vec2 vUv;
    varying float vAlpha;

    void main() {
      vec4 textureColor = texture2D( colorTexture, vUv );
      gl_FragColor = vec4( textureColor.rgb * color.rgb, textureColor.a * vAlpha );
      gl_FragColor.a *= pow( gl_FragCoord.z, attenuation );
    }
  `.toString();
}

class LightShaft3D {

  constructor (scene, camera, renderer, composer, clock, font3d, component, width, height) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.composer = composer;
    this.width = width;
    this.height = height;
    this.font3d = font3d;
    this.component = component;

    this.gameColors = [];
    Object.values(this.component .configFromServer.client_config.moduleTypeColorLookup).forEach((item) => {
      this.gameColors.push(item);
    });

    this.clock = clock;
    this.currentTime = 0;
    this.init();
  }

  init() {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load( 'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/clientAssets/3d/textures/lightShaft.png' );

    this.uniforms = {
      // controls how fast the ray attenuates when the camera comes closer
      attenuation: {
        value: 5
      },
      // controls the speed of the animation
      speed: {
        value: 25
      },
      // the color of the ray
      color: {
        value: new THREE.Color( 0xdadc9f ) // 0xdadc9f
      },
      // the visual representation of the ray highly depends on the used texture
      colorTexture: {
        value: texture
      },
      // global time value for animation
      time: {
        value: 0
      },
      // individual time offset so rays are animated differently if necessary
      timeOffset: {
        value: 0
      }
    };

    this.lightShaftMaterial = new THREE.ShaderMaterial( {
      uniforms: this.uniforms,
      vertexShader: vertexShader(),
      fragmentShader: fragmentShader(),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      side: THREE.DoubleSide
    } );

    var lightShaftGeometry = new THREE.PlaneBufferGeometry( 0.5, 5 );

    this.lightShafts = [];
    this.shaftGroup = new THREE.Group();
    for ( var i = 0; i < 5; i ++ ) {
      let lightShaft = new THREE.Mesh( lightShaftGeometry, this.lightShaftMaterial );
      lightShaft.position.x = - 1 + 1.5 * Math.sign( ( i % 2 ) );
      lightShaft.position.y = 1;
      lightShaft.position.z = - 1.5 + ( i * 0.5 );
      lightShaft.rotation.y = Math.PI * 0.2;
      lightShaft.rotation.z = Math.PI * - ( 0.15 + 0.1 * Math.random() );
      lightShaft.position.z = 34;
      lightShaft.position.y = 0;

      lightShaft.position.z = -50;
      lightShaft.position.x = 0.0;

      this.lightShaftTwean = new Tween(lightShaft.position)
      .to({ z: 35, x: -0.8}, 750)
      .delay(0)
      .on('complete', () => {
        this.lightShaftTwean = null;
      })
      .start();
      /* GOOD POSITIONS
            lightShaft.position.z = 31;
      lightShaft.position.y = 0;
      lightShaft.position.x = -0.3*/

      this.shaftGroup.add(lightShaft);
      this.lightShafts.push(lightShaft);
    }
    this.scene.add(this.shaftGroup);
    this.uniforms.color.value = new THREE.Color(this.gameColors[0]);
    this.cycleThroughGameColors();
  }

  async cycleThroughGameColors() {
    for (var i=0; i<this.gameColors.length; i++) {
      console.error("Set color: "+this.gameColors[i]);
      if (i<this.gameColors.length) {
        const newColor = new THREE.Color(this.gameColors[i]);
        this.colorTwean = new Tween({ r: this.uniforms.color.value.r, g: this.uniforms.color.value.g, b: this.uniforms.color.value.b})
        .to({ r: newColor.r, g: newColor.g, b: newColor.b }, 7000)
        .delay(0)
        .easing(Easing.Elastic.InOut)
        .on('update', (color)=>{
          this.uniforms.color.value = new THREE.Color(color.r, color.g, color.b);
          console.log()
        })
        .on('complete', () => {
          this.colorTwean = null;
        })
        .start();
      }
      await new Promise(resolve => setTimeout(resolve, 7000));
    }
    this.cycleThroughGameColors();
  }

  set visible(value) {
    if (this.lightShaft) {
      this.lightShaft.visible=value;
    }
  }

  get visible() {
    return this.lightShaft.visible;
  }

  remove() {
    this.scene.remove(this.shaftGroup);
  }


  getMaterial() {
    return this.lightShaftMaterial;
  }

  update () {
    const delta = this.clock.getDelta();
    this.uniforms.time.value += delta;
  }
}

export const CreateLightShaft3D = (scene, camera, renderer, composer, clock, font, component, width, height) => {
  return new LightShaft3D(scene, camera, renderer, composer, clock, font, component, width, height);
}
