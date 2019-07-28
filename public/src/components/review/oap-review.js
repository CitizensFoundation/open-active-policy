import { html, supportsAdoptingStyleSheets } from 'lit-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-slider/paper-slider';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-input/paper-textarea';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';

import { OapPageViewElement } from '../oap-page-view-element';
import { OapReviewStyles } from './oap-review-styles';
import { OapFlexLayout } from '../oap-flex-layout';
import { OapShadowStyles } from '../oap-shadow-styles';

class OapReview extends OapPageViewElement {
  static get properties() {
    return {
      country: Object,
      customCountry: Boolean,
      submitDisabled: Boolean
    };
  }

  static get styles() {
    return [
      OapReviewStyles,
      OapFlexLayout,
      OapShadowStyles
    ];
  }

  constructor() {
    super();
    this.reset();
  }

  reset() {
  }

  render() {
    return html`
    <div class="layout vertical center-center">
      <div class="topContainer shadow-animation shadow-elevation-3dp">
        <div class="layout-inline vertical" style="width: 100%;">
          <div class="header"><div style="padding: 8px">${this.localize("reviewOfYourConstitution")}</div></div>
          <p>TO BE DONE</p>

          <div class="header"><div style="padding: 8px">${this.localize("shareOnSocialMedia")}</div></div>
          <p>TO BE DONE</p>

        </div>
      </div>
    </div>
    `
  }

  updated(changedProps) {
    super.updated(changedProps);
  }
}

window.customElements.define('oap-review', OapReview);
