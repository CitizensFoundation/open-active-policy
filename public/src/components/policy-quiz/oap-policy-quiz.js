import { html, supportsAdoptingStyleSheets } from 'lit-element';
import '@polymer/paper-button/paper-button';

import { Scene, DirectionalLight, Clock, PerspectiveCamera, Vector3, TextGeometry, Color, FontLoader, BufferGeometry, Shape, Mesh, WebGLRenderer, ExtrudeGeometry, MeshPhongMaterial} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

import { OapPageViewElement } from '../oap-page-view-element';
import { OapPolicyQuizStyles } from './oap-policy-quiz-styles';
import { OapFlexLayout } from '../oap-flex-layout';
import { OapShadowStyles } from '../oap-shadow-styles';
import { Tween, Easing, update as UpdateTween } from 'es6-tween';
import { CreateLightning3D } from '../3d-utils/oap-lightning-3d';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { CreateGPUFireworks3D } from '../3d-utils/oap-fireworks-3d';
import { CreateCountDownTimer3D } from '../3d-utils/oap-countdown-timer-3d';
import { StartEarlyDelayedFontCaching } from '../3d-utils/oap-cached-text-geometry';
import { CreateLightShaft3D } from '../3d-utils/oap-lightshaft-3d';

class OapPolicyQuiz extends OapPageViewElement {
  static get properties() {
    return {
      questions: Array,
      currentQuestionIndex: Number,
      correctAnswers: Number,
      incorrectAnswers: Number,
      nickname: String,
      configFromServer: Object,
      savedBackgroundColor: String,
      shapes3d: Object,
      renderer: Object,
      scene: Object,
      camera: Object,
      font3d: Object,
      dirLightOne: Object,
      dirLightTwo: Object,
      submitDisabled: Boolean,
      totalChoicePoints: Number,
      introMode: Boolean
    };
  }

  static get styles() {
    return [
      OapPolicyQuizStyles,
      OapFlexLayout,
      OapShadowStyles
    ];
  }

  constructor() {
    super();
    this.currentIndex = null;
    this.shapes3d = [];
    this.submitDisabled = false;
    this.updateLighting3d = false;
    this.updateFireworks3d = false;
    this.introMode=true;
  }

  startIntro() {
    this.countdownTimer3d.startIntro();
  }

  disableLightShaft() {
    this.lightShaft3d.remove();
    this.updateLightShaft3d = false;
  }

  disableLightShaftAfterNextAnswer() {
    this.disableLightShaftAfterNext = true;
  }

  introFinished() {
    this.introMode=false;
    setTimeout(()=>{
      this.startCountDown();
    }, 10);
  }

