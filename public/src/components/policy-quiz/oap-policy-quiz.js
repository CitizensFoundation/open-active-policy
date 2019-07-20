import { html } from 'lit-element';
import '@polymer/paper-button/paper-button';

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
      savedBackgroundColor: String
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
          <div>
            <img class="image" src="${this.questions[this.currentIndex].imageUrl}"/>
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
  }
}

window.customElements.define('oap-policy-quiz', OapPolicyQuiz);
