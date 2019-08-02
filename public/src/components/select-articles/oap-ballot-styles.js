/**
@license
Copyright (c) 2010-2019 Citizens Foundation
*/

import { css } from 'lit-element';

export const OapBallotStyles = css`

  :host {
    position: relative;
  }

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
    margin-bottom: 16px;
    margin-top: 12px;
  }

  #submitButton {
    color: #FFF;
    background-color: #000;
    border: 1px solid #FFF;
    margin-left: auto;
    margin-right: auto;
    width: 200px;
  }

  .tabsContainer {
    z-index: 9000;
    width: 100%;
    background: transparent;
    cursor: pointer;
  }

  .tab {
    background: transparent;
    font-size: 17px;
    padding-left: 12px;
    padding-right: 12px;
    color: #999;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
     user-select: none;
   }

  .tab[selected] {
    color: #d0d0d0;
    padding-bottom: 1px;
    border-bottom: 2px solid #ddd;
  }

  .favTab {
    z-index: 9001;
    position: fixed;
    top: 166px;
    left: 32px;
    transition: opacity 250ms ease-in-out;
  }

  .favOpacityDown {
    transition: opacity 250ms ease-in-out;
    opacity: 0.5;
  }

  @keyframes colorani {
    0%   {color: var(--oap-active-selection-original-color);
          border-color: var(--oap-active-selection-original-color);}
    50%  {color: var(--oap-active-selection-color);
          border-color: var(--oap-active-selection-color);}
    100% {color: var(--oap-active-selection-original-color);
      border-color: var(--oap-active-selection-original-color);}
  }

  .selectedTab {
    z-index: 9001;
    position: fixed;
    top: 166px;
    left: 155px;
  }

  .selectedTabAnimation {
    animation-name: colorani;
    animation-duration: 1s;
  }

  paper-button[disabled] {
    background-color: #555;
  }

  .budgetContainer {
  }

  .votingButtonContainer {
    position: absolute;
    bottom: 24px;
  }

  .topContainer {
    background-color: var(--app-main-background-color);
    color: var(--app-ballot-color, #333);
    margin-top: 24px;
  }

  @media (max-width: 1000px) {
    .topContainer {
      margin-top: 30px;
    }
  }


  @media (max-width: 600px) {
    .topContainer {
      margin-top: 32px;
    }
  }

  .finalHeader {
    padding: 8px;
    font-size: 24px;
    margin: 8px;
    text-align: center;
    color: #FFF;
    font-weight: bold;
    margin-bottom: 12px;
    margin-top: 12px;
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

  .headerContainer {
    color: #aaa;
    font-size: 24px;
    padding: 8px;
    margin: 8px;
    text-align: center;
    margin-bottom: 0;
  }

  .countryHeader {
    color: #FFF;
    font-size: 26px;
    font-weight: bold;
  }

  [hidden] {
    display: none !important;
  }
`;
