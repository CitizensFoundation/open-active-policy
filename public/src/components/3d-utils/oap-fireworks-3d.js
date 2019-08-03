import * as THREE from 'three';

import { LightningStorm } from 'three/examples/jsm/objects/LightningStorm.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

const fragmentShader = () => {
  return `
    float scaleLinear(float value, vec2 valueDomain) {
      return (value - valueDomain.x) / (valueDomain.y - valueDomain.x);
    }

    float scaleLinear(float value, vec2 valueDomain, vec2 valueRange) {
      return mix(valueRange.x, valueRange.y, scaleLinear(value, valueDomain));
    }

    varying vec4 vColor;
    varying float lifeLeft;
    varying vec2 vUv;

    uniform sampler2D tSprite;

    void main() {

      float alpha = 0.;

      if( lifeLeft > .995 ) {
        alpha = scaleLinear( lifeLeft, vec2(1., .995), vec2(0., 1.));//mix( 0., 1., ( lifeLeft - .95 ) * 100. ) * .75;
      } else {
        alpha = lifeLeft * .75;
      }

      vec4 tex = texture2D( tSprite, gl_PointCoord );

      gl_FragColor = vec4( vColor.rgb * tex.a, alpha * tex.a );
    }
  `.toString();
}

const vertexShader = () => {
  return `
    precision highp float;
    const vec4 bitSh = vec4(256. * 256. * 256., 256. * 256., 256., 1.);
    const vec4 bitMsk = vec4(0.,vec3(1./256.0));
    const vec4 bitShifts = vec4(1.) / bitSh;

    #define FLOAT_MAX  1.70141184e38
    #define FLOAT_MIN  1.17549435e-38

    lowp vec4 encode_float(highp float v) {
      highp float av = abs(v);

      //Handle special cases
      if(av < FLOAT_MIN) {
        return vec4(0.0, 0.0, 0.0, 0.0);
      } else if(v > FLOAT_MAX) {
        return vec4(127.0, 128.0, 0.0, 0.0) / 255.0;
      } else if(v < -FLOAT_MAX) {
        return vec4(255.0, 128.0, 0.0, 0.0) / 255.0;
      }

      highp vec4 c = vec4(0,0,0,0);

      //Compute exponent and mantissa
      highp float e = floor(log2(av));
      highp float m = av * pow(2.0, -e) - 1.0;

      //Unpack mantissa
      c[1] = floor(128.0 * m);
      m -= c[1] / 128.0;
      c[2] = floor(32768.0 * m);
      m -= c[2] / 32768.0;
      c[3] = floor(8388608.0 * m);

      //Unpack exponent
      highp float ebias = e + 127.0;
      c[0] = floor(ebias / 2.0);
      ebias -= c[0] * 2.0;
      c[1] += floor(ebias) * 128.0;

      //Unpack sign bit
      c[0] += 128.0 * step(0.0, -v);

      //Scale back to range
      return c / 255.0;
    }

    vec4 pack(const in float depth)
    {
        const vec4 bit_shift = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);
        const vec4 bit_mask  = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);
        vec4 res = fract(depth * bit_shift);
        res -= res.xxyz * bit_mask;
        return res;
    }

    float unpack(const in vec4 rgba_depth)
    {
        const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);
        float depth = dot(rgba_depth, bit_shift);
        return depth;
    }

    uniform float uTime;
    uniform float uScale;
    uniform sampler2D tNoise;

    attribute vec4 particlePositionsStartTime;
    attribute vec4 particleVelColSizeLife;

    varying vec4 vColor;
    varying float lifeLeft;

    varying vec2 vUv;

    void main() {

      // unpack things from our attributes
      vColor = encode_float( particleVelColSizeLife.y );

      // convert our velocity back into a value we can use
      vec4 velTurb = encode_float( particleVelColSizeLife.x );
      vec3 velocity = vec3( velTurb.xyz );
      float turbulence = velTurb.w;
      vUv = uv;

      vec3 newPosition;

      float timeElapsed = uTime - particlePositionsStartTime.a;

      lifeLeft = 1. - (timeElapsed / particleVelColSizeLife.w);

      gl_PointSize = ( uScale * particleVelColSizeLife.z ) * lifeLeft;

      velocity.x = ( velocity.x - .5 ) * 3.;
      velocity.y = ( velocity.y - .5 ) * 3.;
      velocity.z = ( velocity.z - .5 ) * 3.;

      newPosition = particlePositionsStartTime.xyz + ( velocity * 10. ) * ( uTime - particlePositionsStartTime.a );

      vec3 noise = texture2D( tNoise, vec2( newPosition.x * .015 + (uTime * .05), newPosition.y * .02 + (uTime * .015) )).rgb;
      vec3 noiseVel = ( noise.rgb - .5 ) * 30.;

      newPosition = mix(newPosition, newPosition + vec3(noiseVel * ( turbulence * 5. ) ), (timeElapsed / particleVelColSizeLife.a) );

      // if( velocity.x < -.5 || velocity.y < -1. ) {
      //   lifeLeft = 0.;
      //   // newPosition = vec3(10000., 10000., 10000.);
      // }
      //
      if( velocity.y > 0. && velocity.y < .05 ) {
        lifeLeft = 0.;
      }

      if( velocity.x < -1.45 ) {
        lifeLeft = 0.;
      }

      if( timeElapsed > 0. ) {
        gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
      } else {
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        lifeLeft = 0.;
        gl_PointSize = 0.;
      }
    }
  `.toString();
}


