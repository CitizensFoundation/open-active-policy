/**
@license
Copyright (c) 2010-2019 Citizens Foundation. AGPL License. All rights reserved.
*/

import { LitElement, html, css } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';

import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';
import { CacheEmojisInBackground } from './3d-utils/oap-2d-emojis';
import { StartDelayedFontCaching, SetForceSlowOnFontCaching, StartPerformCacheWelcomeTexts } from './3d-utils/oap-cached-text-geometry';
import { FontLoader } from 'three';

import 'whatwg-fetch';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import './oap-icons.js';
import './snack-bar.js';
import './policy-quiz/oap-policy-quiz';
import './filter-articles/oap-filter-articles';
import './select-articles/oap-ballot';
import './select-articles/oap-3d-budget';
import './review/oap-review';
import './country-creation/oap-country-creation';

//import './browse-articles/oap-swipable-cards';
//import './oav-voting-completed';

import { OapAppStyles } from './oap-app-styles';
import { OapBaseElement } from './oap-base-element.js';
import { OapFlexLayout } from './oap-flex-layout.js';

async function cacheDataImages(items) {
  if (items) {
    await new Promise(resolve => setTimeout(resolve, 100));
    for (let i=0; i<items.length; i++) {
      const img = new Image();
      img.src=items[i].image_url;
      await new Promise(resolve => setTimeout(resolve, 750));
    }
  }
}

async function cacheSoundEffects(soundEffects) {
  if (soundEffects) {
    const effects = Object.values(soundEffects);
    for (let i=0; i<effects.length; i++) {
      effects[i].audio = new Audio(effects[i].url);
      effects[i].audio.volume = effects[i].volume;
      await new Promise(resolve => setTimeout(resolve, 750));
    }
  }
}

class OapApp extends OapBaseElement {
  static get properties() {
    return {
      appTitle: { type: String },
      _page: { type: String },
      _drawerOpened: { type: Boolean },
      _snackbarOpened: { type: Boolean },

      _offline: { type: Boolean },
      _subPath: {
        type: String,
      },

      favoriteIcon: {
        type: String,
        value: 'star'
      },

      dialogHeading: {
        type: String,
        value: ''
      },

      activityHost: {
        type: String,
        value: ""
      },

      setupDefaults: {
        type: Boolean,
        value: false
      },

      votePublicKey: {
        type: String
      },

      configFromServer: {
        type: Object,
        value: null
      },

      requestInProgress: {
       type: Boolean,
       value: false
      },

      title: {
        type: String
      },

      showExit: {
        type: Boolean,
        value: false
      },

      hideBudget: {
        type: Boolean,
        value: true
      },

      areaName: String,

      currentBallot: Object,

      currentBudget: Object,

      budgetElement: Object,

      totalBudget: Number,

      haveSetLanguage: {
        type: Boolean,
        value: false
      },

      resizeTimer: Object,

      postsHost: String,

      welcomeHeading: String,

      welcomeText: String,

      helpContent: String,

      masterHelpContent: String,

      wideAndBallot: Boolean,

      errorText: String,

      languageOveride: String,

      filteredItems: Array,

      selectedItems: Array,

      quizQuestions: Array,

      totalChoicePoints: Number,

      usedChoicePoints: Number,

      snackBarContent: String,

      country: Object,

      debouncedSave: Object,

      usedBonusesAndPenalties: Object,

      savedGameDate: String,

      disableAutoSave: Boolean,

      font3d: Object,

      openMasterDialog: String,

      masterDialogCloseFunction: Function
    };
  }

  static get styles() {
    return [
      OapAppStyles,
      OapFlexLayout
    ];
  }

  render() {
    let errorDialog = html`
      <paper-dialog id="errorDialog">
        <p id="errorText">${this.errorText}</p>
        <div class="buttons">
          <paper-button class="generalButton" dialog-confirm autofocus @click="${this.resetErrorText}">OK</paper-button>
        </div>
      </paper-dialog>
    `
    return  html`${this.configFromServer ?
      html`
        ${errorDialog}

        ${this.configFromServer.client_config.insecureEmailLoginEnabled===true ?
          html`
            <oav-insecure-email-login
              .language="${this.language}"
              .configFromServer="${this.configFromServer}"
              id="insecureEmailLogin">
            </oav-insecure-email-login>
          ` :
          html``
        }
        <paper-dialog id="helpDialog" @close="${this.helpClosed}">
          <paper-dialog-scrollable>
            <div id="helpContent">
              ${unsafeHTML(this.helpContent)}
            </div>
          </paper-dialog-scrollable>
          <div class="buttons">
            <paper-button class="closeButton generalButton" dialog-dismiss>${this.localize('close')}</paper-button>
          </div>
        </paper-dialog>

        <paper-dialog id="savedGameDialog" modal>
          <div class="masterLogoContainer center-center">
             <img aria-label="welcome/velkomin" class="welcomeLogo" src="${this.configFromServer.client_config.ballotBudgetLogo}"></img>
          </div>
          <div class="savedGameContent">
            ${this.localize("youHaveAnAutoSavedGameFrom")} ${this.savedGameDate}
          </div>
          <div class="saveButtons">
            <paper-button class="savedGameButton"" @click="${this.restoreGameFromSave}" dialog-dismiss>${this.localize('reloadSavedGame')}</paper-button>
            <paper-button class="savedGameButton"  @click="${this.openNewGame}">${this.localize('newGame')}</paper-button>
          </div>
        </paper-dialog>

        <paper-dialog id="masterDialog" modal @close="${this.masterDialogCloseFunction}">
          <paper-dialog-scrollable>
            ${this.masterDialogContent}
          </paper-dialog-scrollable>
        </paper-dialog>

        <app-header fixed effects="waterfall" ?wide-and-ballot="${this.wideAndBallot}" ?hidden="${this._page == 'areas-ballot'}">
          <app-toolbar class="toolbar-top">
            <div ?hidden="${!this.showExit}" class="layout horizontal exitIconInBudget">
              <paper-icon-button class="closeButton" alt="${this.localize('close')}" icon="closeExit" @click="${this._exit}"></paper-icon-button>
            </div>
            <div class="helpIconInBudget">
              <paper-icon-button icon="help-outline" alt="${this.localize('help')}" @click="${this._help}}"></paper-icon-button>
            </div>
            ${ this._page==="area-ballot" ? html`
              <div class="budgetConstainer layout horizontal center-center">
                <oap-3d-budget
                  id="budget"
                  .areaName="${this.areaName}"
                  .language="${this.language}"
                  .selectedItems="${this.selectedItems}"
                  .showExit="${this.showExit}"
                  .font3d="${this.font3d}"
                  .usedChoicePoints="${this.usedChoicePoints}"
                  .totalChoicePoints="${this.totalChoicePoints}"
                  .configFromServer="${this.configFromServer}"
                  .currentBallot="${this.currentBallot}">
                </oap-3d-budget>
              </div>
            ` : html`` }
          </app-toolbar>
          <iron-icon id="favoriteIcon" icon="${this.favoriteIcon}" hidden></iron-icon>
        </app-header>

        <main role="main" class="main-content" ?has-ballot="${this._page == 'area-ballot'}">
          ${ this._page==="create-country" ?  html`
            <oap-country-creation
              id="createCountry"
              .configFromServer="${this.configFromServer}"
              .nickname="Robert Bjarnason"
              .language="${this.language}"
              class="page"
              ?active="${this._page === 'create-country'}">
            </oap-country-creation>
            ` : html``}
          ${ this._page==="quiz" ?  html`
            <oap-policy-quiz
              id="quiz"
              .questions="${this.quizQuestions}"
              .configFromServer="${this.configFromServer}"
              .nickname="Robert Bjarnason"
              .language="${this.language}"
              .font3d="${this.font3d}"
              .totalChoicePoints="${this.totalChoicePoints}"
              class="page"
              ?active="${this._page === 'quiz'}">
            </oap-policy-quiz>
          ` : html``}
          ${ this._page==="filter-articles" ?  html`
            <oap-filter-articles id="filterArticles"
              .language="${this.language}"
              .configFromServer="${this.configFromServer}"
              class="page"
              .selectedItems="${this.selectedItems}"
              .filteredItems="${this.filteredItems}"
              .country="${this.country}"
              .allItems="${this.allItems}"
              ?active="${this._page === 'filter-articles'}">
            </oap-filter-articles>
          ` : html`` }
          ${ this._page==="area-ballot" ?  html`
            <oap-ballot id="budgetBallot"
              .budgetBallotItems="${this.filteredItems}"
              .configFromServer="${this.configFromServer}"
              .budgetElement="${this.currentBudget}"
              .language="${this.language}"
              .country="${this.country}"
              .usedBonusesAndPenalties="${this.usedBonusesAndPenalties}"
              class="page"
              ?active="${this._page === 'area-ballot'}">
            </oap-ballot>
          ` : html`` }
          ${ this._page==="article-selection" ?  html`
            <oap-article-selection
              .configFromServer="${this.configFromServer}"
              class="page"
              .language="${this.language}"
              ?active="${this._page === 'article-selection'}">
            </oap-article-selection>
          ` : html`` }
          ${ this._page==="review" ?  html`
            <oap-review id="review"
              .budgetBallotItems="${this.filteredItems}"
              .configFromServer="${this.configFromServer}"
              .selectedItems="${this.selectedItems}"
              .budgetElement="${this.currentBudget}"
              .language="${this.language}"
              .country="${this.country}"
              class="page"
              ?active="${this._page === 'review'}">
            </oap-review>
          ` : html`` }
          ${ this._page === 'post' ? html`
            <yp-post
              .id="post"
              .ballotElement="${this.currentBallot}"
              .language="${this.language}"
              .postId="${this._subPath}"
              .host="${this.postsHost}">
            </yp-post>
          ` : html``}
          <oap-view404 class="page" ?active="${this._page === 'view404'}"></oap-view404>
        </main>

        <snack-bar ?active="${this._snackbarOpened}">
          ${unsafeHTML(this.snackBarContent)}
        </snack-bar>
      `
      :
      html`${errorDialog}<paper-spinner active class="largeSpinner"></paper-spinner>`
      }
    `;
  }

