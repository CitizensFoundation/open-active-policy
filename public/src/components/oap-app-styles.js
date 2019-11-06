/**
@license
Copyright (c) 2010-2019 Citizens Foundation
*/

import { css } from 'lit-element';

export const OapAppStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
  }

  section {
    padding: 24px;
    background: var(--app-section-odd-color);
  }

  section > * {
    max-width: 600px;
    margin-right: auto;
    margin-left: auto;
  }

  section:nth-of-type(even) {
    background: var(--app-section-even-color);
  }

  app-header {
    z-index: 5000;
  }

  :host {
    display: block;
    --app-primary-color: #000;
    --app-secondary-color: black;
    --app-main-backround-color: var(-app-outside-main-background-color, #000);
    --app-accent-color: var(--paper-orange-a700);
    --app-accent-color-light: var(--paper-orange-a200);
    --app-text-color: #ffffff;

    --paper-tabs-selection-bar-color: #aaa;
    --paper-tabs-selection-bar: {
      color: #aaa;
      border-bottom: 3px solid !important;
      border-bottom-color: #aaa;
    };

    --primary-color-more-darker: var(--app-main-backround-color, #333);
    --primary-color: var(--app-main-backround-color, #333);

    color: var(--app-text-color);

    --app-header-background-color: #000;
    --app-header-text-color: var(--app-text-color);
    --app-header-selected-color: #000;
    --paper-icon-button-ink-color: var(--app-text-color);
  }

  app-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
    background-color: var(--app-header-background-color, #000);
    color: var(--app-header-text-color, #FFF);
    border-bottom: 1px solid #000;
    outline: none;
  }

  app-header[wide-and-ballot] {
    height: var(--app-budget-container-height, 184px);
    width: 100%;
    background-size: 1920px 184px;
    background-repeat: no-repeat;
    background-position: center;
    background-position-y: top;
    background-image: var(--app-budget-container-background-image);
  }

  [main-title] {
    font-size: 30px;
    /* In the narrow layout, the toolbar is offset by the width of the
    drawer button, and the text looks not centered. Add a padding to
    match that button */
    padding-right: 44px;
  }

  main {
    display: block;
  }

  .main-content {
  }

  .main-content[has-ballot] {
    padding-top: 170px;
  }

  .main-content[has-ballot][wide] {
    padding-top: 150px;
  }

  .page {
    display: none;
  }

  .page[active] {
    display: block;
  }

  .toolbar-top {
    background-color: var(--app-toolbar-top-color, #000);
  }


  @media (min-width: 1024px) {
    .toolbar-list {
      display: block;
    }
    .menu-btn {
      display: none;
    }

    .main-content[has-ballot] {
      padding-top: 188px;
    }

    /* The drawer button isn't shown in the wide layout, so we don't
    need to offset the title */
    [main-title] {
      padding-right: 0px;
    }
  }

  app-toolbar {
    border-bottom: 0px;
  }

  .title {
    font-size: 24px;
  }

  paper-icon-button {
    width: 50px;
    height: 50px;
  }

  .closeHelpButton {
    width: 58px;
    height: 58px;
    position: absolute;
    right: 0;
    top: 0;
  }

  paper-icon-button.closeButton {
    width: 58px;
    height: 58px;
  }

  @media (max-width: 640px) {
    paper-icon-button {
      width: 40px;
      height: 40px;
    }


  .closeHelpButton {
    width: 46px;
    height: 46px;
  }

    paper-icon-button.closeButton {
      width: 46px;
      height: 46px;
    }
  }

  @media (max-width: 1024px) {
    .title {
      font-size: 17px;
    }
  }

  .exitIconInBudget {
    position: absolute;
    top: 0;
    left: 0;
    color: #fff;
  }

  .helpIconInBudget  {
    position: absolute;
    top: 2px;
    right: 0;
    color: #fff;
  }

  .choicePoints {
    position: absolute;
    top: 0;
    left: 0;
    color: #fff;
  }

  #helpContent h1 {
    line-height: 1em;
    font-size: 1.5em;
  }

  #helpContent h2 {
    margin-bottom: 0;
    margin-top: 24px;
  }

  #savedGameDialog {
    background-color: #000;
    color: #FFF;
  }

  .savedGameContent {
    font-size: 20px;
    padding: 16px;
    margin-right: 16px;
    margin-left: 16px;
    padding-bottom: 0;
  }

  .savedGameButton {
    background-color: #000;
    color: #FFF;
    width: 100%;
    text-align: center;
    border: 1px solid #FFF;
    margin-bottom: 16px;
  }

  .smallQuotes {
    color: #999;
    text-align: center;
    padding-bottom: 4px;
  }

  #favoriteIcon {
    color: var(--app-facvorite-icon-color, rgb(255,215,0));
    background-color: transparent;
    width: 50px;
    height: 50px;
    z-index: 2720;
    -webkit-filter: drop-shadow( 1px 1px 10px #5f5f5f );
    filter: drop-shadow( 1px 1px 10px #5f5f5f );
  }

  @media (max-width: 640px) {
    #favoriteIcon {
      width: 40px;
      height: 40px;
    }
  }

  .buttons {
    margin-top: 16px;
  }

  .budgetContainer {
  }

  .largeSpinner {
    position: fixed; /* or absolute */
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
  }

  [hidden] {
    display: none !important;
  }

  paper-dialog {
    background-color: var(--primary-background-color);
  }

  .masterDialog {
    font-size: 22px;
    max-width: 420px;
    width: 420px;
    padding: 8px;
    padding-top: 0;
    line-height: 1.3;
    margin: 8px;
    width: 100%;
    margin: 0 !important;
    padding: 0 !important;
  }

  .masterDialog > .heading {
    text-align: center;
  }

  .masterDialog > .buttons {
    text-align: center;
  }

  .welcomeText {
    width: 420px;
    max-width: 420px;
    font-size: 16px;
    margin-top: 8px;
    color: #FFF;
  }

  .welcomeLogo {
    padding: 0;
    margin: 0;
    margin-top: 8px;
    max-width: 200px;
    width: 200px;
    height: 200px;
  }

  .masterLogoContainer {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }

  #masterDialog {
    background-color: #000;
    color: #FFF;
  }

  paper-button.continueButton {
    background-color: #000;
    color: #fff;
    border: 1px solid #eaeaea;
    margin: 8px;
    margin-bottom: 8px;
    font-size: 18px;
  }

  paper-button.generalButton {
    color: var(--app-accent-color);
    background-color: #fff;
    margin: 8px;
  }

  .heading {
      font-size: 28px;
      font-weight: bold;
      color: #fff;
    }

  @media (max-width: 600px) {
    .masterDialog {
      font-size: 16px;
      padding: 8px;
      padding-top: 0;
      width: 100%;
    }

    .headingNoImage {
      margin-top: 64px;
    }

    paper-dialog#masterDialog {
      margin: 0;
      padding: 0;
      width: 100%;
      text-align: justify;
    }

    paper-dialog {
      margin: 0;
    }

    .heading {
      font-size: 28px;
    }

    .welcomeText {
      width: 100%;
    }

    paper-button.continueButton {
      font-size: 16px;
    }
    .welcomeLogo {
      width: 200px;
      height: 200px;
    }
  }

  @media (max-width: 340px) {
    .masterDialog {
      font-size: 13px;
    }
    .heading {
      font-size: 20px;
    }
    paper-button.continueButton {
      font-size: 16px;
    }
    .welcomeLogo {
      margin-left: 16px;
      display: none;
    }
    .welcomeLogologoContainer {
      display: none;
    }
    paper-button.continueButton {
      margin-top: 0;
    }
  }

  .masterLogoContainer {
  }

  paper-dialog {
    z-index: 1000000;
  }

  .langSelectionText {
    font-size: 16px;
    margin-top: 24px;
    margin-bottom: 24px;
  }

  .langSelect {
    cursor: pointer;
    margin-left: 4px;
  }

  .langSelect[is-selected] {
    text-decoration: underline;
  }

  .choicePoints {
    margin-left: 8px;
    margin-top: 4px;
    color: var(--app-accent-color, #000);
    font-weight: bold;
  }
`;
