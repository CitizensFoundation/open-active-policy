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
      submitDisabled: Boolean
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
        socialProgress: 0
      }};

    this.countryList = [
      {
        name: "Happy Arctic Island Nation Now (Iceland)",
        description: "Behind just a few of their Scandanavian cousins to the East on the list of the world’s happiest nations, these island people are an engaged, educated, industrious, forward-thinking, largely homogeneous population in the throes of redesigning their constitution. Can you help them?",
        population: "340.000",
        geographicalSize: "103K",
        naturalResourceWealth: 7,
        borderDensity: 7,
        hostilityNeighboringCountries: 1,
        barrieresToCitizenship: 6,
        culturalAttitutes: {
          authority: 4,
          liberty: 9,
          science: 8,
          tradition: 9,
          collective: 8,
          independence: 9,
          privacy: 6,
          lawAndOrder: 6,
          socialProgress: 8
        }
      },
      {
        name: "Nordic Peninsular Kingdom 1849 (Denmark’s June 5)",
        description: "Against the backdrop of revolutions sweeping other Western European nations, with the territorial questions around Holstein and Schleswig threatening to boil over, and on the advice of his dying father, Fredrick VII undertakes the major step of relinquishing his absolutist monarchy, and framing a constitution to take Denmark into an era of fledgling democracy. Do you think you could do a better job than he did?",
        population: "1.4M",
        geographicalSize: "43K",
        naturalResourceWealth:4,
        borderDensity: 4,
        hostilityNeighboringCountries: 4,
        barrieresToCitizenship: 2,
        culturalAttitutes: {
          authority: 8,
          liberty: 4,
          science: 4,
          tradition: 9,
          collective: 5,
          independence: 2,
          privacy: 5,
          lawAndOrder: 7,
          socialProgress: 3
        }
      },
      {
        name: "13 Colonies 1783 (US Constitutional Convention)",
        description: "A rag-tag band of diverse colonies join together to defeat one of the most powerful maritime Empires in the world at that time; shocked at their own victory, they are determined not to have won the War, only to have lost the Peace. They set out to frame a document that will provide for a future free of the tyranny and injustice they had just endured at the hands of Mad King George II. Can you do as good a job as they did, or perhaps even build a more perfect union?",
        population: "2.7M",
        geographicalSize: "9.5M",
        naturalResourceWealth: 10,
        borderDensity: 1,
        hostilityNeighboringCountries: 8,
        barrieresToCitizenship: 3,
        culturalAttitutes: {
          authority: 2,
          liberty: 10,
          science: 8,
          tradition: 2,
          collective: 4,
          independence: 9,
          privacy: 8,
          lawAndOrder: 5,
          socialProgress: 6
        }
      },
      {
        name: "‘Murica Now (US currently)",
        description: "The first Democratic nation in the world, this nation has grown from 13 to 50 states since its constitution was first written. It rode the wave of Economic development following World War 2 to become the undeniable Super Power of the 20th Century; now it finds itself floundering in a constitutional crisis at the beginning of the 21st. Help this nation write a new constitution that reflects the new nation it has become!",
        population: "350M",
        geographicalSize: "9.5M",
        naturalResourceWealth: 9,
        borderDensity: 7,
        hostilityNeighboringCountries: 3,
        barrieresToCitizenship: 6,
        culturalAttitutes: {
          authority: 7,
          liberty: 7,
          science: 5,
          tradition: 7,
          collective: 1,
          independence: 8,
          privacy: 3,
          lawAndOrder: 6,
          socialProgress: 5
        }
      },
      {
        name: "Islamic Revolutionary Republic 1979 (Iran at fall of Shah)",
        description: "After the Fall of the Shah, the Ayatollah Khomeini returns from exile in Paris with a rough draft of a constitution that mixes elements of the Quran and the Fifth French Constitution; it goes through many revisions as the Islamic Revolutionary movement crafts a Theocracy that reflects the cultural values that lead them to revolt against a Shah propped up by the infidels in the CIA. Think you understand a population like that well enough to frame a constitution they will think is just and righteous?",
        population: "37M",
        geographicalSize: "1.6M",
        naturalResourceWealth: 7,
        borderDensity: 8,
        hostilityNeighboringCountries: 10,
        barrieresToCitizenship: 8,
        culturalAttitutes: {
          authority: 9,
          liberty: 2,
          science: 6,
          tradition: 10,
          collective: 8,
          independence: 7,
          privacy: 2,
          lawAndOrder: 9,
          socialProgress: 1
        }
      },
      {
        name: "Jolly Island Kingdom Now (Brexit Era UK - time to codify?)",
        description: "It’s a certain Kingdom that’s not looking very “United” these days -- can a well engineered 19th Century Constitutional Monarchy with an uncodified jurisprudence tradition make it in the 21st Century? Could you codify their constitution for the future to make a better island nation?",
        population: "66M",
        geographicalSize: "242K",
        naturalResourceWealth: 6,
        borderDensity: 5,
        hostilityNeighboringCountries: 2,
        barrieresToCitizenship: 6,
        culturalAttitutes: {
          authority: 8,
          liberty: 7,
          science: 6,
          tradition: 9,
          collective: 4,
          independence: 9,
          privacy: 3,
          lawAndOrder: 9,
          socialProgress: 5
        }
      },
      {
        name: "Pseudo-Communist Asian Superpower Now (Mainland China)",
        description: "Once this nation was Chung-Kuo, the Middle Kingdom, the center of the universe. After a tumultuous history of 19th Century abuse at the hands of the colonial powers, and a 20th Century of war, famine, and autocratic rule, at the beginning of the 21st Century it is poised to become the greatest economic superpower the world has ever known, while internal democratic forces threaten to tear its autocracy apart. Can you imagine a new constitution for the future of the world’s most populous nation?",
        population: "1.4B",
        geographicalSize: "9.5M",
        naturalResourceWealth: 9,
        borderDensity: 10,
        hostilityNeighboringCountries: 6,
        barrieresToCitizenship: 9,
        culturalAttitutes: {
          authority: 9,
          liberty: 2,
          science: 9,
          tradition: 9,
          collective: 9,
          independence: 7,
          privacy: 1,
          lawAndOrder: 9,
          socialProgress: 1
        }
      },
      {
        name: "Future Land (Imaginary Utopian State)",
        description: "Dream of a perfect world, where everyone is equal, lives their lives in peace and tranquility with little suffering and injustice? Well, here’s your chance to design a constitution for such a brave, new land.",
        population: "5M",
        geographicalSize: "500K",
        naturalResourceWealth: 5,
        borderDensity: 8,
        hostilityNeighboringCountries: 2,
        barrieresToCitizenship: 8,
        culturalAttitutes: {
          authority: 5,
          liberty: 9,
          science: 10,
          tradition: 2,
          collective: 8,
          independence: 2,
          privacy: 8,
          lawAndOrder: 8,
          socialProgress: 10
        }
      },
      {
        name: "Splinter State (Imaginary Anarchist State)",
        description: "Does the modern world seem like a terrible prison of rules, expectations and oppression? Do you yearn for a world with less structure, less people in your face telling you what to do? Well here is a country full of punk rock activists that want to live like you do! Can you design a constitution that holds this crazy kingdom together?",
        population: "5M",
        geographicalSize: "500K",
        naturalResourceWealth: 5,
        borderDensity: 1,
        hostilityNeighboringCountries: 8,
        barrieresToCitizenship: 1,
        culturalAttitutes: {
          authority: 1,
          liberty: 10,
          science: 9,
          tradition: 1,
          collective: 1,
          independence: 10,
          privacy: 1,
          lawAndOrder: 1,
          socialProgress: 5
        }
      },
      {
        name: "Custom country",
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
          socialProgress: 0
        }
      }
    ]
  }

  render() {
    return html`
    <div class="layout vertical center-center">
      <div class="topContainer shadow-animation shadow-elevation-3dp">
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

              <div class="sliderHeader"><span class="emoji">✊</span>${this.localize("socialProgressEgalitarianism")}</div>
                <paper-slider class="attituteSlider"
                  @value-changed="${(event) => { this.changeAttitute('socialProgress', event)}}"
                  .value="${this.country.culturalAttitutes.socialProgress}"
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
  }
}

window.customElements.define('oap-country-creation', OapCountryCreation);
