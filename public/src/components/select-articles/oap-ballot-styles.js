/**
@license
Copyright (c) 2010-2019 Citizens Foundation
*/

import { css } from 'lit-element';

export const OapBallotStyles = css`

  :host {}

  iron-list {
    margin-top: 24px;
    padding-bottom: 16px;
    background-color: var(--app-main-background-color);
  }

  .name {
    font-size: 19px;
    padding: 8px;
  }

  .description {
    padding-left: 8px;
  }

  .price {
    font-size: 20px;
    position: absolute;
    bottom: 4px;
    left: 8px;
  }

  .itemContainer {
    margin-top: 8px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    background-color: var(-app-item-container, #000 !important);
  }

  oap-article-item {
    outline: 0px;
    transition: all 1s ease-in-out;
    -webkit-transition: all 750ms ease-in-out;
    -moz-transition: all 750ms ease-in-out;
    -o-transition: all 750ms ease-in-out;
    -ms-transition: all 750ms ease-in-out;
  }


  .sendToTop {
    transform: translate(0,-2000px);
    -webkit-transform: translate(0,-2000px);
    -moz-transform: translate(0,-2000px);
    -o-transform: translate(0,-2000px);
    -ms-transform: translate(0,-2000px);
  }

  paper-button.addButton {
    position: absolute;
    bottom: 16px;
    outline: 0px;
    right: 8px;
    background-color: var(--app-ballot-add-button-background-color, #F00);
    color: var(--app-ballot-add-button-color, #FFF);
  }


  #submitButtonContainer {
    width: 100%;
    text-align: center;
    margin-top: 16px;
  }

  #submitButton {
    color: #FFF;
    background-color: var(--app-accent-color, #000);
    margin-left: auto;
    margin-right: auto;
    width: 200px;
  }

  paper-button[disabled] {
    background-color: #555;
  }

  .budgetContainer {
  }

  .votingButtonContainer {
    position: absolute;
    bottom: 16px;
  }

  .topContainer {
    background-color: var(--app-main-background-color);
    color: var(--app-ballot-color, #333);
  }

  paper-tabs {
    margin: 8px;
    margin-right: 16px;
    margin-left: 16px;
    color: #FFF;
  }

  paper-tab {
    font-size: 18px;
    margin-left: 32px;
    margin-right: 32px;
    font-size: 17px;
    width: 100px;
  }

  @media (max-width: 1045px) {
    paper-tab {
      font-size: 15px !important;
      margin-left: 16px;
      margin-right: 16px;
    }
  }

  @media (max-width: 360px) {
    paper-tab {
      font-size: 14px !important;
      margin-left: 16px;
      margin-right: 16px;
    }
  }

  [hidden] {
    display: none !important;
  }
`;