const GPUParticleSystem = function( options ) {

  var self = this;
  var options = options || {};

  self.PARTICLE_COUNT = options.maxParticles || 1000000;
  self.PARTICLE_CONTAINERS = options.containerCount || 1;
  self.PARTICLES_PER_CONTAINER = Math.ceil( self.PARTICLE_COUNT / self.PARTICLE_CONTAINERS );
  self.PARTICLE_CURSOR = 0;
  self.time = 0;

  // preload a million random numbers
  self.rand = [];

  for(var i=1e5; i > 0; i--) {
    self.rand.push( Math.random() - .5 );
  }

  self.random = function() {
    return ++i >= self.rand.length ? self.rand[i=1] : self.rand[i];
  }

  self.particleNoiseTex = THREE.ImageUtils.loadTexture("/src/components/3d-utils/perlin-512.png");
  self.particleNoiseTex.wrapS = self.particleNoiseTex.wrapT = THREE.RepeatWrapping;

  self.particleSpriteTex = THREE.ImageUtils.loadTexture("/src/components/3d-utils/particle2.png");
  self.particleSpriteTex.wrapS = self.particleSpriteTex.wrapT = THREE.RepeatWrapping;

  self.particleShaderMat = new THREE.ShaderMaterial( {
    transparent: true,
    depthWrite: false,
		uniforms: {
			"uTime": { type: "f", value: 0.0 },
      "uScale": { type: "f", value: 1.0 },
    	"tNoise": { type: "t", value: self.particleNoiseTex },
      "tSprite": { type: "t", value: self.particleSpriteTex }
		},
    blending: THREE.AdditiveBlending,
		vertexShader: vertexShader(),
		fragmentShader: fragmentShader()
	} );

  /*
     attributes: {
      "particlePositionsStartTime": { type: "v4", value: [] },
      "particleVelColSizeLife": { type: "v4", value: [] }
    },*/
  self.particleShaderMat.defaultAttributeValues.particlePositionsStartTime = [0, 0, 0, 0];
  self.particleShaderMat.defaultAttributeValues.particleVelColSizeLife = [0, 0, 0, 0];
  self.particleContainers = [];

  // extend Object3D
	THREE.Object3D.apply(this, arguments);

  this.getMaterial = function () {
    return self.particleShaderMat;
  }

  this.init = function() {
    for( var i = 0; i < self.PARTICLE_CONTAINERS; i++ ) {
      var c = new GPUParticleContainer( self.PARTICLES_PER_CONTAINER, self );
      self.particleContainers.push( c );
      self.add( c );
    }
  }

  this.spawnParticle = function( options ) {
    self.PARTICLE_CURSOR++;
    if( self.PARTICLE_CURSOR >= self.PARTICLE_COUNT ) {
      self.PARTICLE_CURSOR = 1;
    }

    var currentContainer = self.particleContainers[ Math.floor( self.PARTICLE_CURSOR / self.PARTICLES_PER_CONTAINER ) ];

    currentContainer.spawnParticle( options );

  }

  this.update = function( time ) {
    for( var i = 0; i < self.PARTICLE_CONTAINERS; i++ ) {

      self.particleContainers[i].update( time );

    }
  };

  this.init();

}

GPUParticleSystem.prototype = Object.create(THREE.Object3D.prototype);
GPUParticleSystem.prototype.constructor = GPUParticleSystem;

