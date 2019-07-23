import { html, supportsAdoptingStyleSheets } from 'lit-element';
import '@polymer/paper-button/paper-button';

import { Scene, DirectionalLight, PerspectiveCamera, Color, Shape, Mesh, WebGLRenderer, ExtrudeGeometry, MeshPhongMaterial} from 'three';

import { OapPageViewElement } from '../oap-page-view-element';
import { OapPolicyQuizStyles } from './oap-policy-quiz-styles';
import { OapFlexLayout } from '../oap-flex-layout';
import { OapShadowStyles } from '../oap-shadow-styles';

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
      camera: Object
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
  }

  start() {
    this.reset();
    setTimeout(()=>{
      this.scene = new Scene();
      this.camera = new PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
      this.camera.position.set( 0, 50, 250 );
      this.scene.add( this.camera );

      var light = new DirectionalLight(0x9955ff, 2);
      light.position.x = -500;
      light.position.y = 500;
      this.camera.add( light );

      var light = new DirectionalLight(0x9955ff, 1);
      light.position.x = 500;
      light.position.y = -500;
      light.position.z = -150;
      this.camera.add( light );

      this.scene.background = new Color( '#993355' );

      var x = -25, y = -250;
      var heartShape = new Shape();
      heartShape.moveTo( x + 25, y + 25 );
      heartShape.bezierCurveTo( x + 25, y + 25, x + 20, y, x, y );
      heartShape.bezierCurveTo( x - 30, y, x - 30, y + 35,x - 30,y + 35 );
      heartShape.bezierCurveTo( x - 30, y + 55, x - 10, y + 77, x + 25, y + 95 );
      heartShape.bezierCurveTo( x + 60, y + 77, x + 80, y + 55, x + 80, y + 35 );
      heartShape.bezierCurveTo( x + 80, y + 35, x + 80, y, x + 50, y );
      heartShape.bezierCurveTo( x + 35, y, x + 25, y + 25, x + 25, y + 25 );

      var extrudeSettings = { amount: 1, bevelEnabled: true, bevelSegments: 20, steps: 2, bevelSize: 20, bevelThickness: 10 };

      var width=324;
      var height =218;

      if (window.innerWidth<600)
        width=window.innerWidth;

      for (var i=-width/2; i<width/2; i+=60+Math.random()*50){
        for (var j=0; j<height; j+=60+Math.random()*50){
          this.addShape( heartShape,  extrudeSettings, '#ff0022',   i, j, 0,
                   Math.random()*0.8, Math.random()*0.8, Math.PI, 0.1+Math.random()*0.3 );
        }
      }

      this.renderer = new WebGLRenderer( { antialias: true } );
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( width, height );
      var canvas = this.$$("#canvas3d");

      canvas.appendChild( this.renderer.domElement );

      this.renderCanvas3d();
    }, 100);
  }

  addShape( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {
    var geometry = new ExtrudeGeometry( shape, extrudeSettings );
    var mesh = new Mesh( geometry, new MeshPhongMaterial( { color: color } ) );
    mesh.position.set( x+25, y-50, z );
    mesh.rotation.set( rx, ry, rz );
    mesh.scale.set( s, s, s );
    this.shapes3d.push({shape: mesh, x: Math.random(), y: Math.random(), z: Math.random()});
    this.scene.add(mesh);
  }

  stop() {
    debugger;
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
    this.animate();
    this.renderer.render(this.scene, this.camera);
  }

  reset() {
    this.completed = false;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.currentIndex = 0;
  }

  render() {
    return html`
    <div class="layout vertical center-center" style="width: 100%;">
      <div class="topContainer shadow-animation shadow-elevation-3dp">
        ${this.currentIndex!==null ?  html`
          <div class="horizontal infoBar">
            <div class="layout horizontal">
              <div class="nickname">${this.nickname}</div>
              <div class="progress">${this.localize("question")} ${this.currentIndex+1}/${this.questions.length}</div>
            </div>
          </div>
          <div id="canvas3d">

          </div>
          <div class="question">${this.questions[this.currentIndex].question}</div>
          <div class="vertical center">
            <div class="buttonContainer">
              <paper-button raised id="button0" class="answerButton" @click="${()=> { this.submitAnswer(0) }}">${this.questions[this.currentIndex].answers[0]}</paper-button>
              <paper-button raised id="button1" class="answerButton" @click="${()=> { this.submitAnswer(1) }}">${this.questions[this.currentIndex].answers[1]}</paper-button>
              <paper-button raised id="button2" class="answerButton" @click="${()=> { this.submitAnswer(2) }}">${this.questions[this.currentIndex].answers[2]}</paper-button>
              <paper-button raised id="button3" class="answerButton" @click="${()=> { this.submitAnswer(3) }}">${this.questions[this.currentIndex].answers[3]}</paper-button>
            </div>
          </div>
        ` : html``}
        ${this.completed ? html`
          <div class="vertical center-center completedQuiz">
            <div class="completeHeader">
              ${this.localize("youHaveCompletetTheQuiz")}
            </div>
            <div>
              ${this.localize("correctQuizAnswers")}: ${this.correctAnswers}
            </div>
            <div>
              ${this.localize("incorrectQuizAnswers")}: ${this.incorrectAnswers}
            </div>
            <div class="buttonContainer">
              <paper-button raised class="answerButton continueButton" @click="${()=> { this.fire('oap-quiz-finished') }}">${this.localize("continueToFiltering")}</paper-button>
            </div>
          </div>
          ` : html``}
      </div>
    </div>
    `
  }

  submitAnswer (answer) {
    const correctAnswer = this.questions[this.currentIndex].correctAnswer;
    if (answer==correctAnswer) {
      this.fire("oap-process-correct-quiz-answer");
      this.correctAnswers+=1;
      this.$$("#button"+answer).animate([
        { transform: "scale(1.3)", easing: 'ease-in' },
        { transform: "scale(1.0)", easing: 'ease-out' }
      ], {
        duration: 450,
        iterations: 1
      });
    } else {
      this.fire("oap-overlay", {
        html: html`${this.localize("incorrectAnswer")}`,
        soundEffect: "",
        duration: 300,
      })
      this.incorrectAnswers+=1;
      this.$$("#button"+answer).animate([
        { transform: "translateX(-3px)", easing: 'ease-in' },
        { transform: "translateX(3px)", easing: 'ease-out' },
        { transform: "translateX(-5px)", easing: 'ease-in' },
        { transform: "translateX(5px)", easing: 'ease-out' },
        { transform: "translateX(-7px)", easing: 'ease-in' },
        { transform: "translateX(7px)", easing: 'ease-out' },
      ], {
        duration: 450,
        iterations: 1
      });
      this.activity('answerSubmitted', 'quiz');
    }

    this.savedBackgroundColor = this.$$("#button"+correctAnswer).style.backgroundColor;

    this.$$("#button"+correctAnswer).style.backgroundColor="#39FF14";
    const incorrectButtons = [0,1,2,3].filter(item => item !== correctAnswer);
    incorrectButtons.forEach( (buttonId) => {
      this.$$("#button"+buttonId).style.backgroundColor="#d6483d";
      this.$$("#button"+buttonId).classList.add("wrongAnswer");
    });

    setTimeout( ()=> {
      this.resetAllButtons();
      if (this.currentIndex<this.questions.length-1) {
        this.currentIndex+=1;
        this.requestUpdate();
      } else {
        this.currentIndex=null;
        this.completed=true;
        this.requestUpdate();
        this.fire("oap-sound-effect","quizCompleted");
      }
    }, 1000);
  }

  resetAllButtons() {
    [0,1,2,3].forEach( (buttonId) => {
      this.$$("#button"+buttonId).style.backgroundColor=this.savedBackgroundColor;
      this.$$("#button"+buttonId).classList.remove("wrongAnswer");
    });
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('questions')) {
      if (this.questions) {
        this.reset();
      }
    }

    if (changedProps.has('active')) {
      if (this.active===true) {
        this.start();
      } else {
        this.stop();
      }
    }
  }
}

window.customElements.define('oap-policy-quiz', OapPolicyQuiz);
