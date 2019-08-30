import { html, supportsAdoptingStyleSheets } from 'lit-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-slider/paper-slider';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-input/paper-textarea';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';

import { Scene, DirectionalLight, PerspectiveCamera, TextGeometry, Color, FontLoader, BufferGeometry, Shape, Mesh, WebGLRenderer, ExtrudeGeometry, MeshPhongMaterial} from 'three';

import { OapPageViewElement } from '../oap-page-view-element';
import { OapCountryCreationStyles } from './oap-country-creation-styles';
import { OapFlexLayout } from '../oap-flex-layout';
import { OapShadowStyles } from '../oap-shadow-styles';

class OapCountryCreation extends OapPageViewElement {
  static get properties() {
    return {
      country: Object,
      customCountry: Boolean,
      submitDisabled: Boolean,
      configFromServer: Object
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
    this.customCountry = null;
    this.submitDisabled = true;
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
          progressivism: 0
        }
    };
  }

  render() {
    return html`
    <div class="layout vertical center-center">
      <div class="topContainer shadow-animation shadow-elevation-3dp">
        <div class="welcomeLogoContainer layout center-center">
          <img aria-label="welcome/velkomin" class="welcomeLogo" src="${this.configFromServer.client_config.ballotBudgetLogo}"></img>
        </div>
        ${(this.countryList && this.country) ?  html`
          <div class="layout-inline vertical" style="width: 100%;">
            <div class="header"><div style="padding: 8px">${this.localize("createYourCountry")}</div></div>

            <div class="dropDownContainer">
              <paper-dropdown-menu .label="${this.localize("Choose a country or create your own")}" @selected-item-changed="${this.countrySelected}">
                  <paper-listbox slot="dropdown-content">
                    ${this.countryList.map((country, index)=>{
                      return html`
                        <paper-item data-id="${index}">${country.name}</paper-item>
                      `
                    })}
                  </paper-listbox>
                </paper-dropdown-menu>
            </div>

            <div class="hiddenDiv nextToTop" ?hidden="${this.customCountry===null}">
              <div class="subHeader noBottom basicInfo">${this.localize("basicInformation")}</div>

              <paper-input id="name"
                          name="name"
                          type="text"
                          label="${this.localize('countryName')}"
                          .value="${this.country.name}"
                          @value-changed="${this.setName}"
                          ?hidden="${!this.customCountry}"
                          maxlength="50"
                          char-counter>
              </paper-input>

              <paper-textarea id="description"
                              name="description"
                              .value="${this.country.description}"
                              ?always-float-label="${(this.country && this.country.description)}"
                              label="${this.localize('countryDescription')}"
                              char-counter
                              @value-changed="${this.setDescription}"
                              ?char-counter="${this.customCountry}"
                              rows="2"
                              max-rows="5"
                              maxlength="500">
              </paper-textarea>

              <div class="subHeader cultural">
                ${this.localize("culturalAttitude")}
                <paper-icon-button icon="help-outline" @click="${this.culturalHelp}"></paper-icon-button>
              </div>

              <div id="culturalAttitudes" class="flexRow cultRow">
                <div class="column">
                  <div class="sliderHeader"><span class="emoji">🏛️</span>${this.localize("authority")}</div>
                  <paper-slider class="attituteSlider"
                    @value-changed="${(event) => { this.changeAttitute('authority', event)}}"
                    .value="${this.country.culturalAttitutes.authority}"
                    max="9" ?disabled="${!this.customCountry}"
                    >
                </paper-slider>

                <div class="sliderHeader"><span class="emoji">🔬</span>${this.localize("science")}</div>
                  <paper-slider class="attituteSlider"
                    @value-changed="${(event) => { this.changeAttitute('science', event)}}"
                    .value="${this.country.culturalAttitutes.science}"
                    max="9" ?disabled="${!this.customCountry}"
                    >
                </paper-slider>

                <div class="sliderHeader"><span class="emoji">👥</span>${this.localize("collective")}</div>
                <paper-slider class="attituteSlider"
                  @value-changed="${(event) => { this.changeAttitute('collective', event)}}"
                  .value="${this.country.culturalAttitutes.collective}"
                    max="9" ?disabled="${!this.customCountry}"
                    >
                </paper-slider>

                <div class="sliderHeader"><span class="emoji">🔐</span>${this.localize("privacy")}</div>
                  <paper-slider class="attituteSlider"
                  @value-changed="${(event) => { this.changeAttitute('privacy', event)}}"
                .value="${this.country.culturalAttitutes.privacy}"
                  max="9" ?disabled="${!this.customCountry}"
                  >
                </paper-slider>

                <div class="sliderHeader"><span class="emoji">✊</span>${this.localize("progressivism")}</div>
                  <paper-slider class="attituteSlider"
                    @value-changed="${(event) => { this.changeAttitute('progressivism', event)}}"
                    .value="${this.country.culturalAttitutes.progressivism}"
                    max="9" ?disabled="${!this.customCountry}"
                    >
                </paper-slider>
              </div>

              <div class="column">
                  <div class="sliderHeader"><span class="emoji">🌅</span>${this.localize("liberty")}</div>
                  <paper-slider class="attituteSlider"
                    @value-changed="${(event) => { this.changeAttitute('liberty', event)}}"
                    .value="${this.country.culturalAttitutes.liberty}"
                    max="9" ?disabled="${!this.customCountry}"
                    >
                  </paper-slider>

                  <div class="sliderHeader"><span class="emoji">🏺</span>${this.localize("tradition")}</div>
                  <paper-slider class="attituteSlider"
                    @value-changed="${(event) => { this.changeAttitute('tradition', event)}}"
                    .value="${this.country.culturalAttitutes.tradition}"
                    max="9" ?disabled="${!this.customCountry}"
                    >
                  </paper-slider>

                  <div class="sliderHeader"><span class="emoji">🛡️</span>${this.localize("independence")}</div>
                  <paper-slider class="attituteSlider"
                    @value-changed="${(event) => { this.changeAttitute('independence', event)}}"
                    .value="${this.country.culturalAttitutes.independence}"
                    max="9" ?disabled="${!this.customCountry}"
                    >
                  </paper-slider>

                  <div class="sliderHeader"><span class="emoji">👮</span>${this.localize("lawAndOrder")}</div>
                  <paper-slider class="attituteSlider"
                    @value-changed="${(event) => { this.changeAttitute('lawAndOrder', event)}}"
                    .value="${this.country.culturalAttitutes.lawAndOrder}"
                    max="9" ?disabled="${!this.customCountry}"
                    >
                  </paper-slider>

                </div>
              </div>

              <div class="subHeader noBottom rawStats">${this.localize("countryRawStats")}</div>

              <paper-input id="population"
                          name="population"
                          type="text"
                          label="${this.localize('populationSize')}"
                          .value="${this.country.population}"
                          maxlength="8"
                          @value-changed="${this.setPopulation}"
                          char-counter>
              </paper-input>

              <paper-input id="geographicalSize"
                          name="geographicalSize"
                          type="text"
                          label="${this.localize('geographicalSize')}"
                          .value="${this.country.geographicalSize}"
                          @value-changed="${this.setGeographicalSize}"
                          maxlength="8"
                          char-counter>
              </paper-input>

              <div class="flexRow">
                <div class="column">
                  <div class="sliderHeader"><span class="emoji emojiResources">🔋</span>${this.localize("naturalResourceWealth")}</div>
                    <paper-slider
                      @value-changed="${(event) => { this.changeStats('naturalResourceWealth', event)}}"
                      .value="${this.country.naturalResourceWealth}"
                      max="9" ?disabled="${!this.customCountry}"
                      >
                    </paper-slider>

                    <div class="sliderHeader"><span class="emoji">🛂</span>${this.localize("borderDensity")}</div>
                    <paper-slider
                      @value-changed="${(event) => { this.changeStats('borderDensity', event)}}"
                      .value="${this.country.borderDensity}"
                      max="9" ?disabled="${!this.customCountry}"
                      >
                    </paper-slider>
                  </div>
                <div class="column">
                  <div class="sliderHeader"><span class="emoji">🌐</span>${this.localize("hostilityNeighboringCountries")}</div>
                  <paper-slider
                    @value-changed="${(event) => { this.changeStats('hostilityNeighboringCountries', event)}}"
                    .value="${this.country.hostilityNeighboringCountries}"
                    max="9" ?disabled="${!this.customCountry}"
                    >
                  </paper-slider>

                  <div class="sliderHeader"><span class="emoji">🧱</span>${this.localize("barrieresToCitizenship")}</div>
                  <paper-slider
                    @value-changed="${(event) => { this.changeStats('barrieresToCitizenship', event)}}"
                    .value="${this.country.barrieresToCitizenship}"
                    max="9" ?disabled="${!this.customCountry}"
                    >
                  </paper-slider>
                </div>
              </div>

            </div>
            <div class="layout horizontal center-center">
              <paper-button raised id="submitButton" ?hidden="${this.customCountry===null}" ?disabled="${this.submitDisabled}" class="buttton" @click="${()=> { this.fire('oap-country-created', this.country) }}">${this.localize("buildConstitutionForCountry")}</paper-button>
            </div>

          </div>

        ` : html``}

      </div>

    </div>
    `
  }

  countrySelected(event) {
    if (event.detail.value) {
      const countryId = event.detail.value.dataset.id;
      this.country = this.countryList[event.detail.value.dataset.id];
      if (countryId==9) {
        this.customCountry = true;
        this.country.name = "";
        this.submitDisabled = true;
        this.checkIfOkToProceed();
      } else {
        this.countryList[9].name="Custom country";
        this.customCountry = false;
        this.submitDisabled = false;
      }
      this.fire('oap-start-cultural-attitutes-tutorial');
    }
  }

  checkIfOkToProceed() {
    if (this.country.name.length>1 &&
        this.country.description.length>1 &&
        this.country.population.length>0 &&
        this.country.geographicalSize.length>0) {
      this.submitDisabled = false;
    }
  }

  setName(event) {
    if (event.detail.value && this.customCountry) {
      this.country.name = event.detail.value;
      this.checkIfOkToProceed();
    }
  }

  setDescription(event) {
    if (event.detail.value && this.customCountry) {
      this.country.description = event.detail.value;
      this.checkIfOkToProceed();
    }
  }

  setPopulation(event) {
    if (event.detail.value && this.customCountry) {
      this.country.population = event.detail.value;
      this.checkIfOkToProceed();
    }
  }

  changeStats(stat, event) {
    if (event.detail.value && this.customCountry) {
      this.country[stat] = event.detail.value;
    }
  }

  changeAttitute(attitute, event) {
    if (event.detail.value && this.customCountry) {
      this.country.culturalAttitutes[attitute] = event.detail.value;
    }
  }

  setGeographicalSize(event) {
    if (event.detail.value && this.customCountry) {
      this.country.geographicalSize = event.detail.value;
      this.checkIfOkToProceed();
    }
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
    if (changedProps.has("configFromServer") && this.configFromServer) {
      this.countryList = this.configFromServer.client_config.countryList;
    }
  }
}

window.customElements.define('oap-country-creation', OapCountryCreation);