const GPUParticleContainer = function( maxParticles, particleSystem ) {

  var self = this;
  self.PARTICLE_COUNT = maxParticles || 100000;
  self.PARTICLE_CURSOR = 0;
  self.time = 0;
  self.DPR = window.devicePixelRatio;
  self.GPUParticleSystem = particleSystem;

  var particlesPerArray = Math.floor( self.PARTICLE_COUNT / self.MAX_ATTRIBUTES );

  // extend Object3D
	THREE.Object3D.apply(this, arguments);

  // construct a couple small arrays used for packing variables into floats etc
  var UINT8_VIEW = new Uint8Array(4)
  var FLOAT_VIEW = new Float32Array(UINT8_VIEW.buffer)

  function decodeFloat(x, y, z, w) {
    UINT8_VIEW[0] = Math.floor(w)
    UINT8_VIEW[1] = Math.floor(z)
    UINT8_VIEW[2] = Math.floor(y)
    UINT8_VIEW[3] = Math.floor(x)
    return FLOAT_VIEW[0]
  }

  function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
  }

  function rgbToHex(r, g, b) {
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  function hexToRgb(hex) {
    var r = hex >> 16;
    var g = (hex & 0x00FF00) >> 8;
    var b = hex & 0x0000FF;

    if( r > 0 ) r--;
    if( g > 0 ) g--;
    if( b > 0 ) b--;

    return [r,g,b];
  };

  self.particles = [];
  self.deadParticles = [];
  self.particlesAvailableSlot = [];

  // create a container for particles
  self.particleUpdate = false;

  // Shader Based Particle System
  self.particleShaderGeo = new THREE.BufferGeometry();

  // new hyper compressed attributes
  self.particleVertices = new Float32Array( self.PARTICLE_COUNT * 3 ); // position
  self.particlePositionsStartTime = new Float32Array( self.PARTICLE_COUNT * 4 ); // position
  self.particleVelColSizeLife = new Float32Array( self.PARTICLE_COUNT * 4 );

  for ( var i = 0; i < self.PARTICLE_COUNT; i++ )
  {
    self.particlePositionsStartTime[ i*4 + 0 ] = 100; //x
    self.particlePositionsStartTime[ i*4 + 1 ] = 0; //y
    self.particlePositionsStartTime[ i*4 + 2 ] = 0.0;   //z
    self.particlePositionsStartTime[ i*4 + 3 ] = 0.0;   //startTime

  	self.particleVertices[ i*3 + 0 ] = 0; //x
  	self.particleVertices[ i*3 + 1 ] = 0; //y
  	self.particleVertices[ i*3 + 2 ] = 0.0;   //z

    self.particleVelColSizeLife[ i*4 + 0 ] = decodeFloat(128,128,0,0); //vel
  	self.particleVelColSizeLife[ i*4 + 1 ] = decodeFloat(0,254,0,254); //color
  	self.particleVelColSizeLife[ i*4 + 2 ] = 1.0;   //size
    self.particleVelColSizeLife[ i*4 + 3 ] = 0.0;   //lifespan
  }

  self.particleShaderGeo.addAttribute( 'position', new THREE.BufferAttribute( self.particleVertices, 3 ) );
  self.particleShaderGeo.addAttribute( 'particlePositionsStartTime', new THREE.DynamicBufferAttribute( self.particlePositionsStartTime, 4 ) );
  self.particleShaderGeo.addAttribute( 'particleVelColSizeLife', new THREE.DynamicBufferAttribute( self.particleVelColSizeLife, 4 ) );

  self.posStart = self.particleShaderGeo.getAttribute( 'particlePositionsStartTime' )
  self.velCol = self.particleShaderGeo.getAttribute( 'particleVelColSizeLife' );

  self.particleShaderMat = self.GPUParticleSystem.getMaterial();

  this.init = function() {
  		self.particleSystem = new THREE.Points( self.particleShaderGeo, self.particleShaderMat );
      self.particleSystem.frustumCulled = false;
  		this.add( self.particleSystem ) ;
  };

  var options = {}
    , position = new THREE.Vector3()
    , velocity = new THREE.Vector3()
    , positionRandomness = 0.
    , velocityRandomness = 0.
    , color = 0xffffff
    , colorRandomness = 0.
    , turbulence = 0.
    , lifetime = 0.
    , size = 0.
    , sizeRandomness = 0.
    , i;

  var maxVel = 2;
  var maxSource = 250;
  this.offset = 0;
  this.count = 0;

	this.spawnParticle = function( options ) {

    options = options || {};

    // setup reasonable default values for all arguments
    position = options.position !== undefined ? position.copy(options.position) : position.set(0., 0., 0.);
    velocity = options.velocity !== undefined ? velocity.copy(options.velocity) : velocity.set(0., 0., 0.);
    positionRandomness = options.positionRandomness !== undefined ? options.positionRandomness : 0.0;
    velocityRandomness = options.velocityRandomness !== undefined ? options.velocityRandomness : 0.0;
    color = options.color !== undefined ? options.color : 0xffffff;
    colorRandomness = options.colorRandomness !== undefined ? options.colorRandomness : 1.0;
    turbulence = options.turbulence !== undefined ? options.turbulence : 1.0;
    lifetime = options.lifetime !== undefined ? options.lifetime : 5.0;
    size = options.size !== undefined ? options.size : 10;
    sizeRandomness = options.sizeRandomness !== undefined ? options.sizeRandomness : 0.0;
    var smoothPosition = options.smoothPosition !== undefined ? options.smoothPosition : false;

    if( self.DPR !== undefined ) size *= self.DPR;

    i = self.PARTICLE_CURSOR;

  	self.posStart.array[ i*4 + 0 ] = position.x + ( ( particleSystem.random() ) * positionRandomness );// - ( velocity.x * particleSystem.random() ); //x
  	self.posStart.array[ i*4 + 1 ] = position.y + ( ( particleSystem.random() ) * positionRandomness );// - ( velocity.y * particleSystem.random() ); //y
  	self.posStart.array[ i*4 + 2 ] = position.z + ( ( particleSystem.random() ) * positionRandomness );// - ( velocity.z * particleSystem.random() ); //z
    self.posStart.array[ i*4 + 3 ] = self.time + ( particleSystem.random() * 2e-2 ); //startTime

    if( smoothPosition === true ) {
      self.posStart.array[ i*4 + 0 ] +=  - ( velocity.x * particleSystem.random() ); //x
    	self.posStart.array[ i*4 + 1 ] +=  - ( velocity.y * particleSystem.random() ); //y
    	self.posStart.array[ i*4 + 2 ] +=  - ( velocity.z * particleSystem.random() ); //z
    }

    var velX = velocity.x + ( particleSystem.random() ) * velocityRandomness;
    var velY = velocity.y + ( particleSystem.random() ) * velocityRandomness;
    var velZ = velocity.z + ( particleSystem.random() ) * velocityRandomness;

    // convert turbulence rating to something we can pack into a vec4
    var turbulence = Math.floor( turbulence * 254 );

    // clamp our value to between 0. and 1.
    velX = Math.floor( maxSource * ( ( velX - -maxVel ) / ( maxVel - -maxVel ) ) );
    velY = Math.floor( maxSource * ( ( velY - -maxVel ) / ( maxVel - -maxVel ) ) );
    velZ = Math.floor( maxSource * ( ( velZ - -maxVel ) / ( maxVel - -maxVel ) ) );

    self.velCol.array[ i*4 + 0 ] = decodeFloat( velX, velY, velZ, turbulence ); //vel

    var rgb = hexToRgb( color );

    for( var c = 0; c < rgb.length; c++) {
      rgb[c] = Math.floor( rgb[c] + ( ( particleSystem.random() ) * colorRandomness ) * 254 );
      if( rgb[c] > 254 ) rgb[c] = 254;
      if( rgb[c] < 0 ) rgb[c] = 0;
    }

    self.velCol.array[ i*4 + 1 ] = decodeFloat( rgb[0], rgb[1], rgb[2], 254 );//color
	  self.velCol.array[ i*4 + 2 ] = size + ( particleSystem.random() ) * sizeRandomness;   //size
    self.velCol.array[ i*4 + 3 ] = lifetime;   //lifespan

    if( this.offset == 0 ) {
      this.offset = self.PARTICLE_CURSOR;
    }

    self.count++;

    self.PARTICLE_CURSOR++;

    if( self.PARTICLE_CURSOR >= self.PARTICLE_COUNT ) {
      self.PARTICLE_CURSOR = 0;
    }

    self.particleUpdate = true;

	}

  this.update = function( time ) {

    self.time = time;
    self.particleShaderMat.uniforms['uTime'].value = time;

    this.geometryUpdate();

  };

  this.geometryUpdate = function() {
    if( self.particleUpdate == true ) {
      self.particleUpdate = false;

      // if we can get away with a partial buffer update, do so
      if( self.offset + self.count < self.PARTICLE_COUNT ) {
        self.posStart.updateRange.offset = self.velCol.updateRange.offset = self.offset * 4;
        self.posStart.updateRange.count = self.velCol.updateRange.count = self.count * 4;
      } else {
        self.posStart.updateRange.offset = 0;
        self.posStart.updateRange.count = self.velCol.updateRange.count = ( self.PARTICLE_COUNT * 4 );
      }

      self.posStart.needsUpdate = true;
      self.velCol.needsUpdate = true;

      self.offset = 0;
      self.count = 0;
    }
  }

  this.init();

}

