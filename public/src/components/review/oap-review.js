import { html, supportsAdoptingStyleSheets } from 'lit-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-slider/paper-slider';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-input/paper-textarea';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import 'paper-share-button';

import { Scene, DirectionalLight, PerspectiveCamera, TextGeometry, Color, FontLoader, BufferGeometry, Shape, Mesh, WebGLRenderer, ExtrudeGeometry, MeshPhongMaterial} from 'three';

import { OapPageViewElement } from '../oap-page-view-element';
import { OapReviewStyles } from './oap-review-styles';
import { OapFlexLayout } from '../oap-flex-layout';
import { OapShadowStyles } from '../oap-shadow-styles';
import { GetResultsForReview } from '../oap-bonuses-and-penalties';

class OapReview extends OapPageViewElement {
  static get properties() {
    return {
      country: Object,
      customCountry: Boolean,
      submitDisabled: Boolean,
      selectedItems: Array,
      configFromServer: Object,
      attituteReviewParagraphs: Object,
      countryReviewParagraph: String
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
    this.customCountry = null;
    this.submitDisabled = true;
  }

  render() {
    return html`
    <div class="layout vertical center-center">
      <div class="topContainer shadow-animation shadow-elevation-3dp">
        <div class="welcomeLogoContainer layout center-center">
          <img aria-label="welcome/velkomin" class="welcomeLogo" src="${this.configFromServer.client_config.ballotBudgetLogo}"></img>
        </div>

        <div class="layout-inline vertical">
          <div class="header">${this.localize("reviewOfYourConstitution")}</div>

          ${this.attituteReviewParagraphs ?  html`
            <div class="hiddenDiv nextToTop">
              <div class="countryHeader">${this.country.name}</div>
              <div class="basicInformationDescription">${this.country.description}</div>

              <div class="subHeader" ?hidden="${!this.countryReviewParagraph}">
                ${this.localize("overallCountryReview")}
              </div>

              <div class="countryReview" ?hidden="${!this.countryReviewParagraph}">${this.countryReviewParagraph}</div>

              <div class="subHeader cultural">
                ${this.localize("culturalAttitudeReviews")}
                <paper-icon-button icon="help-outline" @click="${this.culturalHelp}"></paper-icon-button>
              </div>

              <div id="culturalAttitudes" class="flexRow cultRow">
                <div class="attituteHeader"><span class="emoji">🔬</span>${this.localize("science")}</div>
                <div class="attituteReview">${this.attituteReviewParagraphs['science']}</div>

                <div class="attituteHeader"><span class="emoji">👥</span>${this.localize("collective")}</div>
                <div class="attituteReview">${this.attituteReviewParagraphs['collective']}</div>

                <div class="attituteHeader"><span class="emoji">🔐</span>${this.localize("privacy")}</div>
                <div class="attituteReview">${this.attituteReviewParagraphs['privacy']}</div>

                <div class="attituteHeader"><span class="emoji">✊</span>${this.localize("progressivism")}</div>
                <div class="attituteReview">${this.attituteReviewParagraphs['progressivism']}</div>

                <div class="attituteHeader"><span class="emoji">🌅</span>${this.localize("liberty")}</div>
                <div class="attituteReview">${this.attituteReviewParagraphs['liberty']}</div>

                <div class="attituteHeader"><span class="emoji">🏺</span>${this.localize("tradition")}</div>
                <div class="attituteReview">${this.attituteReviewParagraphs['tradition']}</div>

                <div class="attituteHeader"><span class="emoji">🛡️</span>${this.localize("independence")}</div>
                <div class="attituteReview">${this.attituteReviewParagraphs['independence']}</div>

                <div class="attituteHeader"><span class="emoji">👮</span>${this.localize("lawAndOrder")}</div>
                <div class="attituteReview">${this.attituteReviewParagraphs['lawAndOrder']}</div>
              </div>


              <div class="" style="width:100%;text-align: center;">
                <div style="margin-left:auto;margin-right:auto;">
                  <div class="subHeader">
                    ${this.localize("shareOnSocialMedia")}
                  </div>

                  <div>
                    <paper-share-button class="shareIcon" horizontal-align="left" id="shareButton"
                      facebook twitter popup .url="${window.location.href}">
                    </paper-share-button>
                  </div>
                </div>
              </div>
          ` : html``}
        </div>
      </div>
    </div>
   `
  }

  culturalHelp() {
    let content;
    if (this.configFromServer.client_config.helpPageLocales[this.language]) {
      content = this.b64DecodeUnicode(this.configFromServer.client_config.cultureHelpPageLocales[this.language].b64text);
    } else if (this.configFromServer.client_config.helpPageLocales["en"]) {
      content = this.b64DecodeUnicode(this.configFromServer.client_config.cultureHelpPageLocales["en"].b64text)
    } else {
      content = "No help page found for selected language!"
    }
    this.fire('oap-open-help', content)
  }

  b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('selectedItems')) {
      if (this.selectedItems) {
        const reviewsMaster = this.configFromServer.client_config.languages[this.language].attituteReviews;
        const reviews = GetResultsForReview(this.selectedItems, this.country, reviewsMaster);
        debugger;
        this.attituteReviewParagraphs=reviews.attituteReviewParagraphs;
        this.countryReviewParagraph=reviews.countryReviewParagraph;
      }
    }
  }
}

window.customElements.define('oap-review', OapReview);

