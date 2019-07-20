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
    background-color: var(--app-accent-color);
    color: #FFF;
    min-width: 350px;
    max-width: 350px;
    margin: 8px;
  }

  .topContainer {
    max-width: 432px;
    margin-left: auto;
    margin-right: auto;
    background-color: var(--quiz-background-color, #FFF);
    color: var(--quiz-color, #111);
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
