/**
@license
Copyright (c) 2010-2019 Citizens Foundation
*/

import { css } from 'lit-element';

export const OapCountryCreationStyles = css`

  :host {
    width: 100%;
    height: 100%;
  }

  .header {
    font-size: 24px;
    margin-top: 16px;
    margin-bottom: 8px;
    font-weight: bold;
    background-color: var(--app-country-header-background-color, #000);
    color: var(--app-country-header-color, #FFF);
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;
    padding-top: 2px;
    text-align: center;
  }

  .subHeader {
    font-size: 20px;
    margin-top: 12px;
    margin-bottom: 16px;
    padding-left: 16px;
    padding-right: 16px;
    font-weight: bold;
  }

  .subHeader.noBottom {
    margin-bottom: 0;
  }

  .topContainer {
    max-width: 600px;
    width: 600px;
    background-color: #000;
    color: #FFF;
    padding-top: 16px;
    padding-bottom: 42px;
    padding-left: 0;
    padding-right: 0;
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

    justify-content: center;
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
    margin-left: 16px;
    font-size: 32px;
    margin-bottom: 0;
    padding-bottom: 0;
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
    padding-left: 8px;
    padding-right: 8px;
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
