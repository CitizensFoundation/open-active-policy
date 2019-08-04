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
    background-color: var(--app-quiz-answer-button-background-color, #000);
    color: #eee;
    border: 1px solid #eee;
    padding: 12px;
    width: 100%;
    margin: 0;
    margin-bottom: 16px;
  }

  .wrongAnswer {
    -webkit-transition: opacity, color, border 0.7s ease-in-out;
    -moz-transition: opacity, color, border 0.7s ease-in-out;
    -ms-transition: opacity, color, border 0.7s ease-in-out;
    -o-transition: opacity, color, border 0.7s ease-in-out;
    opacity: 0.4;
    color: #FF0000;
    border: 1px solid #FF0000;
  }

  .rightAnswer {
    font-weight: bold;
    color: #fff;
    border: 1px solid #00ff00;
  }

  .buttonContainer {
    width: 100%;
    -webkit-transition: opacity 2.0s ease-in-out;
    -moz-transition: opacity 2.0s ease-in-out;
    -ms-transition: opacity 2.0s ease-in-out;
    -o-transition: opacity 2.0s ease-in-out;
  }

  .topContainer {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    background-color: var(--quiz-background-color, #000);
    color: var(--quiz-color, #FFF);
    height: 100%;
    padding-bottom: 42px;
  }

  .question {
    padding: 16px;
    font-size: 23px;
    background-color: #000;
    color: #FFF;
    border-radius: 4px;
    margin-top: 0;
    text-align: center;
    padding-bottom: 0;
    padding-top: 6px;
    margin-bottom: 4px;
    -webkit-transition: opacity 2.0s ease-in-out;
    -moz-transition: opacity 2.0s ease-in-out;
    -ms-transition: opacity 2.0s ease-in-out;
    -o-transition: opacity 2.0s ease-in-out;
  }

  .infoBar {
    margin: 16px;
    font-size: 18px;
    text-align: right;
    width: 100%;
    margin-bottom: 8px;
  }

  .progress {
    font-size: 18px;
    color: #bbb;
    padding: 16px;
    -webkit-transition: opacity 2.0s ease-in-out;
    -moz-transition: opacity 2.0s ease-in-out;
    -ms-transition: opacity 2.0s ease-in-out;
    -o-transition: opacity 2.0s ease-in-out;
  }

  .middle {
    width: 100%;
  }

  .textRight {
    text-align: right;
  }

  .textLeft {
    text-align: left;
  }

  #canvas3d {
    width: 600px;
    height: 250px;
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
  }

  @media (max-width: 600px) {
    .topContainer {
      max-width: 100%;
      width: 100%;
      height: 100%;
      text-align: center;
    }

    :host {
      height: 100%;
    }

    .image {
      width: 100%;
    }

    .buttonContainer {
      width: 100%;
    }

    .answerButton {
      max-width: 300px;
      margin-left: auto;
      margin-right: auto;
    }


    #canvas3d {
      width: 100%;
      height: 250px;
    }

  }

  [intro-mode] {
    opacity: 0.0;
    -webkit-transition: opacity 2.0s ease-in-out;
    -moz-transition: opacity 2.0s ease-in-out;
    -ms-transition: opacity 2.0s ease-in-out;
    -o-transition: opacity 2.0s ease-in-out;
  }


  [hidden] {
    display: none !important;
  }
`;