  constructor() {
    super();
    setPassiveTouchGestures(true);
    window.__localizationCache = {
      messages: {},
    }
    this.hideBudget = true;
    this.disableAutoSave = true;
    this._boot();
    var name = "locale".replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    var language = results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
    if (language) {
      this.language = language;
      localStorage.setItem("languageOverride", language);
    }
    this.filteredItems = [];
    this.selectedItems = [];
    this.quizDone=false;
    this.setDummyData();
    this.GAME_STATE_VERSION="OapGameStateV7";
  }

  helpClosed() {
    this.helpContent = this.masterHelpContent;
  }

  setDummyData() {
    this.totalChoicePoints = 100;
    this.usedChoicePoints = 0;
    this.quizQuestions = [
      {
        question: "What is the shortest Constitution in the world?",
        imageUrl: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/quiz/shortestConst1.png",
        correctAnswer: 2,
        answers: [
          "Luxemburg","Andorra","Monaco","Bangladesh"
        ]
      },
      {
        question: "When Oliver Cromwell set up his short-lived government following the English Civil war he created a constitution, but he called his document?",
        imageUrl: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/quiz/cromwell1.jpg",
        correctAnswer: 3,
        answers: [
          "The Law of the Land","Principia Jurisprudencia","The Fiat of God’s Will","The Instrument of Government"
        ]
      },
      {
        question: "The Edicts of Ashoka established a constitutional code for the 3rd Century BC in what is now what modern country?",
        imageUrl: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/quiz/3bc1.jpg",
        correctAnswer: 1,
        answers: [
          "Nigeria","India","Thailand","Australia"
        ]
      },
      {
        question: 'The famous line “life, liberty and the pursuit of happiness” in the US Constitution is actually an edit; the original line read, “life, liberty and..."?',
        imageUrl: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/quiz/wethepeople1.png",
        correctAnswer: 3,
        answers: [
          "The acquisition of wealth","The perfection of spirit","the promotion of the Common Good","the pursuit of property"
        ]
      },
      {
        question: 'Some constitutions are written such that they are extremely difficult to modify or rewrite. This feature is known to scholars as?',
        imageUrl: "",
        correctAnswer: 1,
        answers: [
          "Intransciance","Entrenchment","Obstinance","Intractability"
        ]
      },
      {
        question: 'If a country draws on a legal and cultural tradition to form its constitutional norms, but those norms are not organized into a single document, that constitution is called?',
        imageUrl: "",
        correctAnswer: 2,
        answers: [
          "Unorganized","Unincorporated","Uncodified","Traditionalistic"
        ]
      },
      {
        question: 'If a legislature has only one ruling body it’s referred to as?',
        imageUrl: "",
        correctAnswer: 1,
        answers: [
          "Unilateral","Unicameral","Absolutist","Minimalist"
        ]
      },
      {
        question: 'Many Constitutions have a formal introduction known as a?',
        imageUrl: "",
        correctAnswer: 3,
        answers: [
          "Overture","Mis En Place","Foundation","Preamble"
        ]
      },
      {
        question: 'Dividing the government into branches is commonly referred to as',
        imageUrl: "",
        correctAnswer: 0,
        answers: [
          "Separation of Powers","Dendrology of Authority","Division of Labor","Civic Branching"
        ]
      },
      {
        question: 'The longest known constitution in the world governs what country?',
        imageUrl: "",
        correctAnswer: 0,
        answers: [
          "India","Iran","China","Brazil"
        ]
      }
    ],

    this.soundEffects = {
      oap_short_win_1: {url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/soundsFx/oap_short_win_1.mp3", volume: 0.4},
      oap_new_level_1: {url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/soundsFx/oap_new_level_1.mp3", volume: 0.1}
    }

    cacheSoundEffects(this.soundEffects);
    if (window.debugOn) {
      this.country = {
        name: "13 Colonies 1783 (US Constitutional Convention)",
        description: "A rag-tag band of diverse colonies join together to defeat one of the most powerful maritime Empires in the world at that time; shocked at their own victory, they are determined not to have won the War, only to have lost the Peace. They set out to frame a document that will provide for a future free of the tyranny and injustice they had just endured at the hands of Mad King George II. Can you do as good a job as they did, or perhaps even build a more perfect union?",
        population: "2.7M",
        geographicalSize: "9.5M",
        naturalResourceWealth: 2,
        borderDensity: 0,
        hostilityNeighboringCountries: 2,
        barrieresToCitizenship: 0,
        culturalAttitutes: {
          authority: 9,
          liberty: 9,
          science: 9,
          tradition: 5,
          collective: 2,
          independence: 5,
          privacy: 8,
          lawAndOrder: 5,
          progressivism:2
        },
        reviews: {
          highNetBonuses: "We asked you to understand the needs of punk rock activists, and it turns out you know all about hard core. Fewer rules, more rights -- it’s hard for The Man to keep you down if his hands are tied behind his back. The anarcho-syndicalists are happy with you and have invited you to join them in the mosh pit!",
          breakEven: "Well, true activist types are used to receiving compromise and half-measures in response to their demands, and that’s what you have given them once again. You have made many concessions in the direction of personal liberty and human rights, while still leaving the State with too much centralized power for the tastes of these hard core citizens. The shards of this Splinter State remain unsatisfied.",
          highNetPenalties: "The document you created for this brave Splinter State of anarcho-syndicalists would immediately be spray painted, stomped on, and burned in effigy along with a straw dummy of you. Your traditional legal authority and State Power is seen as classic sell-out of everything your citizens stand for. These imaginary radical activists plan to have sit-in protests in your dreams, in a campaign they call Occupy Your Conscience."
       }
      }
    }
  }

  playSoundEffect (event) {
    const effect = this.soundEffects[event.detail];
    if (effect) {
      setTimeout(()=> {
        let audio;
        if (effect.audio) {
          audio = effect.audio;
        } else {
          audio = new Audio(effect.url);
          audio.volume = effect.volume;
        }
        audio.play();
      });
    }
  }

  processCorrectQuizAnswer() {
    this.fire('oap-play-sound-effect', 'oap_short_win_1');
    this.fire("oap-overlay", {
      html: html`${this.localize("correctAnswer")}`,
      soundEffect: "",
      duration: 300,
    });

    this.totalChoicePoints+=5;
    this.activity('correct', 'quizAnswer');
  }

  processBonusPoints(event) {
    this.fire('oap-play-sound-effect', 'oap_short_win_1');
    this.totalChoicePoints+= event.detail ? event.detail : 5;
    this.activity('bonus', 'forManualSwiping');
  }

  _setupCustomCss(config) {
    if (config.cssProperties) {
      config.cssProperties.forEach(property => {
        const propName = Object.keys(property)[0];
        const values = Object.keys(property).map(function(e) {
          return property[e];
        });
        const propValue = values[0];
        this.shadowRoot.host.style.setProperty(propName, propValue);
        if (window.ShadyCSS) {
          window.ShadyCSS.styleSubtree((this), property);
        }
      });
    }
  }

  selectLocale(event) {
    if (this.language != event.target.dataset.locale) {
      this.language = event.target.dataset.locale;
      localStorage.setItem("languageOverride", this.language);
      if (this._page==="area-ballot" && this.currentBallot) {
        setTimeout( () => {
          this.currentBallot.loadArea();
        }, 10);
      }
    }
  }

  _boot() {
    fetch("/votes/boot", { credentials: 'same-origin' })
      .then(res => res.json())
      .then(response => {
        this.requestInProgress= false;
        this.language = 'en';
        this.votePublicKey = response.public_key;
        this._setupCustomCss(response.config.client_config);
        window.localeResources = response.config.client_config.locales;
        this.configFromServer = response.config;
        this.updateAppMeta(this.configFromServer.client_config.shareMetaData);

        if (this.configFromServer.client_config.welcomeLocales &&
            this.configFromServer.client_config.ballotBudgetLogo) {
          const tempImg = new Image()
          tempImg.src= this.configFromServer.client_config.ballotBudgetLogo;
        }

        ga('create',this.configFromServer.client_config.googleAnalyticsId, 'auto');
        this.postsHost = "https://yrpri.org";
        this.favoriteIcon = "heart";
        this.oneBallotId = 1;
        if (this.configFromServer.client_config.defaultLanguage) {
          if (localStorage.getItem("languageOverride")) {
            this.language = localStorage.getItem("languageOverride");
          } else {
            this.language = this.configFromServer.client_config.defaultLanguage;
          }
          this.setupLocaleTexts();
        }
        if (this.configFromServer.client_config.favoriteIcon) {
          this.favoriteIcon = this.configFromServer.client_config.favoriteIcon;
        }

        this.allItems = this.configFromServer.client_config.modules;

        for (var i=0; i<this.allItems.length; i++) {
          if (this.allItems[i].price) {
            this.allItems[i].price=parseInt(this.allItems[i].price);
          }
        }

        cacheDataImages(this.allItems);
        if (window.debugOn) {
          this.filteredItems = this.allItems;
        }

        if (false && !(location.href.indexOf("completePostingOfVoteAfterRedirect") > -1)) {
          const path = "/quiz";
          window.history.pushState({}, null, path);
          this.fire('location-changed', path);
        }

        this.checkForRestoredGameOrWelcome();

        window.language = this.language;
        window.localize = this.localize;

        setTimeout(()=>{
          StartPerformCacheWelcomeTexts(this.configFromServer.client_config.welcomeTexts, this.font3d);
        }, 950);

        if (this.configFromServer.client_config.insecureEmailLoginEnabled===true) {
          import('./oap-insecure-email-login.js');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        this.fire('oav-error', 'unknown_error');
      });
  }

  disconnectedCallback() {
    this._removeListeners();
  }

  b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  _setupListeners() {
    this.addEventListener("app-resources-loaded", this._transinsecationLoaded);
    this.addEventListener("oav-set-title", this._setTitle);
    this.addEventListener("oav-error", this._errorHandler);
    this.addEventListener("oav-set-area", this._setArea);
    this.addEventListener("oav-clear-area", this._clearArea);
    this.addEventListener("oav-set-favorite-item-in-budget", this._toggleFavoriteItem);
    this.addEventListener("oav-hide-favorite-item", this._hideFavoriteItem);
    this.addEventListener("oav-exit", this._exit);
    this.addEventListener("oap-open-help", this._help);

    this.addEventListener("oap-open-snackbar", this._openSnackBar);
    this.addEventListener("oap-close-snackbar", this._closeSnackBar);
    this.addEventListener("oav-set-ballot-element", this._setBallotElement);
    this.addEventListener("oav-set-budget-element", this._setBudgetElement);
    this.addEventListener("oav-scroll-item-into-view", this._scrollItemIntoView);
    this.addEventListener("oav-insecure-email-login", this._insecureEmailLogin);

    window.addEventListener("resize", this.resetSizeWithDelay.bind(this));

    this.addEventListener("location-changed", this._locationChanged);
    this.addEventListener("oap-process-correct-quiz-answer", this.processCorrectQuizAnswer);
    this.addEventListener("oap-quiz-finished", this.quizFinished);
    this.addEventListener("oap-filtering-finished", this.filteringFinished);
    this.addEventListener("item-selected", this.addItemToFinalList);
    this.addEventListener("oap-play-sound-effect", this.playSoundEffect);
    this.addEventListener("oap-country-created", this.createCountryFinished);
    this.addEventListener("oap-set-total-budget", this.setTotalBudget);
    this.addEventListener("oap-submit-ballot", this.submitBallot);
    this.addEventListener("oap-bonus-points", this.processBonusPoints);
    this.addEventListener("oap-set-3d-font", this.set3dFont);
    this.addEventListener("oap-filtered-items-changed", this.filteredItemsChanged);
    this.addEventListener("oap-selected-items-changed", this.selectedItemsChanged);
    this.addEventListener("oap-used-choice-points-changed", this.usedChoicePointsChanged);
    this.addEventListener("oap-total-choice-points-changed", this.totalChoicePointsChanged);
    this.addEventListener("oap-usedBonusesAndPenalties-changed", this.usedBonusesAndPenaltiesChanged);
    this.addEventListener("oap-reset-all-items", this.resetAllItems);
    this.addEventListener("oap-start-cultural-attitutes-tutorial", this.startCulturalAttitutesTutorial);
  }

  _removeListeners() {
    this.removeEventListener("app-resources-loaded", this._translationLoaded);
    this.removeEventListener("oav-set-title", this._setTitle);
    this.removeEventListener("oav-error", this._errorHandler);
    this.removeEventListener("oav-set-area", this._setArea);
    this.removeEventListener("oav-clear-area", this._clearArea);
    this.removeEventListener("oav-set-area", this._setArea);
    this.removeEventListener("location-changed", this._locationChanged);
    this.removeEventListener("oav-set-favorite-item-in-budget", this._toggleFavoriteItem);
    this.removeEventListener("oav-hide-favorite-item", this._hideFavoriteItem);
    this.removeEventListener("oav-exit", this._exit);
    this.removeEventListener("oav-set-ballot-element", this._setBallotElement);
    this.removeEventListener("oav-set-budget-element", this._setBudgetElement);
    this.removeEventListener("oap-open-help", this._help);
    this.removeEventListener("oav-scroll-item-into-view", this._scrollItemIntoView);
    window.removeEventListener("resize", this.resetSizeWithDelay);
    this.removeEventListener("oav-insecure-email-login", this._insecureEmailLogin);
    this.removeEventListener("oap-process-correct-quiz-answer", this.processCorrectQuizAnswer);
    this.removeEventListener("oap-quiz-finished", this.quizFinished);
    this.removeEventListener("oap-country-created", this.createCountryFinished);
    this.removeEventListener("item-selected", this.addItemToFinalList);
    this.removeEventListener("oap-filtering-finished", this.filteringFinished);
    this.removeEventListener("oap-play-sound-effect", this.playSoundEffect);
    this.removeEventListener("oap-open-snackbar", this._openSnackBar);
    this.removeEventListener("oap-set-total-budget", this.setTotalBudget);
    this.removeEventListener("oap-close-snackbar", this._closeSnackBar);
    this.removeEventListener("oap-submit-ballot", this.submitBallot);
    this.removeEventListener("oap-bonus-points", this.processBonusPoints);
    this.removeEventListener("oap-set-3d-font", this.set3dFont);
    this.removeEventListener("oap-filtered-items-changed", this.filteredItemsChanged);
    this.removeEventListener("oap-selected-items-changed", this.selectedItemsChanged);
    this.removeEventListener("oap-used-choice-points-changed", this.usedChoicePointsChanged);
    this.removeEventListener("oap-total-choice-points-changed", this.totalChoicePointsChanged);
    this.removeEventListener("oap-usedBonusesAndPenalties-changed", this.usedBonusesAndPenaltiesChanged);
    this.removeEventListener("oap-reset-all-items", this.resetAllItems);
    this.removeEventListener("oap-start-cultural-attitutes-tutorial", this.startCulturalAttitutesTutorial);
  }

  usedBonusesAndPenaltiesChanged(event) {
    this.usedBonusesAndPenalties = event.detail;
    this.saveDebounced();
  }

  totalChoicePointsChanged(event) {
    this.totalChoicePoints = event.detail;
    this.saveDebounced();
  }

  usedChoicePointsChanged(event) {
    this.usedChoicePoints = event.detail;
    console.error("Used choice points:", this.usedChoicePoints);
    this.saveDebounced();
  }

  filteredItemsChanged(event) {
    this.filteredItems = event.detail;
    this.saveDebounced();
  }

  selectedItemsChanged(event) {
    this.selectedItems = event.detail;
    this.saveDebounced();
  }

  set3dFont(event) {
    this.font3d = event.detail;
  }

  submitBallot() {
    this.fire('oap-play-sound-effect', 'oap_new_level_1');
    const path = '/review';
    window.history.pushState({}, null, path);
    this.fire('location-changed', path);
    this.activity('finished', 'ballot');
  }

  addItemToFinalList(event) {
    if (event.detail) {
      this.filteredItems.push(event.detail);
    } else {
      console.error("Can't find item to add to final list");
    }
  }

  resetAllItems() {
    console.error("resetAllItems");
    this.filteredItems = [];
    this.selectedItems = [];
  }

  _setBallotElement(event) {
    this.currentBallot = event.detail;
  }

  _setBudgetElement(event) {
    setTimeout(()=>{
      this.currentBudget = event.detail;
    }, 5)
  }

  filteringFinished () {
    this.fire('oap-play-sound-effect', 'oap_new_level_1');
    SetForceSlowOnFontCaching();
    const path = '/area-ballot/1';
    window.history.pushState({}, null, path);
    this.fire('location-changed', path);
    this.activity('finished', 'filtering');
  }

  quizFinished () {
    this.quizDone=true;
    this.fire('oap-play-sound-effect', 'oap_new_level_1');
    const path = '/create-country';
    window.history.pushState({}, null, path);
    this.fire('location-changed', path);
    this.activity('finished', 'quiz');
    this._startDelayedCaching();
    this.openCountrySelectInfoDialog();
  }

  createCountryFinished(event) {
    this.fire('oap-play-sound-effect', 'oap_new_level_1');
    const path = '/filter-articles';
    window.history.pushState({}, null, path);
    this.fire('location-changed', path);
    this.activity('finished', 'createCountry');
    this.country = event.detail;
    this.saveDebounced();
  }

  _scrollItemIntoView(event) {
    this.$$("#budgetBallot")._scrollItemIntoView(event.detail);
  }

  setTotalBudget(event) {
    this.$$("#budget").setTotalBudget(event.detail);
  }

  _hideFavoriteItem() {
    this.$$("#favoriteIcon").hidden = true;
  }

  _insecureEmailLogin(event) {
    this.$$("#insecureEmailLogin").open(event.detail.areaId, event.detail.areaName, event.detail.onLoginFunction);
  }


  _help(event) {
    if (event.detail && event.detail!="1") {
      this.helpContent = event.detail;
    }
    this.$$("#helpDialog").open();
  }

  _setArea(event) {
    this.areaName = event.detail.areaName;
    this.totalBudget = event.detail.totalBudget;
  }

  _clearArea() {
    this.areaName = null;
    this.totalBudget = null;
  }

  _errorHandler(event) {
    this.errorText = this.localize(event.detail);
    this.$$("#errorDialog").open();
  }

  _exit () {
    if (this._page==='post' && window.appLastArea) {
      window.history.pushState({}, null, window.appLastArea);
      this.fire('location-changed', window.appLastArea);
      window.appLastArea = null;
    } else {
      window.history.pushState({}, null, "/");
      this.fire('location-changed', '/');
    }
  }

  _setTitle(event, detail) {
    //this.set('title', detail);
  }

  resetSizeWithDelay() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
    }, 250);
  }

