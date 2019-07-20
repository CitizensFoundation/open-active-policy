/**
@license
Copyright (c) 2010-2019 Citizens Foundation
*/

import { css } from 'lit-element';

export const OapPolicyQuizStyles = css`

  :host {
    width: 100%;
  }

  .answerButton {
    min-width: 350px;
    max-width: 350px;
    margin: 8px;
  }

  .wrongAnswer {
    -webkit-transition: opacity 0.7s ease-in-out;
    -moz-transition: opacity 0.7s ease-in-out;
    -ms-transition: opacity 0.7s ease-in-out;
    -o-transition: opacity 0.7s ease-in-out;
     opacity: 0.0;
  }

  .buttonContainer {
    width: 380px;
    margin-left: auto;
    margin-right: auto;
  }

  .topContainer {
    max-width: 432px;
    margin-left: auto;
    margin-right: auto;
    background-color: var(--quiz-background-color, #FFF);
    color: var(--quiz-color, #111);
    padding-bottom: 16px;
    margin-top: 32px;
  }

  .question {
    padding: 8px;
  }

  .image {
    width: 432px;
    height: 270px;
  }

  .completedQuiz {
    padding: 16px;
  }

  .completeHeader {
    font-weight: bold;
    margin-bottom: 16px;
  }

  .continueButton {
    margin-top: 24px;
    background-color: var(--app-accent-color);
    color: #FFF;
  }

  .infoBar {
    margin: 16px;
    font-size: 18px;
  }

  [hidden] {
    display: none !important;
  }
`;
