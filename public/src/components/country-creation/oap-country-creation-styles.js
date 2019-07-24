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
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: bold;
  }

  .subHeader {
    font-size: 20px;
    margin-top: 24px;
    margin-bottom: 16px;
  }

  .topContainer {
    margin-top: 100px;
    max-width: 600px;
    background-color: var(--app-create-country-background-color, #fff);
    color: var(--app-create-country-color, #333);
    padding: 24px;
    margin-left: auto;
    margin-right: auto;
  }

  .sliderHeader {
    margin-top: 8px;
  }

  @media (max-width: 450px) {
    .topContainer {
      max-width: 100%;
      width: 100%;
      height: 100%;
    }
  }


  [hidden] {
    display: none !important;
  }
`;