  _translationLoaded() {
    if (!this.haveSetLanguage) {
      this.haveSetLanguage = true;
      if (typeof(Storage) !== "undefined") {
        var selectedLanguage = localStorage.getItem("selectedLanguage");
        if (selectedLanguage) {
          this.fire('iron-signal', {name: 'set-language', data: selectedLanguage});
        }
      }
    }
  }

  closeWelcome() {
    this.$$("#masterDialog").close();
    localStorage.setItem("haveClosedWelcome", true);
    this.afterWelcomeClose();
  }

  getDialog(name) {
    return this.$$("#"+name);
  }

  firstUpdated() {
    super.firstUpdated();
    this._setupListeners();
    installRouter((location) => this._locationChanged(location));
    installOfflineWatcher((offline) => this._offlineChanged(offline));
    installMediaQueryWatcher(`(min-width: 460px)`,
        (matches) => this._layoutChanged(matches));
    installMediaQueryWatcher(`(min-width: 1024px)`,
        (matches) => {
          this.wide = matches;
          this.wideAndBallot = this.wide && this._page==='area-ballot';
        });

    var loader = new FontLoader();
    loader.load( 'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/helvetiker_regular.typeface.json', function ( font ) {
      this.font3d=font;
    }.bind(this));
    this.shadowRoot.setAttribute('--iron-overlay-backdrop-opacity', 1.0);
  }

