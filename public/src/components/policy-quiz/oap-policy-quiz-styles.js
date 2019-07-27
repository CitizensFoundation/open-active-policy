/**
@license
Copyright (c) 2010-2019 Citizens Foundation
*/

import { css } from 'lit-element';

export const OapPolicyQuizStyles = css`

  :host {
    width: 100%;
    height: 100%;
  }

  .answerButton {
    width: 320px;
    margin: 8px;
    margin-left: 32px;
    margin-right: 32px;
    text-align: center;
    background-color: var(--app-quiz-answer-button-background-color, #e9bf29);
    color: #000;
  }

  .wrongAnswer {
    -webkit-transition: opacity 0.7s ease-in-out;
    -moz-transition: opacity 0.7s ease-in-out;
    -ms-transition: opacity 0.7s ease-in-out;
    -o-transition: opacity 0.7s ease-in-out;
     opacity: 0.0;
  }

  .buttonContainer {
    width: 384px;
    margin-left: auto;
    margin-right: auto;
  }

  .topContainer {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    background-color: var(--quiz-background-color, #1d5588);
    color: var(--quiz-color, #FFF);
    padding-bottom: 16px;
    margin-top: 32px;
    height: 100%;
  }

  .question {
    padding: 16px;
    font-size: 20px;
    padding-top: 0;
  }

  .infoBar {
    margin: 16px;
    font-size: 18px;
    text-align: right;
    width: 100%;
    margin-bottom: 8px;
  }

  .progress {
    text-align: right;
    color: #bbb;
    margin-left: auto;
    margin-right: auto;
  }

  #canvas3d {
    width: 600px;
    height: 150px;
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

  @media (max-width: 600px) {
    .topContainer {
      max-width: 100%;
      width: 100%;
      height: 100%;
      margin-left: 0;
      margin-right: 0;
    }

    .image {
      width: 100%;
    }

    .buttonContainer {
      width: 90%;
    }

    #canvas3d {
      width: 100%;
      height: 100px;
    }

    .answerButton {
      width: 300px;
    }
  }


  [hidden] {
    display: none !important;
  }
`;