GPUParticleContainer.prototype = Object.create(THREE.Object3D.prototype);
GPUParticleContainer.prototype.constructor = GPUParticleContainer;
let fireworkCounter = 0;

class Firework {

  constructor(particleSystem) {
    this.particleSystem = particleSystem;
    this.startTime = -1;
    this.lifespan = 2;
    this.color = 0x444444;
    this.particleRate = 10;
    this.smokeRate = 1000;
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.gravity = new THREE.Vector3( 0, -50, 0 );
    this.alive = true;
    this.spherePoint = new THREE.Vector3()
    this.i=1e4;

    this.randomSpherePoints = [];
    for(this.i=1e4; this.i > 0; this.i--) {
      this.randomSpherePoints.push( this.randomSpherePoint(1) );
    }
    this.prevTime = this.startTime;
    this.delta = 0;
    this.velDelta = new THREE.Vector3();
    this.pos = new THREE.Vector3();
    this.vel = new THREE.Vector3();

    this.explosionSounds = ['fireworks_01.ogg','fireworks_02.ogg','fireworks_03.ogg','fireworks_04.ogg'];
    fireworkCounter++;
  }


  randomSpherePoint(radius){
    var u = Math.random();
    var v = Math.random();
    var theta = Math.PI * 2 * u;
    var phi = Math.acos(2 * v - 1);
    var x = (radius * Math.sin(phi) * Math.cos(theta));
    var y = (radius * Math.sin(phi) * Math.sin(theta));
    var z = (radius * Math.cos(phi));
    this.spherePoint.set( x, y, z ).normalize().multiplyScalar(2);
    return this.spherePoint.clone();
  }