  afterWelcomeClose() {
    setTimeout(()=>{
      if (this._page==="quiz" && this.$$("#quiz")) {
        this.$$("#quiz").startIntro();
      }
    });
  }

  getHelpContent() {
    if (this.configFromServer.client_config.helpPageLocales[this.language]) {
      return this.b64DecodeUnicode(this.configFromServer.client_config.helpPageLocales[this.language].b64text);
    } else if (this.configFromServer.client_config.helpPageLocales["en"]) {
      return this.b64DecodeUnicode(this.configFromServer.client_config.helpPageLocales["en"].b64text)
    } else {
      return "No help page found for selected language!"
    }
  }

  getWelcomeHeading() {
    if (this.configFromServer.client_config.welcomeLocales[this.language]) {
      return this.configFromServer.client_config.welcomeLocales[this.language].heading;
    } else if (this.configFromServer.client_config.welcomeLocales["en"]) {
      return this.configFromServer.client_config.welcomeLocales["en"].heading
    } else {
      return "No heading found"
    }
  }

  getWelcomeText() {
    if (this.configFromServer.client_config.welcomeLocales[this.language]) {
      return this.configFromServer.client_config.welcomeLocales[this.language].text;
    } else if (this.configFromServer.client_config.welcomeLocales["en"]) {
      return this.configFromServer.client_config.welcomeLocales["en"].text
    } else {
      return "No heading found"
    }
  }

