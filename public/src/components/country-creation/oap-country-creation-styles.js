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
    margin-top: 0;
    margin-bottom: 16px;
    font-weight: bold;
    background-color: var(--app-country-header-background-color, #e9bf29);
    color: var(--app-country-header-color, #1d5588);
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;
    padding-top: 2px;
    text-align: center;
  }

  .subHeader {
    font-size: 20px;
    margin-top: 24px;
    margin-bottom: 16px;
    padding-left: 16px;
    padding-right: 16px;
    font-weight: bold;
  }

  .subHeader.noBottom {
    margin-bottom: 0;
  }

  .topContainer {
    margin-top: 32px;
    max-width: 600px;
    width: 600px;
    background-color: var(--app-create-country-background-color, #1d5588);
    color: var(--app-create-country-color, #fff);
    padding-top: 16px;
    padding-bottom: 24px;
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
  }

  .column {
    margin-left: 16px;
    margin-right: 16px;
    padding-left: 8px;
    padding-right: 8px;
  }

  paper-button {
    background-color: var(--app-accent-color);
    color: #FFF;
    margin-left: auto;
    margin-right: auto;
    margin-top: 24px;
  }

  .sliderHeader {
    margin-top: 8px;
  }

  .emoji {
    margin-right: 8px;
    width: 45px;
    height: 45px;
  }

  paper-input {
    padding-left: 16px;
    padding-right: 16px;
    color: #FFF;
    --paper-input-container-color: #FFF;
    --paper-input-container-focus-color: #FFF;
    --paper-input-container-input-color: #FFF;
  }

  paper-textarea {
    padding-left: 16px;
    padding-right: 16px;
    --paper-input-container-color: #FFF;
    --paper-input-container-focus-color: #FFF;
    --paper-input-container-input-color: #FFF;
    color: #FFF;
  }

  paper-slider {
    --paper-slider-container-color: #FFF;
    --paper-slider-active-color: var(--app-create-country-slider-active-color, #e9bf29);
    --paper-slider-knob-color: var(--app-create-country-slider-active-color, #e9bf29);
    --paper-slider-font-color: var(--app-create-country-slider-active-color, #e9bf29);
    color: #FFF;
    --paper-input-container-color:  var(--app-create-country-slider-active-color, #e9bf29);
    --paper-input-container-focus-color: var(--app-create-country-slider-active-color, #e9bf29);
    --paper-input-container-input-color: var(--app-create-country-slider-active-color, #e9bf29);
    --paper-slider-disabled-active-color:  var(--app-create-country-slider-active-color, #e9bf29);
    --paper-input-disabled-color:  var(--app-create-country-slider-active-color, #e9bf29);
    --paper-slider-disabled-knob-color: var(--app-create-country-slider-active-color, #e9bf29);
    --paper-slider-secondary-color: : var(--app-create-country-slider-active-color, #e9bf29);
  }

  .dropDownContainer {
    margin-left: 16px;
    margin-right: 16px;
  }

  paper-dropdown-menu {
    --paper-input-container-color:  var(--app-create-country-slider-active-color, #e9bf29);
    --paper-input-container-focus-color: var(--app-create-country-slider-active-color, #e9bf29);
    --paper-input-container-input-color: var(--app-create-country-slider-active-color, #e9bf29);
    --paper-slider-disabled-active-color:  var(--app-create-country-slider-active-color, #e9bf29);
    --paper-input-disabled-color:  var(--app-create-country-slider-active-color, #e9bf29);
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

  @media (max-width: 450px) {
    .topContainer {
      max-width: 100%;
      margin-top: 50px;
      margin-left: 0;
      margin-right: 0;
      width: 100%;
      height: 100%;
    }

    paper-input {
      max-width: 300px;
    }

    paper-textarea {
      max-width: 300px;
    }

    paper-slider {
      width: 320px;
    }

    .cultural {
      margin-top: 32px;
    }
  }


  [hidden] {
    display: none !important;
  }
`;