  getRandomSpherePoint () {
    return ++this.i >= this.randomSpherePoints.length ? this.randomSpherePoints[this.i=1] : this.randomSpherePoints[this.i];
  }

  update( delta ) {
    this.delta = delta;
    this.lifespan -= this.delta;

    if( this.lifespan > 0 ) {

      this.velDelta.copy( this.gravity ).multiplyScalar( this.delta );
      this.velocity.add( this.velDelta );

      this.velDelta.copy( this.velocity ).multiplyScalar( this.delta );
      this.position.add( this.velDelta );

      // spawn a smoke trail
      for( var i = 0; i < this.smokeRate * this.delta; i++ ) {
        this.pos.addVectors( new THREE.Vector3().copy( this.velDelta ).multiplyScalar( Math.random() ), this.position );
        this.particleSystem.spawnParticle({ position: this.pos, positionRandomness: .125, smoothPosition: true, velocityRandomness: .65, size: 12.5, sizeRandomness: 15, turbulence: .25, colorRandomness: .05, lifetime: 1, color: this.color });
      }

    } else {

      // explode and die
      var explodeColor = 0xffffff * Math.random();
      var explodeColor2 = 0xffffff;
      var smokeColor = 0x080808;

      // AudioSystem.playSound( explosionSounds[ fireworkCounter % explosionSounds.length ] );

      // fireball
      for( var i = 0; i < this.particleRate; i++ ) {
        this.pos.addVectors( new THREE.Vector3().copy( this.velDelta ).multiplyScalar( Math.random() ), this.position );
        this.particleSystem.spawnParticle({ position: this.pos, positionRandomness: .85, velocityRandomness: 0, size: 12.5, sizeRandomness: 15, turbulence: .052, colorRandomness: .05, lifetime: 1.25, color: 0xffaa77 });
      }

      // main explosion
      var mainExplosionTemplate = { position: this.position, positionRandomness: 0, velocity: this.spherePoint, velocityRandomness: .40, size: 12, sizeRandomness: 1, turbulence: .075, colorRandomness: .3, lifetime: 2, color: explodeColor };
      for( var i = 0; i < this.particleRate * 15; i++ ) {
        mainExplosionTemplate.velocity = this.getRandomSpherePoint();
        this.particleSystem.spawnParticle( mainExplosionTemplate );
      }

      var explosionTemplate = { position: this.position, positionRandomness: 0.12, velocity: this.spherePoint.multiplyScalar(.32), velocityRandomness: 0, size: 6, sizeRandomness: 0, turbulence: .025, colorRandomness: .1, lifetime: .95, color: explodeColor2 };
      var explosionPoint = new THREE.Vector3();
      for( var i = 0; i < this.particleRate * 2; i++ ) {
        explosionPoint.copy( this.getRandomSpherePoint() );
        explosionTemplate.velocity = explosionPoint.multiplyScalar(.32);
        this.particleSystem.spawnParticle( explosionTemplate );
      }

      var explosionSmokeTemplate = { position: this.position, positionRandomness:1, velocityRandomness: 1, size: 90, sizeRandomness: 0, turbulence: .5, colorRandomness: 0, lifetime: 4, color: smokeColor };
      for( var i = 0; i < this.particleRate; i++ ) {
        this.particleSystem.spawnParticle( explosionSmokeTemplate );
      }

      this.alive = false;
    }

  }

}