  setupLocaleTexts() {
    this.welcomeHeading = this.getWelcomeHeading();
    this.welcomeText = this.getWelcomeText();
    this.masterHelpContent = this.helpContent = this.getHelpContent();
  }

  updateAppMeta(meta) {
    document.title = meta.title;
    updateMetadata({
      title: meta.title,
      description: meta.description,
      image: meta.shareImageUrl
      // This object also takes an image property, that points to an img src.
    });

    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = meta.faviconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  saveDebounced() {
    if (!this.debouncedSave && !this.disableAutoSave) {
      this.debouncedSave = setTimeout(()=>{
        localStorage.setItem(this.GAME_STATE_VERSION, JSON.stringify({
          path: window.decodeURIComponent(location.pathname),
          page: this._page,
          totalChoicePoints: this.totalChoicePoints,
          usedChoicePoints: this.usedChoicePoints,
          selectedItems: this.selectedItems,
          filteredItems: this.filteredItems,
          quizDone: this.quizDone,
          dateSaved: new Date(),
          country: this.country,
          usedBonusesAndPenalties: this.usedBonusesAndPenalties
        }));
        this.debouncedSave=null;
        console.info("Have autosaved game");
      }, 5*1000);
    } else if (this.disableAutoSave) {
      console.warn("Autosaved is disabled");
    }
  }

  checkForRestoredGameOrWelcome() {
    setTimeout(()=>{
      let gameState = localStorage.getItem(this.GAME_STATE_VERSION);
      if (gameState!=null) {
        gameState = JSON.parse(gameState);
        this.$$("#savedGameDialog").open();
        const parsedDate = new Date(gameState.dateSaved);
        this.savedGameDate = parsedDate.toISOString().slice(0, 10);
      } else {
        this.disableAutoSave=false;
        this.openWelcomeDialog();
      }
    });
  }

  openWelcomeDialog() {
    this.masterDialogCloseFunction = this.openChoicePointsDialog;
    this.masterDialogContent = html`
      <div class="vertical center-center">
      <div class="masterLogoContainer center-center">
        <img aria-label="welcome/velkomin" width="200" height="200" class="welcomeLogo" src="${this.configFromServer.client_config.ballotBudgetLogo}"></img>
      </div>
      <div class="vertical center-center masterDialog">
        <div class="heading">${this.welcomeHeading}</div>
          <div class="horizontal welcomeText">
            ${this.welcomeText}
          </div>
          <div class="langSelectionText">
            ${Object.keys(this.configFromServer.client_config.localeSetup).length>1 ?
              html`
                  ${this.configFromServer.client_config.localeSetup.map((lang) => {
                    return html`
                      <span class="langSelect" data-locale="${lang.locale}" ?is-selected="${lang.locale===this.language}"
                        @click="${this.selectLocale}">${lang.language}</span>
                    `
                  })}
              `
              : html``}
        </div>
        <div class="center-center">
          <paper-button raised class="continueButton" @click="${this.openChoicePointsDialog}" autofocus>${this.localize('next')}</paper-button>
        </div>
      </div>
    </div>
   `
    this.$$("#masterDialog").open();
  }

  openChoicePointsDialog() {
    this.masterDialogCloseFunction = this.openQuizDialog;
    this.masterDialogContent = html`
      <div class="vertical center-center">
      <div class="masterLogoContainer center-center">
        <img aria-label="cpImage" width="486" height="206" style="margin-left: -32px;margin-bottom:-16px;" src="https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/clientAssets/choicePoints1.png"></img>
      </div>
      <div class="vertical center-center masterDialog">
        <div class="heading">Choice Points</div>
        <div class="horizontal welcomeText">
          Choice Points are the game term for your political capital, the “juice” you have to get this constitution written. You will need to spend your points wisely as you choose articles and civil rights in your constitution; you will get bonuses and penalties to your Choice Points for how well the constitution you write fits the desires of your citizens.
        </div>
        <div class="buttons center-center">
          <paper-button raised class="continueButton" @click="${this.openQuizDialog}" autofocus>${this.localize('next')}</paper-button>
        </div>
      </div>
    </div>
   `
    this.$$("#masterDialog").open();
  }

  openQuizDialog() {
    this.masterDialogCloseFunction = this.closeWelcome;
    this.masterDialogContent = html`
      <div class="vertical center-center">
      <div class="masterLogoContainer center-center">
        <img aria-label="choice points image" style="width: 400px;height:226px;" src="https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/clientAssets/quizIntro.jpg"></img>
      </div>
      <div class="vertical center-center masterDialog">
        <div class="heading">Quiz</div>
        <div class="horizontal welcomeText">
          First let’s start with a general quiz about constitutions in history and around the world. The more questions you get right, the more choice points you will have to frame your constitution!        </div>
        <div class="buttons center-center">
          <paper-button raised class="continueButton" @click="${this.closeWelcome}" autofocus>${this.localize('start')}</paper-button>
        </div>
      </div>
    </div>
   `
    this.$$("#masterDialog").open();
  }

  startCulturalAttitutesTutorial() {
    this.masterDialogCloseFunction = null
    this.masterDialogContent = html`
      <div class="vertical center-center">
      <div class="masterLogoContainer center-center">
        <img aria-label="image" style="width: 400px;height:216px;margin-bottom:8px;" src="https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/clientAssets/culturalValues12.jpg"></img>
      </div>
      <div class="vertical center-center masterDialog">
        <div class="heading">Cultural Values</div>
        <div class="horizontal welcomeText">
         These are the values of your society. Pay attention to these as you frame your constitution - you need to match your constitution to the Values of your citizens in your electorate.
        </div>
        <div class="buttons center-center">
          <paper-button raised class="continueButton" dialog-dismiss autofocus>${this.localize('skip')}</paper-button>
          <paper-button raised class="continueButton"  @click="${this.culturalAttitutesTutorialAuthority}"   autofocus>${this.localize('next')}</paper-button>
        </div>
      </div>
    </div>
   `
    this.$$("#masterDialog").open();
  }

  culturalAttitutesTutorialAuthority() {
    this.masterDialogCloseFunction = null;
    this.masterDialogContent = html`
      <div class="vertical center-center">
      <div class="masterLogoContainer center-center" style="font-size: 110px;padding: 52px;margin-bottom: 16px;">
      🏛️
      </div>
      <div class="vertical center-center masterDialog">
        <div class="heading">Authority</div>
        <div class="horizontal welcomeText">
          <em>“I will be your father figure, put your tiny hand in mine…”</em><br>
          High Authority cultures have citizens that country crave strong structure and clear lines of command in their lives, wanting the government to dictate as much as possible clear rules for living. Medium Authority means wanting some guidelines, with less government involvement. Low Authority means the culture values a hands-off attitude from its government.
        </div>
        <div class="buttons center-center">
          <paper-button raised class="continueButton" dialog-dismiss autofocus>${this.localize('skip')}</paper-button>
          <paper-button raised class="continueButton" @click="${this.culturalAttitutesTutorialLiberty}" dialog-dismiss autofocus>${this.localize('next')}</paper-button>
        </div>
      </div>
    </div>
   `
    this.$$("#masterDialog").open();
    this.requestUpdate();
  }

  culturalAttitutesTutorialLiberty() {
    this.masterDialogCloseFunction = null;
    this.masterDialogContent = html`
      <div class="vertical center-center">
      <div class="masterLogoContainer center-center" style="font-size: 110px;padding: 52px;margin-bottom: 16px;">
      🌅
      </div>
      <div class="vertical center-center masterDialog">
        <div class="heading">Liberty</div>
        <div class="horizontal welcomeText">
          <em>A man willing to sacrifice Liberty for Security deserves neither…</em><br>
          This measures the society’s embrace of the idea that a person should be allowed to do whatever the hell they want as long as it doesn’t hurt other people.
        </div>
        <div class="buttons center-center">
          <paper-button raised class="continueButton" dialog-dismiss autofocus>${this.localize('skip')}</paper-button>
          <paper-button raised class="continueButton" @click="${this.culturalAttitutesTutorialScience}" dialog-dismiss autofocus>${this.localize('next')}</paper-button>
        </div>
      </div>
    </div>
   `
    this.$$("#masterDialog").open();
    this.requestUpdate();
  }

  culturalAttitutesTutorialScience() {
    this.masterDialogCloseFunction = null;
    this.masterDialogContent = html`
      <div class="vertical center-center">
      <div class="masterLogoContainer center-center" style="font-size: 110px;padding: 52px;margin-bottom: 16px;">
      🔬
      </div>
      <div class="vertical center-center masterDialog">
        <div class="heading">Science</div>
        <div class="horizontal welcomeText">
          <emScience is true whether you believe in it or not…</em><br>
          This score represents the extent to which this society values facts, truth, demonstrable evidence, the scientific method, modern consensus on sexual and racial equality, evolution, etc.
        </div>
        <div class="buttons center-center">
          <paper-button raised class="continueButton" dialog-dismiss autofocus>${this.localize('skip')}</paper-button>
          <paper-button raised class="continueButton" @click="${this.culturalAttitutesTutorialTradition}" dialog-dismiss autofocus>${this.localize('next')}</paper-button>
        </div>
      </div>
    </div>
   `
    this.$$("#masterDialog").open();
    this.requestUpdate();
  }

  culturalAttitutesTutorialTradition() {
    this.masterDialogCloseFunction = null;
    this.masterDialogContent = html`
      <div class="vertical center-center">
      <div class="masterLogoContainer center-center" style="font-size: 110px;padding: 52px;margin-bottom: 16px;">
      🏺
      </div>
      <div class="vertical center-center masterDialog">
        <div class="heading">Tradition</div>
        <div class="horizontal welcomeText">
          <em>“Study the past, if you wish to divine the future”</em><br>
          <em>- Confucius</em><br>
          Measures how attached the citizens of your country are to age old beliefs of their culture, including religion, dress, legal practice, attitudes about sex and marriage and gender, ethnic heritage, food, and art/music. These committed beliefs deeply influence the sort of government they wish to be ruled by.
        </div>
        <div class="buttons center-center">
          <paper-button raised class="continueButton" dialog-dismiss autofocus>${this.localize('skip')}</paper-button>
          <paper-button raised class="continueButton" @click="${this.culturalAttitutesTutorialCollective}" dialog-dismiss autofocus>${this.localize('next')}</paper-button>
        </div>
      </div>
    </div>
   `
    this.$$("#masterDialog").open();
    this.requestUpdate();
  }

  culturalAttitutesTutorialCollective() {
    this.masterDialogCloseFunction = null;
    this.masterDialogContent = html`
      <div class="vertical center-center">
      <div class="masterLogoContainer center-center" style="font-size: 110px;padding: 52px;margin-bottom: 16px;">
      👥
      </div>
      <div class="vertical center-center masterDialog">
        <div class="heading">Collectivism</div>
        <div class="horizontal welcomeText">
          <em>The good of the many outweighs the good of the few…</em><br>
          Defines the extent to which the culture understands communal sacrifice and shared purpose in the name of the common good.
        </div>
        <div class="buttons center-center">
          <paper-button raised class="continueButton" dialog-dismiss autofocus>${this.localize('skip')}</paper-button>
          <paper-button raised class="continueButton" @click="${this.culturalAttitutesTutorialIndependence}" dialog-dismiss autofocus>${this.localize('next')}</paper-button>
        </div>
      </div>
    </div>
   `
    this.$$("#masterDialog").open();
    this.requestUpdate();
  }

  culturalAttitutesTutorialIndependence() {
    this.masterDialogCloseFunction = null;
    this.masterDialogContent = html`
      <div class="vertical center-center">
      <div class="masterLogoContainer center-center" style="font-size: 110px;padding: 52px;margin-bottom: 16px;">
      🛡️
      </div>
      <div class="vertical center-center masterDialog">
        <div class="heading">Independence</div>
        <div class="horizontal welcomeText">
          <em>Swear allegiance to no other flag, serve no nation but thine own…</em><br>
          This measures the extent the culture of the country dictates that it maintain complete autonomy from other nation states. High Independence indicates the citizens supports almost no international coalition building or globalist thinking. Low Independence indicates they welcome partnerships with friendly foriegn powers all over the globe.
        </div>
        <div class="buttons center-center">
          <paper-button raised class="continueButton" dialog-dismiss autofocus>${this.localize('skip')}</paper-button>
          <paper-button raised class="continueButton" @click="${this.culturalAttitutesTutorialPrivacy}" dialog-dismiss autofocus>${this.localize('next')}</paper-button>
        </div>
      </div>
    </div>
   `
    this.$$("#masterDialog").open();
    this.requestUpdate();
  }

  culturalAttitutesTutorialPrivacy() {
    this.masterDialogCloseFunction = null;
    this.masterDialogContent = html`
      <div class="vertical center-center">
      <div class="masterLogoContainer center-center" style="font-size: 110px;padding: 52px;margin-bottom: 16px;">
      🔐
      </div>
      <div class="vertical center-center masterDialog">
        <div class="heading">Privacy</div>
        <div class="horizontal welcomeText">
          <em>“Asking a government to protect your privacy is like asking a Peeping Tom to install your window blinds.”</em><br>
          Defines how much the citizens of the country value their personal information being kept safe from the public sphere, and how much they expect their government to behave with regard to that boundary.
        </div>
        <div class="buttons center-center">
          <paper-button raised class="continueButton" dialog-dismiss autofocus>${this.localize('skip')}</paper-button>
          <paper-button raised class="continueButton" @click="${this.culturalAttitutesTutorialLawAndOrder}" dialog-dismiss autofocus>${this.localize('next')}</paper-button>
        </div>
      </div>
    </div>
   `
    this.$$("#masterDialog").open();
    this.requestUpdate();
  }

  culturalAttitutesTutorialLawAndOrder() {
    this.masterDialogCloseFunction = null;
    this.masterDialogContent = html`
      <div class="vertical center-center">
      <div class="masterLogoContainer center-center" style="font-size: 110px;padding: 52px;margin-bottom: 16px;">
      👮
      </div>
      <div class="vertical center-center masterDialog">
        <div class="heading">Law and Order</div>
        <div class="horizontal welcomeText">
          <em>“The more Law and Order is made prominent, the more thieves and robbers there will be” </em><br>
          <em>- Lao Tze</em><br>
          This sets the appetite of the country’s citizenship for law enforcement in their lives and communities; High means that this makes them feel safe; Low means that it makes them angry and want to revolt.
        </div>
        <div class="buttons center-center">
          <paper-button raised class="continueButton" dialog-dismiss autofocus>${this.localize('skip')}</paper-button>
          <paper-button raised class="continueButton" @click="${this.culturalAttitutesTutorialProgressivism}" dialog-dismiss autofocus>${this.localize('next')}</paper-button>
        </div>
      </div>
    </div>
   `
    this.$$("#masterDialog").open();
    this.requestUpdate();
  }

  culturalAttitutesTutorialProgressivism() {
    this.masterDialogCloseFunction = null;
    this.masterDialogContent = html`
      <div class="vertical center-center">
      <div class="masterLogoContainer center-center" style="font-size: 110px;padding: 52px;margin-bottom: 16px;">
      ✊
      </div>
      <div class="vertical center-center masterDialog">
        <div class="heading">Social Progress/</div>
        <div class="horizontal welcomeText">
          <em>“...the arc of the moral universe is long, but it bends toward justice.”</em><br>
          <em>- Martin Luther King, Jr.</em>
          This score measures the country’s urge towards social justice, equal treatment for all people, level playing field free of corruption, kleptocracy, cronyism and prejudice, and their belief in every citizen’s right to clean air, food, water, housing, education, medical attention.
        </div>
        <div class="buttons center-center">
          <paper-button raised class="continueButton" dialog-dismiss autofocus>${this.localize('continue')}</paper-button>
        </div>
      </div>
    </div>
   `
    this.$$("#masterDialog").open();
    this.requestUpdate();
  }


  openCountrySelectInfoDialog() {
    this.masterDialogCloseFunction = null;
    this.masterDialogContent = html`
      <div class="vertical center-center">
      <div class="masterLogoContainer center-center">
        <img aria-label="choice points image" style="width: 400px;" src="https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/clientAssets/earth1.jpg"></img>
      </div>
      <div class="vertical center-center masterDialog">
        <div class="heading">Select a Country</div>
        <div class="horizontal welcomeText">
         Pick the country and time in history that you want to write a constitution for! We have 10 countries in different time periods to choose from, each with different cultural values. Matching your constitution to these cultural values gives you bonuses and penalties to your Choice Points!</div>
        <div class="buttons center-center">
          <paper-button raised class="continueButton" dialog-dismiss autofocus>${this.localize('continue')}</paper-button>
        </div>
      </div>
    </div>
   `
    this.$$("#masterDialog").open();
  }

  _startDelayedCaching(options) {
    setTimeout(()=>{
      const emojis = ["🏛️","🌅","🔬","🏺","👥","🛡️","🔐","👮","✊","🔋","🛂","🌐","🧱"];
      CacheEmojisInBackground(["⏳"], "120px Arial", options);
      CacheEmojisInBackground(emojis, "120px Arial", options);
    }, 500);
    setTimeout(()=>{
      StartDelayedFontCaching(this.font3d, options);
    }, 1100);
  }

  openNewGame() {
    this.$$("#savedGameDialog").close();
    this.disableAutoSave=false;
    localStorage.removeItem(this.GAME_STATE_VERSION);
    if (!window.debugOn==true) {
      this.totalChoicePoints = 100;
      this.usedChoicePoints = 0;
      this.selectedItems = [];
      this.quizDone = false;
      this.country = null;
      this.filteredItems = [];
      this.usedBonusesAndPenalties = [];
    }
    this.afterWelcomeClose();
  }

  restoreGameFromSave() {
    let gameState = localStorage.getItem(this.GAME_STATE_VERSION);
    if (gameState!=null) {
      gameState = JSON.parse(gameState);
      this.totalChoicePoints = gameState.totalChoicePoints;
      this.usedChoicePoints = gameState.usedChoicePoints;
      this.selectedItems = gameState.selectedItems;
      this.country = gameState.country;
      this.quizDone = gameState.quizDone;
      this.filteredItems = gameState.filteredItems;
      this.usedBonusesAndPenalties = gameState.usedBonusesAndPenalties;
      setTimeout(()=>{
        this.disableAutoSave=false;
        this._gotoLocation(gameState.path);
      });
      if (gameState.page!='quiz') {
        if (gameState.page=='area-ballot') {
          this._startDelayedCaching({slow: true});
        } else {
          this._startDelayedCaching();
        }
      }
    } else {
      console.error("Trying to restore game state, not valid state");
    }
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('language')) {
      this.setupLocaleTexts();
    }

    if (changedProps.has('totalChoicePoints') ||
        changedProps.has('usedChoicePoints') ||
        changedProps.has('selectedItems') ||
        changedProps.has('country') ||
        changedProps.has('usedBonusesAndPenalties') ||
        changedProps.has('_page')) {
          this.saveDebounced();
    }

    if (changedProps.has('budgetElement')) {
    }

    if (changedProps.has('_page')) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      console.info("Current page: "+this._page);
      const pageTitle = this.appTitle + ' - ' + this._page;

      const page = this._page;
      const oldPage = changedProps.get('_page');

      if (this.configFromServer && this.configFromServer.client_config.landingPageData && page && page!='select-voting-area') {
        this.showExit = true;
      } else {
        this.showExit = false;
      }

      // Setup top ballot if needed
      if (page && page=='area-ballot') {
        this.hideBudget = false;
      } else {
        this.hideBudget = true;
      }

      // Reset post if needed
      if (oldPage=='post' && this.$$("#post")) {
        this.$$("#post").reset();
      }

      // Do not allow access to voting-completed from a reload
      if (page=='voting-completed' && oldPage!='area-ballot') {
        window.location = "/";
      }

      if ((page!=='quiz' && !this.quizDone) && !window.debugOn) {
        window.history.pushState({}, null, "/quiz");
        this.fire('location-changed', "/quiz");
      } else if (!window.debugOn) {
        if (page==='area-ballot' && (this.filteredItems.length===0 && this.country==null)) {
          window.history.pushState({}, null, "/create-country");
          this.fire('location-changed', "/create-country");
        } else if (page==='area-ballot' && this.filteredItems.length===0) {
          window.history.pushState({}, null, "/filter-articles");
          this.fire('location-changed', "/filter-articles");
        }

        if (page==='filter-articles' && this.country==null) {
          window.history.pushState({}, null, "/create-country");
          this.fire('location-changed', "/create-country");
        }

        if (page==='review' && (this.selectedItems.length===0 && this.filteredItems.length===0 && this.country==null)) {
          window.history.pushState({}, null, "/create-country");
          this.fire('location-changed', "/create-country");
        } else if (page==='area-ballot' && (this.selectedItems.length===0 && this.filteredItems.length===0)) {
          window.history.pushState({}, null, "/filter-articles");
          this.fire('location-changed', "/filter-articles");
        } else if (page==='area-ballot' && (this.selectedItems.length===0)) {
          window.history.pushState({}, null, "/area-ballot/1");
          this.fire('location-changed', "/area-ballot/1");
        }

        if (page==='review' && this.country==null) {
          window.history.pushState({}, null, "/create-country");
          this.fire('location-changed', "/create-country");
        }
      }

      // Send page info to Google Analytics
      if (page && typeof ga == 'function') {
        ga('send', 'pageview', {
          'page': location.pathname + location.search  + location.hash
        });
      }

      this.wideAndBallot = this.wide && page==='area-ballot';
    }
  }

  _layoutChanged(isWideLayout) {
  }

  _offlineChanged(offline) {
    const previousOffline = this._offline;
    this._offline = offline;

    // Don't show the snackbar on the first load of the page.
    if (previousOffline === undefined) {
      return;
    }
  }

  _openSnackBar(event) {
    setTimeout(()=>{
      clearTimeout(this.__snackbarTimer);
      this._snackbarOpened = true;
      this.snackBarContent = event.detail;
      this.__snackbarTimer = setTimeout(() => { this._snackbarOpened = false;  this.snackBarContent =null }, 5000);
    });
  }

  _closeSnackBar(event) {
    clearTimeout(this.__snackbarTimer);
    this._snackbarOpened = false;
  }

  _gotoLocation(path) {
    window.history.pushState({}, null,path);
    this.fire('location-changed', path);
  }

  _locationChanged(location) {
    if (location instanceof CustomEvent)
      location = { pathname: location.detail };

    if (location.pathname==="/") {
      this._gotoLocation("/quiz");
    }

    const path = window.decodeURIComponent(location.pathname);
    const page = path === '/' ? '/' : path.slice(1).split("/")[0];

    this._loadPage(page);
    // Any other info you might want to extract from the path (like page type),
    // you can do here.
    if (path.slice(1).split('/')[1]) {
      this._subPath = path.slice(1).split('/')[1];
    }
  }

  _loadPage(page) {
    switch(page) {
      case 'post':
        import('./yp-post/yp-post.js');
        break;
      case 'area-ballot':
      case 'voting-completed':
      case 'filter-articles':
      case 'create-country':
      case 'quiz':
      case 'review':
      case '/':
        break;
      default:
        page = 'view404';
        import('./oap-view404.js');
    }

    this._page = page;
  }

  _menuButtonClicked() {
    this._updateDrawerState(true);
  }

  _drawerOpenedChanged(e) {
    this._updateDrawerState(e.target.opened);
  }
}

window.customElements.define('oap-app', OapApp);
