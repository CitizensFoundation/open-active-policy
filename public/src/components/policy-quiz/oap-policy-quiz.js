import { html, supportsAdoptingStyleSheets } from 'lit-element';
import '@polymer/paper-button/paper-button';

import { Scene, DirectionalLight, PerspectiveCamera, Vector3, TextGeometry, Color, FontLoader, BufferGeometry, Shape, Mesh, WebGLRenderer, ExtrudeGeometry, MeshPhongMaterial} from 'three';

import { OapPageViewElement } from '../oap-page-view-element';
import { OapPolicyQuizStyles } from './oap-policy-quiz-styles';
import { OapFlexLayout } from '../oap-flex-layout';
import { OapShadowStyles } from '../oap-shadow-styles';
import { Tween, Easing, update } from 'es6-tween';

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
      dirLightOne: Object,
      dirLightTwo: Object,
      submitDisabled: Boolean
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
  }

  start() {
    this.reset();
    setTimeout(()=>{
      this.scene = new Scene();
      this.camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
      this.camera.position.set( 6, -10, 355 );
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

      this.scene.background = new Color( '#1d5588' );
      var loader = new FontLoader();
      loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
        this.savedBackgroundColor = this.$$("#button0").style.backgroundColor;
        var geometry = new TextGeometry( "?", {
          font: font,
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

        var width=600;
        var height=150;

        if (window.innerWidth<=600) {
          width=window.innerWidth;
          height=100;
        }

        for (var i=-width/2; i<width/2; i+=30+Math.random()*50){
          for (var j=0; j<height; j+=30+Math.random()*50){
            this.addShape( geometry,  materials, '#aaaaaa',   i, j, 0,
                     Math.random()*0.8, Math.random()*0.8, Math.PI, 0.1+Math.random()*0.3 );
          }
        }

        this.renderer = new WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( width, height );
        var canvas = this.$$("#canvas3d");

        canvas.appendChild( this.renderer.domElement );

        this.renderCanvas3d();

        let target = new Vector3(6, -10, 35);

        new Tween(this.camera.position)
        .to({ x: target.x, y: target.y, z: target.z, }, 35*1000)
        .delay(0)
        .easing(Easing.Quadratic.In)
        .on('complete', () => {
          target = new Vector3(6, -10, 175);
          new Tween(this.camera.position)
          .to({ x: target.x, y: target.y, z: target.z, }, 7*1000)
          .delay(0)
          .easing(Easing.Elastic.Out)
          .on('complete', () => {
          })
          .start();
        })
        .start();
      }.bind(this));

    }, 100);
  }

  addShape( geometry, materials, color, x, y, z, rx, ry, rz, s ) {
    var mesh = new Mesh( geometry, materials );
    mesh.position.set( x+25, y-50, z );
    mesh.rotation.set( rx, ry, rz );
    mesh.scale.set( s, s, s );
    this.shapes3d.push({shape: mesh, x: Math.random(), y: Math.random(), z: Math.random()});
    this.scene.add(mesh)
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

    // This is Tween.update
    update();

    this.animate();
    this.renderer.render(this.scene, this.camera);
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
    <div class="layout vertical center-center" style="height: 100%;">
      <div class="topContainer shadow-animation shadow-elevation-3dp">
        ${this.currentIndex!==null ?  html`
          <div id="canvas3d"></div>
          <div class="layout horizontal center-center infoBar">
            <div class="layout horizontal center-center">
              <div class="nickname">${this.nickname}</div>
              <div class="progress">${this.localize("question")} ${this.currentIndex+1}/${this.questions.length}</div>
            </div>
          </div>
          <div class="question">${this.questions[this.currentIndex].question}</div>
          <div class="vertical center">
            <div class="buttonContainer">
              <paper-button raised ?disabled="${this.submitDisabled}" id="button0" class="answerButton" @click="${()=> { this.submitAnswer(0) }}">${this.questions[this.currentIndex].answers[0]}</paper-button>
              <paper-button raised ?disabled="${this.submitDisabled}" id="button1" class="answerButton" @click="${()=> { this.submitAnswer(1) }}">${this.questions[this.currentIndex].answers[1]}</paper-button>
              <paper-button raised ?disabled="${this.submitDisabled}" id="button2" class="answerButton" @click="${()=> { this.submitAnswer(2) }}">${this.questions[this.currentIndex].answers[2]}</paper-button>
              <paper-button raised ?disabled="${this.submitDisabled}" id="button3" class="answerButton" @click="${()=> { this.submitAnswer(3) }}">${this.questions[this.currentIndex].answers[3]}</paper-button>
            </div>
          </div>
        ` : html``}
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
      .to({ r: col.r, g: col.g, b: col.b, }, 450)
      .delay(0)
      .easing(Easing.Quadratic.InOut)
      .on('complete', () => {
         col = new Color('#1d5588');
         new Tween(ligth.color)
        .to({ r: col.r, g: col.g, b: col.b, }, 1400)
        .delay(0)
        .easing(Easing.Quadratic.InOut)
        .on('complete', () => {
        })
        .start();
      })
      .start();
    });
  }

  wrongAnswerColorAnimation() {
    let col = new Color('#d6483d');

    [this.dirLightOne, this.dirLightTwo].forEach((ligth) => {
      new Tween(ligth.color)
      .to({ r: col.r, g: col.g, b: col.b, }, 250)
      .delay(0)
      .on('complete', () => {
         col = new Color('#1d5588');
         new Tween(ligth.color)
        .to({ r: col.r, g: col.g, b: col.b, }, 450)
        .delay(1000)
        .on('complete', () => {
        })
        .start();
      })
      .start();
    });
  }

  submitAnswer (answer) {
    this.submitDisabled = true;
    const correctAnswer = this.questions[this.currentIndex].correctAnswer;
    if (answer==correctAnswer) {
      this.fire("oap-process-correct-quiz-answer");
      this.correctAnswerColorAnimation();
      this.correctAnswers+=1;
      this.$$("#button"+answer).animate([
        { transform: "scale(1.3)", easing: 'ease-in' },
        { transform: "scale(1.0)", easing: 'ease-out' }
      ], {
        duration: 500,
        iterations: 1
      });
    } else {
      this.fire("oap-overlay", {
        html: html`${this.localize("incorrectAnswer")}`,
        soundEffect: "",
        duration: 300,
      })
      this.wrongAnswerColorAnimation();
      this.incorrectAnswers+=1;
      this.$$("#button"+answer).animate([
        { transform: "translateX(-3px)", easing: 'ease-in' },
        { transform: "translateX(3px)", easing: 'ease-out' },
        { transform: "translateX(-5px)", easing: 'ease-in' },
        { transform: "translateX(5px)", easing: 'ease-out' },
        { transform: "translateX(-7px)", easing: 'ease-in' },
        { transform: "translateX(7px)", easing: 'ease-out' },
      ], {
        duration: 600,
        iterations: 1
      });
      this.activity('answerSubmitted', 'quiz');
    }

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
      this.submitDisabled=false;
    }, 1500);
  }

  resetAllButtons() {
    [0,1,2,3].forEach( (buttonId) => {
      this.$$("#button"+buttonId).style.backgroundColor=this.savedBackgroundColor;
      this.$$("#button"+buttonId).selected=false;
      this.$$("#button"+buttonId).focused=false;
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
      }
    }
  }
}

window.customElements.define('oap-policy-quiz', OapPolicyQuiz);
