import { html, supportsAdoptingStyleSheets } from 'lit-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-slider/paper-slider';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-input/paper-textarea';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import 'paper-share-button';
import '../select-articles/oap-article-item';
import { repeat } from 'lit-html/directives/repeat';

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
      allItems: Array,
      configFromServer: Object,
      attituteReviewParagraphs: Object,
      countryReviewParagraph: String,
      completionScore: Object,
      isConstitutionViable: Boolean,
      debugText: String,
      reviewId: String,
      gotReviewFromServer: Boolean
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
    this.isConstitutionViable = true;
  }

  getModuleColorForItem(item) {
    return this.configFromServer.client_config.moduleTypeColorLookup[item.module_content_type];
  }

  render() {
    return html`
    <div class="layout-inline vertical center-center">
      <div class="topContainer shadow-animation shadow-elevation-3dp">
        <div class="welcomeLogoContainer layout center-center">
          <img aria-label="welcome/velkomin" class="welcomeLogo" src="${this.configFromServer.client_config.ballotBudgetLogo}"></img>
        </div>

        <div class="layout-inline vertical center-center">
          <div class="header">${this.localize("reviewOfYourConstitution")}</div>

          ${this.attituteReviewParagraphs ?  html`
            <div class="hiddenDiv nextToTop mainArea" style="margin-left: auto;margin-right:auto;">

              <div class="countryHeader">${this.country.name}</div>
              <div class="basicInformationDescription">${this.country.description}</div>

              ${!this.isConstitutionViable ? html`
                <div class="notViable ">
                  <div class="subHeader">${this.localize("yourConstitutionIsNotViableHeader")}</div>
                  <div>${this.localize("yourConstitutionIsNotViable")}</div>
                  <div>
                    ${Object.keys(this.completionScore).map((key) => {
                      if (this.completionScore[key].status=='weak') {
                        return html`<div class="weakItem">${this.completionScore[key].name}</div>`
                      } else {
                        return html``
                      }
                    })}
                  </div>

                  <div id="submitButtonContainerTwo" class="layout horizontal center-center" ?hidden="${this.gotReviewFromServer}">
                   <paper-button id="retryButton" raised class="" @click="${()=> { this.fire('oap-reset-select-articles') }}">${this.localize("retrySelectingArticles")}</paper-button>
                 </div>

                </div>
              ` : ''}

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
                  <div class="subHeader shareHeader">
                    ${this.localize("shareOnSocialMedia")}
                  </div>

                  <div>
                    <paper-share-button class="shareIcon" horizontal-align="left" id="shareButton" @click="${this.shareClick}"
                      facebook twitter popup .url="https://${window.location.hostname+"/constitutions/review/"+this.reviewId}">
                    </paper-share-button>
                  </div>
                </div>
              </div>
          ` : html``}
        </div>
      </div>

      ${ this.configFromServer.mechDebug===true ?  html`
        <div class="topContainer">
         <pre>${this.debugText}</pre><br>
         <div>${JSON.stringify(this.completionScore)}</div>
        </div>
      ` : html``}

      <div class="itemContainer layout horizontal center-center flex wrap">
        <div class="header lastHeader">${this.localize('finalSelection')}</div>
          ${repeat(this.selectedItems, (item) => item.id,  (item, index) => {
              let headerTemplate = html``;
              if (index===0 || this.selectedItems[index-1].module_type_index!=item.module_type_index) {
                headerTemplate = html`
                  <div style="width: 100%;background-color:${this.getModuleColorForItem(item)}" class="flex finalHeader">${this.getModuleTypeName(item.module_content_type)}</div>
                `;
              }
              return html`
                ${headerTemplate}
                <oap-article-item
                  .name="${item.id}"
                  class="ballotAreaItem"
                  .selected="${true}"
                  .hideClose="${true}"
                  .onlyDisplay="${true}"
                  .configFromServer="${this.configFromServer}"
                  .language="${this.language}"
                  .budgetElement="${this.budgetElement}"
                  .item="${item}">
                </oap-article-item>
              `
            }
          )}
      </div>
    </div>
   `
  }

  shareClick() {
    this.activity("click","share");
  }

  getModuleTypeName(module_content_type) {
    return this.localize(module_content_type.toLowerCase().replace('/',''));
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
        const reviews = GetResultsForReview(this.selectedItems, this.allItems, this.country, reviewsMaster);
        this.attituteReviewParagraphs=reviews.attituteReviewParagraphs;
        this.countryReviewParagraph=reviews.countryReviewParagraph;
        this.completionScore = reviews.completionScore;
        this.isConstitutionViable = reviews.isConstitutionViable;
        this.debugText = reviews.debugText;
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = function () {
            window.history.pushState(null, "", window.location.href);
        };
      }
    }
  }
}

window.customElements.define('oap-review', OapReview);

