/**
@license
Copyright (c) 2010-2019 Citizens Foundation
*/

import { css } from 'lit-element';

export const Oap3DBudgetStyles = css`
  :host {
    width: 100%;
    display: block;
    background-color: #000 !important;
  }

  .topLevel[wide] {
  }

  .budgetContainer {
  }

  .budgetContainer[wide] {
  }

  @media (max-width: 1100px) {
    .budgetContainer {
    }
  }

  .headerContainer {
  }

  .budgetMaterial {
    background-color: var(--app-budget-material-background-color, rgba(249,249,249,1.0));
    height: 200px;
    margin: 0px 0px 0px 0px;
    margin-right: auto;
    margin-left: auto;
  }

  .budgetMaterial[wide] {
    width: 940px;
    height: 200px;
    margin-top: 24px;
  }

  #votes {
    background-color: var(--app-budget-votes-background-color, #f0f0f0);
    height: 81px;
  }

  #votes[wide] {
    width: 940px;
    height: 100px;
  }

  .budgetRuler {
    background-color: var(--app-budget-ruler-background-color, #f0f0f0);
    color: var(--app-budget-ruler-color, #111);
    font-size: 14px;
    padding: 4px;
    padding-right: 8x;
    padding-left: 8px;
  }

  .budgetRuler[wide] {
    font-size: 18px;
    padding: 8px;
    padding-right: 16px;
    padding-left: 16px;
  }

  .budgetHeader {
    background-color: var(--app-budget-header-background-color, #FFF);
    color: var(--app-budget-header-color, #000);
    font-size: 26px;
    padding: 12px;
  }

  .info {
    background-color: var(--app-budget-info-background-color, rgba(249,249,249,1.0));
    color: var(--app-budget-info-color, #111);
    padding: 4px;
    font-size: 12px;
  }

  .info[wide] {
    padding: 8px;
    font-size: 19px;
  }

  paper-button.voteButton {
    background-color: var(--app-accent-color);
    color: var(--app-budget-vote-button-color, #FFF);
    margin: 8px;
    margin-right: 4px;
  }

  paper-button[disabled] {
    background-color: #bbb;
  }

  .selectedInfo {
    font-size: 12px;
  }

  .selectedInfo[wide] {
    font-size: 19px;
  }

  #budgetLeftInfo {
    font-size: 13px;
    font-weight: bold;
    margin-top: 4px;
  }

  #budgetLeftInfo[wide] {
    font-size: 19px;
    font-weight: bold;
    z-index: 100000;
  }

  #budgetLeftInfo[no-selection] {
    padding-top: 28px;
  }

  .noItemsInfo {
    color: var(--app-budget-noitemsinfo-color, #555);
    font-size: 14px;
    padding-left: 8px;
    padding-right: 8px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 32px
  }

  .noItemsInfo[wide] {
    font-size: 24px;
  }

  .itemInBudget {
    border-left: solid 3px;
    border-left-color: var(--app-accent-color);
  }

  .headerLogo {
    width:  90px;
    height: 90px;
    padding: 0;
    margin: 0;
    margin-left: 16px;
    -moz-transform: scaleX(-1);
    -o-transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
    transform: scaleX(-1);
    filter: FlipH;
    -ms-filter: "FlipH";
  }

  @media (max-width: 1024px) {
    .headerLogo {
      width: 55px;
      height: 55px;
      margin-left: 16px;
    }
  }

  @media (max-width: 420px) {
    .headerLogo {
      width: 50px;
      height: 50px;
      margin-left: 8px;
    }
  }

  .headerContainer {
    background-color: var(--app-budget-header-container-background-color, #FFF);
    color: var(--app-budget-vote-button-color, #222)
  }

  .demoButton {
    background-color: var(--app-accent-color);
    color: #fff;
    width: 30px;
    height: 30px;
    padding: 5px;
    margin-left: 8px;
    margin-right: 8px;
  }

  .onOfferText {
    color: var(--app-accent-color);
    margin-right: 12px;
    font-weight: bold;
  }

  paper-toast {
    font-size: 17px;
    height: 80px;
    padding-bottom: 8px;
  }

  paper-toast[wide] {
    font-size: 25px;
    height: 108px;
  }

  .mobileActionIcons {
    color: #555;
    width: 42px;
    height: 42px;
    margin: 0;
    padding: 0;
    margin-top: 5px;
    margin-right: 5px;
  }

  [hidden] {
    display: none !important;
  }

  .mobileBudgetText {
    margin-top: 6px;
  }

  .budgetText {
    margin-top: 4px;
  }
`;