class GPUFireworks3D {

  constructor (scene, camera, renderer, composer, clock, width, height) {
    if (window.innerWidth<600) {
      this.MAX_PARTICLES = 2000;
      this.MAX_FIREWORKS = 2;
    } else {
      this.MAX_PARTICLES = 250000;
      this.MAX_FIREWORKS = 7;
    }
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.composer = composer;
    this.width = width;
    this.height = height;
    this.clock = clock;
    this.tick = 0;
    this.effects = [];
    this.sourcePos = new THREE.Vector3();
	  this.fireworks = [];
    this.init();
    this.particleSystem = new GPUParticleSystem( {
			maxParticles:this.MAX_PARTICLES ? this.MAX_PARTICLES : 250000,
			containerCount: this.PARTICLE_CONTAINERS ? this.PARTICLE_CONTAINERS : 1
    } );
    this.particleSystem.position.x = 0;
    this.particleSystem.position.y = -5;
    this.particleSystem.position.z = -10;
    this.particleSystem.visible = false;
    this.scene.add(this.particleSystem);
  }

  init() {
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.setupScene();
  }

  set visible(value) {
    this.particleSystem.visible=value;
  }

  get visible() {
    return this.particleSystem.visible;
  }

  set opacity(value) {
    this.particleSystem.materia.opacity = value;
  }

  get material() {
    return this.particleSystem.getMaterial();
  }

  setupScene() {
    /*
		const effect1 = new THREE.ShaderPass( THREE.HorizontalBlurShader );
		effect1.uniforms['h'].value = 1 / 1548
		self.composer.addPass( effect1 );
		self.effects.push( effect1 );

    const effect2 = new THREE.ShaderPass( THREE.FilmShader );
		self.composer.addPass( effect2 );
		effect2.uniforms['sIntensity'].value = 0;
		effect2.uniforms['grayscale'].value = false;
		effect2.uniforms['nIntensity'].value = .6;
		self.effects.push( effect );
    effect2.renderToScreen = true;*/
  }

  spawnFirework() {
		var f = new Firework(this.particleSystem );
		f.position.y = -35;
		// f.position.x = ( Math.random() - .5 ) * 50;
		f.velocity.set( ( Math.random() - .5 ) * 20, ( Math.random() * 2.5 ) + 70, ( Math.random() - .5 ) * 20);
		f.lifespan = Math.random() * 1.3 + 1;
		this.fireworks.push( f );
		// AudioSystem.playSound('fireworks_00.ogg');
	}

  update () {
		// get the elapsed time for the project
    var delta = 0;
    delta = this.clock.getDelta() * 1.0;
    this.tick += delta;

    if( delta > 0 ) {

  		if( this.fireworks.length < this.MAX_FIREWORKS ) {
  			this.spawnFirework();
  		}

  		var deadFireworks = [];

  		for( var i = 0; i < this.fireworks.length; i++ ) {
  				this.fireworks[i].update( delta );
  				if( !this.fireworks[i].alive ) {
  					deadFireworks.push( this.fireworks[i] );
  				}
  		}

  		// remove all dead fireworks
  		for( var i = 0; i < deadFireworks.length; i++ ) {
  			this.fireworks.splice( this.fireworks.indexOf( deadFireworks[i] ), 1 );
  		}

    }
		// update the particle system
    this.particleSystem.update(this.tick );
  }
}

export const CreateGPUFireworks3D = (scene, camera, renderer, composer, clock, width, height) => {
  return new GPUFireworks3D(scene, camera, renderer, composer, clock, width, height);
}
