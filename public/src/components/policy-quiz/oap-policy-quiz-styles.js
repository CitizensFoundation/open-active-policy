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

  .question {
    width: 600px;
    padding: 16px;
    font-size: 23px;
    background-color: #000;
    background:rgba(0,0,0,0.5);
    color: #FFF;
    border-radius: 12px;
    margin-top: 0;
    text-align: center;
    margin-bottom: 4px;
    position: absolute;
    top: 75px;
    border: 1px solid #999;
    -webkit-transition: opacity 2.0s ease-in-out;
    -moz-transition: opacity 2.0s ease-in-out;
    -ms-transition: opacity 2.0s ease-in-out;
    -o-transition: opacity 2.0s ease-in-out;
    box-shadow: 0 0 10px #fff, inset 0 0 4px #fff;
  }

  .answerButton {
    background-color: var(--app-quiz-answer-button-background-color, #000);
    color: #eee;
    border: 1px solid #eee;
    padding: 16px;
    width: 100%;
    margin: 0;
    width: 600px;
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
    position: absolute;
    top: 340px;
    background: transparent;
    -webkit-transition: opacity 2.0s ease-in-out;
    -moz-transition: opacity 2.0s ease-in-out;
    -ms-transition: opacity 2.0s ease-in-out;
    -o-transition: opacity 2.0s ease-in-out;
  }

  @media (max-width: 340px) {
    top: 300px;
  }

  .topContainer {
    width: 600px;
    margin-left: auto;
    margin-right: auto;
    background: transparent;
    color: var(--quiz-color, #FFF);
    height: 100%;
    padding-bottom: 42px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 0;
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
    position: absolute;
    top: 0;
    left: 0;
    right: 24px;
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
    width: 100%;
    height: 250px;
    top: 0;
  }

  .completedQuiz {
    margin-left: auto;
    margin-right: auto;
    max-width: 600px;
    padding: 16px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
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

    .question {
      font-size: 19px;
      width: 95%;
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
