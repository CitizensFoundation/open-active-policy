import { html, supportsAdoptingStyleSheets } from 'lit-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-slider/paper-slider';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-input/paper-textarea';

import { Scene, DirectionalLight, PerspectiveCamera, TextGeometry, Color, FontLoader, BufferGeometry, Shape, Mesh, WebGLRenderer, ExtrudeGeometry, MeshPhongMaterial} from 'three';

import { OapPageViewElement } from '../oap-page-view-element';
import { OapCountryCreationStyles } from './oap-country-creation-styles';
import { OapFlexLayout } from '../oap-flex-layout';
import { OapShadowStyles } from '../oap-shadow-styles';

class OapCountryCreation extends OapPageViewElement {
  static get properties() {
    return {
      country: Object
    };
  }

  static get styles() {
    return [
      OapCountryCreationStyles,
      OapFlexLayout,
      OapShadowStyles
    ];
  }

  constructor() {
    super();
    this.reset();
  }

  reset() {
    this.country = {
      name: "",
      description: "",
      population: "",
      geographicalSize: "",
      naturalResourceWealth:0,
      borderDensity: 0,
      hostilityNeighboringCountries: 0,
      barrieresToCitizenship: 0,
      culturalAttitutes: {
        authority: 0,
        liberty: 0,
        science: 0,
        tradition: 0,
        collective: 0,
        independence: 0,
        privacy: 0,
        lawAndOrder: 0,
        socialProgressEgalitariansism: 0
      }};
  }

  render() {
    return html`
    <div class="layout vertical center-center">
      <div class="topContainer shadow-animation shadow-elevation-3dp">
        <div class="layout-inline vertical" style="width: 100%;">
        <div class="header"><div style="padding: 8px">${this.localize("createYourCountry")}</div></div>

          <div class="subHeader noBottom">${this.localize("basicInformation")}</div>

          <paper-input id="name"
                      name="name"
                      type="text"
                      label="${this.localize('countryName')}"
                      .value="${this.country.name}"
                      maxlength="50"
                      char-counter>
          </paper-input>

          <paper-textarea id="description"
                          name="description"
                          .value="${this.country.description}"
                          ?always-float-label="${(this.country && this.country.description)}"
                          label="${this.localize('countryDescription')}"
                          char-counter
                          rows="2"
                          max-rows="5"
                          maxlength="400">
          </paper-textarea>

          <div class="subHeader cultural">${this.localize("culturalAttitude")}</div>

          <div id="culturalAttitudes" class="flexRow">
            <div class="column">
              <div class="sliderHeader">${this.localize("authority")}</div>
              <paper-slider
                .value="${this.country.culturalAttitutes.authority}"
                max="10"
                editable>
            </paper-slider>

            <div class="sliderHeader">${this.localize("science")}</div>
              <paper-slider
                .value="${this.country.culturalAttitutes.science}"
                max="10"
                editable>
            </paper-slider>

            <div class="sliderHeader">${this.localize("collective")}</div>
              <paper-slider
                .value="${this.country.culturalAttitutes.collective}"
                max="10"
                editable>
            </paper-slider>

            <div class="sliderHeader">${this.localize("privacy")}</div>
            <paper-slider
              .value="${this.country.culturalAttitutes.privacy}"
              max="10"
              editable>
            </paper-slider>

            <div class="sliderHeader">${this.localize("socialProgressEgalitarianism")}</div>
              <paper-slider
                .value="${this.country.culturalAttitutes.socialProgressEgalitariansism}"
                max="10"
                editable>
            </paper-slider>
          </div>

          <div class="column">
              <div class="sliderHeader">${this.localize("liberty")}</div>
              <paper-slider
                .value="${this.country.culturalAttitutes.liberty}"
                max="10"
                editable>
              </paper-slider>

              <div class="sliderHeader">${this.localize("tradition")}</div>
              <paper-slider
                .value="${this.country.culturalAttitutes.tradition}"
                max="10"
                editable>
              </paper-slider>

              <div class="sliderHeader">${this.localize("independence")}</div>
              <paper-slider
                .value="${this.country.culturalAttitutes.independence}"
                max="10"
                editable>
              </paper-slider>

              <div class="sliderHeader">${this.localize("lawAndOrder")}</div>
              <paper-slider
                .value="${this.country.culturalAttitutes.lawAndOrder}"
                max="10"
                editable>
              </paper-slider>

            </div>
          </div>

          <div class="subHeader noBottom">${this.localize("countryRawStats")}</div>

          <paper-input id="population"
                      name="population"
                      type="text"
                      label="${this.localize('populationSize')}"
                      .value="${this.country.population}"
                      maxlength="8"
                      char-counter>
          </paper-input>

          <paper-input id="geographicalSize"
                      name="geographicalSize"
                      type="text"
                      label="${this.localize('geographicalSize')}"
                      .value="${this.country.geographicalSize}"
                      maxlength="8"
                      char-counter>
          </paper-input>

          <div class="flexRow">
            <div class="column">
              <div class="sliderHeader">${this.localize("naturalResourceWealth")}</div>
                <paper-slider
                  .value="${this.country.naturalResourceWealth}"
                  max="10"
                  editable>
                </paper-slider>

                <div class="sliderHeader">${this.localize("borderDensity")}</div>
                <paper-slider
                  .value="${this.country.borderDensity}"
                  max="10"
                  editable>
                </paper-slider>
              </div>
            <div class="column">
              <div class="sliderHeader">${this.localize("hostilityNeighboringCountries")}</div>
              <paper-slider
                .value="${this.country.hostilityNeighboringCountries}"
                max="10"
                editable>
              </paper-slider>

              <div class="sliderHeader">${this.localize("barrieresToCitizenship")}</div>
              <paper-slider
                .value="${this.country.barrieresToCitizenship}"
                max="10"
                editable>
              </paper-slider>
            </div>
          </div>

          <div class="layout horizontal center-center">
            <paper-button raised id="submitButton" class="buttton" @click="${()=> { this.fire('oap-country-created') }}">${this.localize("submit")}</paper-button>
          </div>

        </div>
      </div>

    </div>
    `
  }

  updated(changedProps) {
    super.updated(changedProps);
  }
}

window.customElements.define('oap-country-creation', OapCountryCreation);
