/**
@license
Copyright (c) 2010-2019 Citizens Foundation
*/

import { css } from 'lit-element';

export const OapFilterArticlesStyles = css`

  :host {
    width: 100%;
  }

  .completed {
    margin-top: 32px;
  }

  .continueButton {
    margin-top: 24px;
    background-color: #000;
    border: 1px solid #FFF;
    color: #FFF;
    width: 100%;
    margin-left: 32px;
    margin-right: 32px;
  }

  .topContainer {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    background-color: var(--quiz-background-color, #000);
    color: var(--quiz-color, #FFF);
    padding-bottom: 16px;
    margin-top: 32px;
  }

  .completeHeader {
    padding: 16px;
  }


  [hidden] {
    display: none !important;
  }
`;
