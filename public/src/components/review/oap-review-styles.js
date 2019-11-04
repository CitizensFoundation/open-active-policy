/**
@license
Copyright (c) 2010-2019 Citizens Foundation
*/

import { css } from 'lit-element';

export const OapReviewStyles = css`

  :host {
    width: 100%;
    height: 100%;
  }

  .weakItem {
    font-style: italic;
    font-weight: bold;
  }

  .finalItems {
    flex-flow: column wrap; /* Shorthand – you could use ‘flex-direction: column’ and ‘flex-wrap: wrap’ instead */
    justify-content: flex-start;
    align-items: flex-start;
    display: flex;
    margin: 0 auto;
  }

  .header {
    font-size: 24px;
    margin-top: 16px;
    margin-bottom: 16px;
    font-weight: bold;
    background-color: var(--app-country-header-background-color, #000);
    color: var(--app-country-header-color, #FFF);
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;
    padding-top: 2px;
    text-align: center;
  }

  .lastHeader {
    margin-top: 0;
    padding-bottom: 8px;
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

  .subHeader {
    font-size: 20px;
    margin-top: 16px;
    margin-bottom: 4px;
    font-weight: bold;
  }

  oap-article-item {
    outline: 0px;
    transition: all 1s ease-in-out;
    -webkit-transition: all 750ms ease-in-out;
    -moz-transition: all 750ms ease-in-out;
    -o-transition: all 750ms ease-in-out;
    -ms-transition: all 750ms ease-in-out;
  }

  .countryHeader {
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 4px;
    margin-top: 8px;
  }

  #retryButton {
    background-color: #FFF;
    color: #000;
    margin-top: 4px;
  }

  .subHeader.noBottom {
    margin-bottom: 0;
  }

  .mainArea {
    max-width: 600px;
    width: 600px;
  }

  .topContainer {
    background-color: #000;
    color: #FFF;
    padding: 16px;
    padding-bottom: 24px;
    margin-left: auto;
    margin-right: auto;
  }

  .flexRow {
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;

    flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    -webkit-flex-wrap: wrap;

    -ms-flex-direction: row;
    -webkit-flex-direction: row;
    flex-direction: row;

    width: 100%;
    margin-top: 24px;
    margin-bottom: 8px;
  }

  .basicInfo {
    padding-top: 24px;
  }

  .column {
    margin-left: 16px;
    margin-right: 16px;
    padding-left: 8px;
    padding-right: 8px;
  }

  paper-button {
    background-color: #000;
    color: #FFF;
    border: 1px solid #FFF;
    margin-left: auto;
    margin-right: auto;
    margin-top: 24px;
  }

  paper-button[disabled] {
    background-color: #888;
  }

  .sliderHeader {
    margin-top: 12px;
    font-size: 18px;
  }

  .sliderHeader {
    font-size: 18px;
  }

  .rawStats {
    margin-top: 24px;
  }

  .emoji {
    margin-right: 8px;
    margin-left: 0;
    font-size: 42px;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .attituteHeader {
    font-size: 20px;
  }

  .attituteReview {
    margin-bottom: 24px;
    margin-top: 4px;
  }

  .emojiResources {
    margin-left: 8px;
    margin-right: 8px;
  }

  paper-input {
    padding-left: 16px;
    padding-right: 16px;
    color: #000;
    --paper-input-container-color: #000;
    --paper-input-container-focus-color: #000;
    --paper-input-container-input-color: #000;
  }

  paper-textarea {
    padding-left: 16px;
    padding-right: 16px;
    --paper-input-container-color: #000;
    --paper-input-container-focus-color: #000;
    --paper-input-container-input-color: #000;
    color: #000;
  }

  paper-slider {
    --paper-slider-container-color: #333;
    --paper-slider-active-color: var(--app-create-country-slider-active-color, #333);
    --paper-slider-knob-color: var(--app-create-country-slider-active-color, #333);
    --paper-slider-font-color: var(--app-create-country-slider-active-color, #333);
    color: #333;
    --paper-input-container-color:  var(--app-create-country-slider-active-color, #333);
    --paper-input-container-focus-color: var(--app-create-country-slider-active-color, #333);
    --paper-input-container-input-color: var(--app-create-country-slider-active-color, #333);
    --paper-slider-disabled-active-color:  var(--app-create-country-slider-active-color, #333);
    --paper-input-disabled-color:  var(--app-create-country-slider-active-color, #333);
    --paper-slider-disabled-knob-color: var(--app-create-country-slider-active-color, #333);
    --paper-slider-secondary-color: : var(--app-create-country-slider-active-color, #333);
    --paper-slider-height: 2px;
  }

  .dropDownContainer {
    margin-left: 16px;
    margin-right: 16px;
  }

  paper-dropdown-menu {
    --paper-input-container-color:  var(--app-create-country-slider-active-color, #fff);
    --paper-input-container-focus-color: var(--app-create-country-slider-active-color, #fff);
    --paper-input-container-input-color: var(--app-create-country-slider-active-color, #fff);
    --paper-slider-disabled-active-color:  var(--app-create-country-slider-active-color, #fff);
    --paper-input-disabled-color:  var(--app-create-country-slider-active-color, #fff);
    --paper-input-container-input: {
      font-size: 30px;
    };
    --paper-dropdown-menu-input: {
      --paper-input-container-input: {
        font-size: 30px;
      }
    }
    color: #FFF;
    width: 100%;
  }

  .nextToTop {
    background-color: #fff;
    color: #000;
    padding: 16px;
    padding-bottom: 24px;
    border-radius: 8px;
  }

  .attituteSlider {
    width: 240px;
  }

  .cultural {
    margin-top: 24px;
    margin-bottom: 8px !important;
  }

  .cultRow {
    margin-top: 0;
  }

  .welcomeLogo {
    max-width: 120px;
    max-height: 120px;
    width: 120px;
    height: 120px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }

  @media (max-width: 600px) {
    .topContainer {
      max-width: 100%;
      margin-left: 8px;
      margin-right: 8px;
      width: 100%;
      height: 100%;
      margin-bottom: 32px;
      padding-top: 32px;
    }

  .mainArea {
    max-width: 100%;
    width: 100%;
  }


    paper-input {
      max-width: 300px;
    }

    paper-textarea {
      max-width: 300px;
    }

    .attituteSlider {
      width: 100%;
    }

    paper-slider {
      width: 100%;
    }

    .cultural {
      margin-top: 32px;
    }

    .header {
      font-size: 20px;
    }
  }


  [hidden] {
    display: none !important;
  }
`;