  start() {
    this.reset();
    var width=window.innerWidth;
    var height=420;

    setTimeout(()=>{
      this.scene = new Scene();
      this.camera = new PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 1000 );
      this.camera.position.set( 0, 0, 50 );
      this.scene.add( this.camera );

      this.dirLightOne = new DirectionalLight(0x1d5588, 2.0);
      this.dirLightOne.position.x = -500;
      this.dirLightOne.position.y = 500;
      this.camera.add( this.dirLightOne );

      this.dirLightTwo = new DirectionalLight(0x1d5588, 1.0);
      this.dirLightTwo.position.x = 500;
      this.dirLightTwo.position.y = -500;
      this.dirLightTwo.position.z = -150;
      this.camera.add( this.dirLightTwo );

      this.scene.background = new Color( '#000' );
      this.savedBackgroundColor = this.$$("#button0").style.backgroundColor;
      var geometry = new TextGeometry( "?", {
        font: this.font3d,
        size: 180,
        height: 20,
        curveSegments: 32,
        bevelEnabled: true,
        bevelThickness: 9,
        bevelSize: 5,
        bevelOffset: 0,
        bevelSegments: 18
      });

      geometry.computeBoundingBox();
      geometry.computeVertexNormals();
      geometry.center();

      geometry = new BufferGeometry().fromGeometry( geometry );

      var materials = [
        new MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
        new MeshPhongMaterial( { color: 0xffffff } ) // side
      ];

      if (window.innerWidth<=600) {
        width=window.innerWidth;
      }

      for (var i=-width/2; i<width/2; i+=30+Math.random()*60){
        for (var j=0; j<height; j+=30+Math.random()*60){
          this.addShape( geometry,  materials, '#aaaaaa',   i, j, 0,
                   Math.random()*0.8, Math.random()*0.8, Math.PI, 0.1+Math.random()*0.3 );
        }
      }

      this.renderer = new WebGLRenderer( { antialias: true } );
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( width, height );
      var canvas = this.$$("#canvas3d");

      canvas.appendChild( this.renderer.domElement );

      this.composer = new EffectComposer( this.renderer );
    //this.controls = new OrbitControls(this.camera, this.renderer.domElement);

      if (false) {
        let target = new Vector3(6, 140, 220);

        new Tween(this.camera.position)
        .to({ x: target.x, y: target.y, z: target.z, }, 1*500)
        .delay(0)
        .easing(Easing.Quadratic.In)
        .on('complete', () => {
          target = new Vector3(6, 140, 220);
          new Tween(this.camera.position)
          .to({ x: target.x, y: target.y, z: target.z, }, 72*1000)
          .delay(0)
          .easing(Easing.Elastic.Out)
          .on('complete', () => {
          })
          .start();
        })
        .start();
      }
      this.clock = new Clock();
      this.composer.setSize( width, height);
      this.composer.passes = [];
      this.renderPass = new RenderPass( this.scene, this.camera );
      this.composer.addPass(this.renderPass);

      this.lightShaft3d = CreateLightShaft3D(this.scene, this.camera, this.renderer, this.composer, this.clock, this.font3d, this, width, height);
      this.updateLightShaft3d= true;

      this.renderCanvas3d();

      setTimeout(()=> {
        this.countdownTimer3d = CreateCountDownTimer3D(this.scene, this.camera, this.renderer, this.composer, this.clock, this.font3d, this, width, height);
        this.updateCountDown3dTimer = true;
      })

      setTimeout(()=>{
        this.lightning3d = CreateLightning3D(this.scene, this.camera, this.renderer, this.composer, this.clock, width, height);
      }, 500);

      setTimeout(()=>{
        this.fireworks3d = CreateGPUFireworks3D(this.scene, this.camera, this.renderer, this.composer, this.clock, width, height);
        this.updateFireworks3d = true;
      }, 700);

    }, 1);
  }

  addShape( geometry, materials, color, x, y, z, rx, ry, rz, s ) {
    return;
    mesh.position.set( x+25, y-50, z );
    mesh.rotation.set( rx, ry, rz );
    mesh.scale.set( s, s, s );
    this.shapes3d.push({shape: mesh, x: Math.random(), y: Math.random(), z: Math.random()});
    this.scene.add(mesh)
  }

  stop() {
    while(this.scene.children.length > 0){
      this.scene.remove(this.scene.children[0]);
    }
    this.scene.remove();
  }

  animate() {
    var speed = 0.05;
    this.shapes3d.forEach(el => {
      el.shape.rotation.x += el.x * speed;
      el.shape.rotation.y += el.y * speed;
      el.shape.rotation.z += el.z * speed;
    });
  }

  renderCanvas3d() {
    requestAnimationFrame(this.renderCanvas3d.bind(this));
    //this.animate();
    UpdateTween();
    if (this.lightning3d && this.updateLighting3d) {
      this.lightning3d.update();
    }

    if (this.fireworks3d && this.updateFireworks3d) {
      this.fireworks3d.update()
    }

    if (this.countdownTimer3d && this.updateCountDown3dTimer) {
      this.countdownTimer3d.update()
    }

    if (this.lightShaft3d && this.updateLightShaft3d) {
      this.lightShaft3d.update()
    }

    //this.controls.update();

    this.composer.render(this.clock.getDelta());
  }

  reset() {
    this.completed = false;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.currentIndex = 0;
    this.submitDisabled = false;
  }

  render() {
    return html`
      <div class="layout-inline vertical">
        <div id="canvas3d"></div>
        <div class="topContainer">
          ${this.currentIndex!==null ?  html`
            <div class="layout horizontal progress" ?intro-mode="${this.introMode}">
              <div class="middle textLeft">${this.localize("question")} ${this.currentIndex+1}/${this.questions.length}</div>
              <div class="middle textRight">${this.localize("youHave")} ${this.totalChoicePoints}cp</div>
            </div>
            <div class="question" ?intro-mode="${this.introMode}">${this.questions[this.currentIndex].question}</div>
            <div class="buttonContainer" ?intro-mode="${this.introMode}">
              <paper-button raised ?disabled="${this.submitDisabled}" id="button0" class="answerButton flex" @click="${()=> { this.submitAnswer(0) }}">${this.questions[this.currentIndex].answers[0]}</paper-button>
              <paper-button raised ?disabled="${this.submitDisabled}" id="button1" class="answerButton flex" @click="${()=> { this.submitAnswer(1) }}">${this.questions[this.currentIndex].answers[1]}</paper-button>
              <paper-button raised ?disabled="${this.submitDisabled}" id="button2" class="answerButton flex" @click="${()=> { this.submitAnswer(2) }}">${this.questions[this.currentIndex].answers[2]}</paper-button>
              <paper-button raised ?disabled="${this.submitDisabled}" id="button3" class="answerButton flex" @click="${()=> { this.submitAnswer(3) }}">${this.questions[this.currentIndex].answers[3]}</paper-button>
            </div>
          ` : html``}
        </div>
        ${this.completed ? html`
          <div class="vertical center-center completedQuiz">
            <div class="completeHeader">
              ${this.localize("youHaveCompletedTheQuiz")}
            </div>
            <div>
              ${this.localize("correctQuizAnswers")}: ${this.correctAnswers}
            </div>
            <div>
              ${this.localize("incorrectQuizAnswers")}: ${this.incorrectAnswers}
            </div>
            <div class="buttonContainer">
              <paper-button raised class="answerButton continueButton" @click="${this.quizFinished}">${this.localize("continueToCountryCreation")}</paper-button>
            </div>
          </div>
        ` : html``}
      </div>
    `
  }

  quizFinished() {
    this.fire('oap-quiz-finished');
    this.stop();
  }

  correctAnswerColorAnimation() {
    let col = new Color('#39FF14');

    [this.dirLightOne, this.dirLightTwo].forEach((ligth) => {
      new Tween(ligth.color)
      .to({ r: col.r, g: col.g, b: col.b, }, 25)
      .delay(0)
      .easing(Easing.Quadratic.InOut)
      .on('complete', () => {
         col = new Color('#1d5588');
         new Tween(ligth.color)
        .to({ r: col.r, g: col.g, b: col.b, }, 450)
        .delay(1200)
        .easing(Easing.Quadratic.InOut)
        .on('complete', () => {
        })
        .start();
      })
      .start();
    });

    this.fireworks3d.visible = true;
    this.fireworks3d.material.opacity = 1.0;
    this.updateFireworks3d = true;

    setTimeout(()=>{
      this.fireworks3d.material.transparent = true;
      new Tween(this.fireworks3d.material)
      .to({ opacity: 0.0 }, 1000)
      .on('complete', () => {
        this.fireworks3d.visible = false;
        this.updateFireworks3d = false;
      })
      .start();
    }, 2200);

  }

  wrongAnswerColorAnimation() {
    let col = new Color('#d6483d');

    [this.dirLightOne, this.dirLightTwo].forEach((ligth) => {
      new Tween(ligth.color)
      .to({ r: col.r, g: col.g, b: col.b, }, 25)
      .delay(0)
      .on('complete', () => {
         col = new Color('#1d5588');
         new Tween(ligth.color)
        .to({ r: col.r, g: col.g, b: col.b, }, 320)
        .delay(1350)
        .on('complete', () => {
        })
        .start();
      })
      .start();
    });

    this.lightning3d.visible = true;
    this.lightning3d.outlinePass.edgeGlow = 0.7;
    this.lightning3d.outlinePass.edgeStrength = 2.5;
    this.lightning3d.outlinePass.edgeThickness = 2.8;
    this.lightning3d.material.opacity = 1.0;
    this.updateLighting3d = true;

    setTimeout(()=>{
      this.lightning3d.material.transparent = true;
      new Tween(this.lightning3d.material)
      .to({ opacity: 0.0 }, 600)
      .on('complete', () => {
        this.lightning3d.material.transparent = false;
        this.lightning3d.visible = false;
        this.updateLighting3d = false;
      })
      .start();

      new Tween(this.lightning3d.outlinePass)
      .to({ edgeGlow: 0.0, edgeStrength: 0.0, edgeThickness: 0.0 }, 600)
      .on('complete', () => {
      })
      .start();
    }, 2000);
  }

  ranOutOfTime() {
    if (this.currentIndex!==null) {
      this.submitAnswer("blah");
    }
    console.log("Rand out of time");
  }

  submitAnswer (answer) {
    this.submitDisabled = true;
    let wasIsCorrect = false;
    const correctAnswer = this.questions[this.currentIndex].correctAnswer;
    if (answer==correctAnswer) {
      wasIsCorrect = true;
      this.correctAnswerColorAnimation();
      this.correctAnswers+=1;
      this.countdownTimer3d.stopCountDownWin();
      /*this.$$("#button"+answer).animate([
        { transform: "scale(1.3)", easing: 'ease-in' },
        { transform: "scale(1.0)", easing: 'ease-out' }
      ], {
        duration: 600,
        iterations: 1
      });*/
      this.fire("oap-process-correct-quiz-answer");
      if (this.countdownTimer3d) {
        this.countdownTimer3d.showWinPoints();
      }
    } else {
      this.fire("oap-overlay", {
        html: html`${this.localize("incorrectAnswer")}`,
        soundEffect: "",
        duration: 300,
      })
      this.countdownTimer3d.stopCountDownFail();
      this.wrongAnswerColorAnimation();
      this.incorrectAnswers+=1;
      /*this.$$("#button"+answer).animate([
        { transform: "translateX(-3px)", easing: 'ease-in' },
        { transform: "translateX(3px)", easing: 'ease-out' },
        { transform: "translateX(-5px)", easing: 'ease-in' },
        { transform: "translateX(5px)", easing: 'ease-out' },
        { transform: "translateX(-7px)", easing: 'ease-in' },
        { transform: "translateX(7px)", easing: 'ease-out' },
      ], {
        duration: 500,
        iterations: 1
      });*/
      this.activity('answerSubmitted', 'quiz');
    }

    window.requestAnimationFrame(()=>{
      this.$$("#button"+correctAnswer).classList.add("rightAnswer");
      const incorrectButtons = [0,1,2,3].filter(item => item !== correctAnswer);
      incorrectButtons.forEach( (buttonId) => {
        this.$$("#button"+buttonId).classList.add("wrongAnswer");
      });
    });

    setTimeout( ()=> {
      this.resetAllButtons();
      if (this.currentIndex<this.questions.length-1) {
        this.currentIndex+=1;
        this.countdownTimer3d.startCountDown();
        this.requestUpdate();
      } else {
        this.currentIndex=null;
        this.completed=true;
        this.requestUpdate();
        this.fire("oap-sound-effect","quizCompleted");
      }
      this.submitDisabled=false;
    }, window.debugOn===true ? 100 : (wasIsCorrect ? 3300 : 2700));

    if (this.disableLightShaftAfterNext) {
      this.disableLightShaftAfterNext = false;
      setTimeout(()=>{
        this.disableLightShaft();
      }, 50);
    }
  }

  startCountDown() {
    if (this.countdownTimer3d) {
      this.countdownTimer3d.startCountDown();
    } else {
      config.error("No countdownTimer3d");
    }
  }

  resetAllButtons() {
    [0,1,2,3].forEach( (buttonId) => {
      this.$$("#button"+buttonId).style.backgroundColor=this.savedBackgroundColor;
      this.$$("#button"+buttonId).selected=false;
      this.$$("#button"+buttonId).focused=false;
      this.$$("#button"+buttonId).classList.remove("wrongAnswer","rightAnswer");
    });
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('questions')) {
      if (this.questions) {
        this.reset();
      }
    }

    if (changedProps.has('font3d') && this.font3d) {
      this.start();
      StartEarlyDelayedFontCaching(this.font3d);
    }
  }
}

window.customElements.define('oap-policy-quiz', OapPolicyQuiz);
