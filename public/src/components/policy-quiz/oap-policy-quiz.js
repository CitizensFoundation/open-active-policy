import { html } from 'lit-element';
import '@polymer/paper-button/paper-button';

import { OapPageViewElement } from '../oap-page-view-element';
import { OapPolicyQuizStyles } from './oap-policy-quiz-styles';
import { OapFlexLayout } from '../oap-flex-layout';

class OapPolicyQuiz extends OapPageViewElement {
  static get properties() {
    return {
      questions: Array,
      currentQuestionIndex: Number,
      correctAnswers: Number,
      incorrectAnswers: Number,
      nickname: String,
      configFromServer: Object
    };
  }

  static get styles() {
    return [
      OapPolicyQuizStyles,
      OapFlexLayout
    ];
  }

  constructor() {
    super();
    this.currentIndex = null;
  }

  reset() {
    this.completed = false;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.currentIndex = 0;
  }

  render() {
    return html`
      <div class="topContainer layout vertical">
        ${this.currentIndex!==null ?  html`
          <div class="layout horizontal infoBar">
            <div class="logo"><img src="${configFromServer.client_config.squareLogo}"/></div>
            <div class="layout vertical">
              <div class="nickname">${this.nickname}</div>
              <div class="progress">${this.currentIndex+1}/${this.questions.length}</div>
            </div>
          </div>
          <img class="image" src="${this.questions[this.currentIndex].imageUrl}"/>
          <div class="question">${this.questions[this.currentIndex].question}</div>
          <div class="buttonsContainer">
            <paper-button id="button0" class="answerButton" @click="${()=> { this.submitAnswer(0) }}">${this.questions[this.currentIndex].answers[0]}</paper-button>
            <paper-button id="button1" class="answerButton" @click="${()=> { this.submitAnswer(1) }}">${this.questions[this.currentIndex].answers[1]}</paper-button>
            <paper-button id="button2" class="answerButton" @click="${()=> { this.submitAnswer(2) }}">${this.questions[this.currentIndex].answers[2]}</paper-button>
            <paper-button id="button3" class="answerButton" @click="${()=> { this.submitAnswer(3) }}">${this.questions[this.currentIndex].answers[3]}</paper-button>
          </div>
        ` : html``}
        ${this.completed ? html`
          <div class="layout vertical">
            <div>
              ${this.localize("youHaveCompletetTheQuiz")}
            </div>
            <div>
              ${this.localize("correctQuizAnswers")}: ${this.correctAnswers}
            </div>
            <div>
              ${this.localize("incorrectQuizAnswers")}: ${this.incorrectAnswers}
            </div>
            <div>
              <paper-button class="continueButton" @click="${()=> { this.fire('oap-quiz-finished') }}">${this.localize("continueToFiltering")}</paper-button>
            </div>
          </div>
          ` : html``}
      </div>
    `
  }

  submitAnswer (answer) {
    if (answer==this.questions[this.currentIndex].correctAnswer) {
      this.fire("oap-overlay", {
        html: html`${this.localize("correctAnswer")}`,
        soundEffect: "",
        duration: 300,
      });
      this.correctAnswers+=1;
    } else {
      this.fire("oap-overlay", {
        html: html`${this.localize("incorrectAnswer")}`,
        soundEffect: "",
        duration: 300,
      })
      this.incorrectAnswers+=1;
    }

    this.$$("#button"+answer).style.backgroundColor="#0F0";
    const incorrectButtons = [0,1,2,3].filter(item => item !== answer);
    incorrectButtons.forEach( (buttonId) => {
      this.$$("#button"+buttonId).style.backgroundColor="#F00";
    });

    setTimeout( ()=> {
      if (this.currentIndex<this.questions.length-1) {
        this.currentIndex+1;
        this.requestUpdate();
      } else {
        this.currentIndex=null;
        this.completed=true;
        this.fire("oap-sound-effect","quizCompleted");
      }
    }, 500);
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('questions')) {
      if (this.questions) {
        this.reset();
      }
    }
  }
}

window.customElements.define('oap-policy-quiz', OapPolicyQuiz);
