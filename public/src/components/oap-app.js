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
import './select-articles/oap-budget';

//import './browse-articles/oap-swipable-cards';
//import './oav-voting-completed';

import { OapAppStyles } from './oap-app-styles';
import { OapBaseElement } from './oap-base-element.js';
import { OapFlexLayout } from './oap-flex-layout.js';

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

      wideAndBallot: Boolean,

      errorText: String,

      languageOveride: String,

      filteredItems: Array,

      quizQuestions: Array,

      choicePoints: Number
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
        <paper-dialog id="helpDialog">
          <paper-dialog-scrollable>
            <div id="helpContent">
              ${unsafeHTML(this.helpContent)}
            </div>
          </paper-dialog-scrollable>
          <div class="buttons">
            <paper-button class="closeButton generalButton" dialog-dismiss>${this.localize('close')}</paper-button>
          </div>
        </paper-dialog>

        <paper-dialog id="welcomeDialog" with-backdrop>
          <paper-dialog-scrollable>
            <div class="vertical center-center">
              <div class="welcomeLogoContainer center-center">
                <img aria-label="welcome/velkomin" class="welcomeLogo" src="${this.configFromServer.client_config.ballotBudgetLogo}"></img>
              </div>
              <div class="vertical center-center welcomeDialog">
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
                <div class="buttons center-center">
                  <paper-button raised class="continueButton" @click="${this.closeWelcome}" dialog-dismiss autofocus>${this.localize('start')}</paper-button>
                </div>
              </div>
            </div>
          </paper-dialog-scrollable>
        </paper-dialog>

        <app-header fixed effects="waterfall" ?wide-and-ballot="${this.wideAndBallot}" ?hidden="${this._page == 'areas-ballot'}">
          <app-toolbar class="toolbar-top">
            <div class="choicePoints" ?hidden="${this._page==="area-ballot"}">
              ${this.localize('choicePoints')}: ${this.choicePoints}
            </div>
            <div ?hidden="${!this.showExit}" class="layout horizontal exitIconInBudget">
              <paper-icon-button class="closeButton" alt="${this.localize('close')}" icon="closeExit" @click="${this._exit}"></paper-icon-button>
            </div>
            <div class="helpIconInBudget">
              <paper-icon-button icon="help-outline" alt="${this.localize('help')}" @click="${this._help}}"></paper-icon-button>
            </div>
            <div class="budgetConstainer layout horizontal center-center" ?hidden="${this.hideBudget}">
              <oap-budget
                id="budget"
                .areaName="${this.areaName}"
                .language="${this.language}"
                .showExit="${this.showExit}"
                .totalBudget="${this.choicePoints}"
                .configFromServer="${this.configFromServer}"
                .currentBallot="${this.currentBallot}">
              </oap-budget>
            </div>
          </app-toolbar>
          <iron-icon id="favoriteIcon" icon="${this.favoriteIcon}" hidden></iron-icon>
        </app-header>
        <main role="main" class="main-content" ?has-ballot="${this._page == 'area-ballot'}">
          <oap-policy-quiz
            id="quiz"
            .questions="${this.quizQuestions}"
            .configFromServer="${this.configFromServer}"
            .nickname="Robert Bjarnason"
            .language="${this.language}"
            ?hidden="${this._page !== 'quiz'}"
            ?active="${this._page === 'quiz'}">
          </oap-policy-quiz>
          <oap-filter-articles id="filterArticles"
            .language="${this.language}"
            .configFromServer="${this.configFromServer}"
            ?hidden="${this._page !== 'filter-articles'}"
            .allItems="${this.allItems}"
            ?active="${this._page === 'filter-articles'}">
          </oap-filter-articles>
          <oap-article-selection
            .configFromServer="${this.configFromServer}"
            .language="${this.language}"
            ?active="${this._page === 'article-selection'}">
          </oap-article-selection>
          <oap-ballot id="budgetBallot"
            .budgetBallotItems="${this.filteredItems}"
            .configFromServer="${this.configFromServer}"
            .budgetElement="${this.currentBudget}"
            .language="${this.language}"
            ?active="${this._page === 'area-ballot'}">
          </oap-ballot>
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
          You are now ${this._offline ? 'offline' : 'online'}.
        </snack-bar>
      `
      :
      html`${errorDialog}<paper-spinner active class="largeSpinner"></paper-spinner>`
      }
    `;
  }

  constructor() {
    window.__localizationCache = {
      messages: {},
    }
    super();
    setPassiveTouchGestures(true);
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
    this.setDummyData();
  }

  setDummyData() {
    this.choicePoints = 200;
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
    ],

    this.allItems = [
      {
        id: "1",
        branch: "Executive Core Articles",
        name: "Head of State: Empowered President",
        description: "An Empowered President, elected directly or indirectly by the entire electorate, meant to personify the will of the people in single individual's leadership abilities.",
        image_url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/Group+10.png",
        module_type: "Exclusive",
        exclusive_ids: "1,2,3,4",
        price: 8.0
      },
      {
        id: "2",
        branch: "Executive Core Articles",
        name: "Head of State: Prime Minister",
        description: "As the head of the Legislative/Parliamentary system, the Prime Minister’s authority arises from the elected representatives choice of a leader amongst themselves. This helps reduce gridlock in government, while also disconnecting the Head of State from the direct will of the electorate.",
        image_url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/Group1.png",
        module_type: "Exclusive",
        exclusive_ids: "1,2,3,4",
        price: 8.0
      },
      {
        id: "3",
        branch: "Executive Core Articles",
        name: "Head of State: King",
        description: "Historically the center of authority in pre-modern governments, the King's authority rests on a traditional architecture of original military conquest, hereditary transitions of power, and usually some notion of Divine Will or Mandate of Heaven. Though once always autocratic and ruling through all powerful fiat of their will, many monarchs have ceded power to more democratic and parliamentary governments, becoming largely figureheads of continuity and tradition.",
        image_url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/groupe8.png",
        module_type: "Exclusive",
        exclusive_ids: "1,2,3,4",
        price: 8.0
      },
      {
        id: "4",
        branch: "Executive Core Articles",
        name: "Head of State: High Priest",
        description: "In a proper Theocracy, the central authority rests with the highest authority of the clergy of the religious faith that underpins the government, the spiritual leader of the majority of the population of the country. This authority may function as an interpretive and judicial authority primarily; or it may be an absolute autocratic authority over all structures of government.",
        image_url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/Group2.png",
        module_type: "Exclusive",
        exclusive_ids: "1,2,3,4",
        price: 18.0
      },
      {
        id: "5",
        branch: "Executive Core Articles",
        name: "Figurehead Executive: Vice President",
        description: 'Whether elected individually or packaged with a President on a "ticket", the VP gives the electorate the comfort of knowing they have chosen a worthy successor to the President, and a smooth transition of power is guaranteed should something unexpected happen to the chief executive. The VP position is also a valuable political actor for diplomacy and affairs of state.',
        image_url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/groupe6.png",
        module_type: "Exclusive",
        exclusive_ids: "1,2,3,4",
        price: 18.0
      },
      {
        id: "6",
        branch: "Executive Core Articles",
        name: "Figurehead Executive: Figurehead President",
        description: "In the case of the Head of State being a Prime Minister, King or Supreme Theocrat, then there might be an executive position called President, that may be appointed or elected, and generally performs public relations for the government, as well as matters of diplomacy and affairs of state.",
        image_url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/Group3.png",
        module_type: "Exclusive",
        exclusive_ids: "1,2,3,4",
        price: 8.0
      },
      {
        id: "7",
        branch: "Executive Core Articles",
        name: "Cabinet: Appointed by Head of State",
        description: 'Sometimes called "to the victor go the spoils" approach, this allows the Executive Head of State to compose a team of cabinet members that they select, insuring a team of like minded individuals likely to work well with the Head of State and each other. Comes with increased risk of croneyism.',
        image_url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/Module+image+size+-+864x580+Copy+4.png",
        module_type: "Exclusive",
        exclusive_ids: "1,2,3,4",
        price: 18.0
      },
      {
        id: "8",
        branch: "Executive Core Articles",
        name: "Cabinet: Appointed by Legislature/Parliament",
        description: "In a Prime Minister's cabinet, integrated into the parliamentary process, the factions in the legislative body may also control the staffing of the PM's cabinet, again helping the government be as integrated, coherent and internal conflict-free as possible.",
        image_url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/Group4.png",
        module_type: "Exclusive",
        exclusive_ids: "1,2,3,4",
        price: 8.0
      },
      {
        id: "9",
        branch: "Executive Amendments",
        name: "Veto Power",
        description: 'The ability of the Executive to serve as a check on laws generated by the Legislative/Parliamentary Branch. This gives the Executive a roll of oversight of the law making process, thus giving them the chance to lead from a "bully pulpit" against popular opinion if the new law polls well, or to function as an agent of that public opinion as their elected Executive in stopping an unpopular law.',
        image_url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/Group7.png",
        module_type: "Simple",
        exclusive_ids: "",
        price: 24.0
      },
      {
        id: "10",
        branch: "Executive Amendments",
        name: "Term Limits",
        description: "In the case of an Empowered President, this provides for a set number of terms to which the executive may be elected, usually limited to no more than 2 or 3 terms, and usually no more than 4 to 6 years in length.",
        image_url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/Group9.png",
        module_type: "Simple",
        exclusive_ids: "",
        price: 24.0
      },
      {
        id: "11",
        branch: "Executive Amendments",
        name: "Age Requirement",
        description: "Sets a minimum age for the Head of State/chief executive, making life experience a key requirement for service as national leader.",
        image_url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/quiz/shortestConst1.png",
        module_type: "Simple",
        exclusive_ids: "",
        price: 4.0
      },
      {
        id: "12",
        branch: "Executive Amendments",
        name: "Meritocracy Requirement",
        description: "Sets requirements of acheivement for prospective candidates for Head of State, in professional, academic, and political life as qualifications for public service as Head of State. This may involve actual objective testing, or evaluation by a peer review panel.",
        image_url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/quiz/shortestConst1.png",
        module_type: "Simple",
        exclusive_ids: "",
        price: 4.0
      },
      {
        id: "13",
        branch: "Executive Amendments",
        name: "Conflict of Interest Constraints",
        description: "Sets a constitutional prohibition against any business or organizational ties that might pit the Head of State's self-interest against the interest of the State.The Head of State must not abrogate their loyalties, and their commitment to the public good must be beyond question.",
        image_url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/quiz/shortestConst1.png",
        module_type: "Simple",
        exclusive_ids: "",
        price: 4.0
      },
      {
        id: "14",
        branch: "Executive Amendments",
        name: "Emoluments Prohibition",
        description: "The Head of State must not be allowed to accept gifts from foreign entities who might be trying to use such gifts to sway foreign policy decisions that the Head of State should make without such influence.",
        image_url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/quiz/shortestConst1.png",
        module_type: "Simple",
        exclusive_ids: "",
        price: 4.0
      },
      {
        id: "15",
        branch: "Executive Amendments",
        name: "Power of Executive Orders/Royal Decree",
        description: "Confers to the Executive branch the authority to issue edicts/executive orders/decrees that function roughly the same as laws passed by the Legislative/Paliamentary Branch, though they generally sunset when the Executive goes through a transition of power.",
        image_url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/quiz/shortestConst1.png",
        module_type: "Simple",
        exclusive_ids: "",
        price: 4.0
      },
      {
        id: "16",
        branch: "Executive Amendments",
        name: "Religious Authority",
        description: "Confers on the Head of State authority over the state religion, and the ability to make decrees that have both religious and legal significance to the society.",
        image_url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/quiz/shortestConst1.png",
        module_type: "Simple",
        exclusive_ids: "",
        price: 4.0
      },
      {
        id: "17",
        branch: "Executive Amendments",
        name: "Control of Taxation/Budget",
        description: "The Branch that has this power makes the ultimate decisions on the government's revenue sources, funding allocation and debt and deficit management, the so called 'power of the purse'.",
        image_url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/quiz/shortestConst1.png",
        module_type: "Simple",
        exclusive_ids: "",
        price: 4.0
      }
    ]
    this.cacheDataImages();
    this.filteredItems = this.allItems;
  }

  cacheDataImages() {
    if (this.quizQuestions) {
      this.quizQuestions.forEach((question) => {
        setTimeout( () => {
          const img = new Image();
          img.src=question.imageUrl;
        });
      });
    }
    if (this.allItems) {
      this.allItems.forEach((module) => {
        setTimeout( () => {
          const img = new Image();
          img.src=module.image_url;
        });
      });
    }
  }

  processCorrectQuizAnswer() {
    this.fire("oap-overlay", {
      html: html`${this.localize("correctAnswer")}`,
      soundEffect: "",
      duration: 300,
    });

    this.choicePoints+=15;
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

        if (false && !(location.href.indexOf("completePostingOfVoteAfterRedirect") > -1)) {
          const path = "/area-ballot/"+this.oneBallotId;
          window.history.pushState({}, null, path);
          this.fire('location-changed', path);

          if (this.configFromServer.client_config.welcomeLocales) {
            setTimeout( () => {
              if (!localStorage.getItem("haveClsosedWelcome")) {
                this.$$("#welcomeDialog").open();
              }
            });
          }
        }

        window.language = this.language;
        window.localize = this.localize;

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
    this.addEventListener("oav-reset-favorite-icon-position", this.resetFavoriteIconPosition);
    this.addEventListener("oav-exit", this._exit);
    this.addEventListener("oav-open-help", this._help);
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
  }

  addItemToFinalList(event) {
    this.filteredItems.push(event.detail);
  }

  _setBallotElement(event) {
    this.currentBallot = event.detail;
  }

  _setBudgetElement(event) {
    setTimeout(()=> {
      this.currentBudget = event.detail;
    }, 100);
  }

  filteringFinished () {
    const path = '/area-ballot/1';
    window.history.pushState({}, null, path);
    this.fire('location-changed', path);
  }

  quizFinished () {
    const path = '/filter-articles';
    window.history.pushState({}, null, path);
    this.fire('location-changed', path);
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
    this.removeEventListener("oav-reset-favorite-icon-position", this.resetFavoriteIconPosition);
    this.removeEventListener("oav-exit", this._exit);
    this.removeEventListener("oav-set-ballot-element", this._setBallotElement);
    this.removeEventListener("oav-set-budget-element", this._setBudgetElement);
    this.removeEventListener("oav-open-help", this._help);
    this.removeEventListener("oav-scroll-item-into-view", this._scrollItemIntoView);
    window.removeEventListener("resize", this.resetSizeWithDelay);
    this.removeEventListener("oav-insecure-email-login", this._insecureEmailLogin);
    this.removeEventListener("oap-process-correct-quiz-answer", this.processCorrectQuizAnswer);
    this.removeEventListener("oap-quiz-finished", this.quizFinished);
    this.removeEventListener("item-selected", this.addItemToFinalList);
    this.removeEventListener("oap-filtering-finished", this.filteringFinished);
  }

  _scrollItemIntoView(event) {
    this.$$("#budgetBallot")._scrollItemIntoView(event.detail);
  }

  _hideFavoriteItem() {
    this.$$("#favoriteIcon").hidden = true;
  }

  _insecureEmailLogin(event) {
    this.$$("#insecureEmailLogin").open(event.detail.areaId, event.detail.areaName, event.detail.onLoginFunction);
  }

  _toggleFavoriteItem(event) {
    const detail = event.detail;

    if (detail.item) {
      setTimeout(() => {
        var transformLeft, transformTop;

        if (this.$$("#favoriteIcon").hidden===true) {
          this.$$("#favoriteIcon").style.position = "absolute";
          this.$$("#favoriteIcon").style.left = detail.orgAnimPos.left+"px";
          this.$$("#favoriteIcon").style.top = detail.orgAnimPos.top+"px";

          transformLeft = detail.orgAnimPos.left-detail.budgetAnimPos.left;
          transformTop = detail.orgAnimPos.top-detail.budgetAnimPos.top;
        } else {
          var oldBudgetAnimPos = this.currentBallot.oldFavoriteItem ? this.ballotElement.getItemLeftTop(this.currentBallot.oldFavoriteItem) : null;
          if (oldBudgetAnimPos) {
            transformLeft = oldBudgetAnimPos.left-detail.budgetAnimPos.left;
            transformTop = oldBudgetAnimPos.top-detail.budgetAnimPos.top;
          } else {
            console.warn("Can't find old item");
            transformLeft = detail.orgAnimPos.left-detail.budgetAnimPos.left;
            transformTop = detail.orgAnimPos.top-detail.budgetAnimPos.top;
          }
        }

        this.$$("#favoriteIcon").hidden = false;

        this.$$("#favoriteIcon").style.position = "absolute";
        this.$$("#favoriteIcon").style.left = detail.budgetAnimPos.left+"px";
        this.$$("#favoriteIcon").style.top = detail.budgetAnimPos.top+"px";
        var animation = this.$$("#favoriteIcon").animate([
          {
            transform: "translateY("+transformTop+"px) translateX("+transformLeft+"px)",
            easing: 'ease-out'
          },
          { transform: "scale(3)",  easing: 'ease-in' },
          { transform: "scale(1)", easing: 'ease-out' }
        ], {
          duration: 720,
          iterations: 1
        });

        animation.onfinish = function () {
          this.$$("#favoriteIcon").style.position = "absolute";
          this.$$("#favoriteIcon").style.left = detail.budgetAnimPos.left+"px";
          this.$$("#favoriteIcon").style.top = detail.budgetAnimPos.top+"px";
        }.bind(this);
      });
    }
  }

  resetFavoriteIconPosition() {
    if (this.$$("#budgetBallot").favoriteItem) {
      const pos = this.$$("#budget").getItemLeftTop(this.$$("#budgetBallot").favoriteItem);
      if (pos) {
        this.$$("#favoriteIcon").style.left = pos.left+"px";
        this.$$("#favoriteIcon").style.top = pos.top+"px";
      } else {
        console.error("Can't find position of favorite item");
      }
    }
  }

  _help() {
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
      this.resetFavoriteIconPosition();
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
    localStorage.setItem("haveClosedWelcome", true);
  }

  getDialog(name) {
    return this.$$("#"+name);
  }

  firstUpdated() {
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
    this.helpContent = this.getHelpContent();
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

  updated(changedProps) {
    if (changedProps.has('language')) {
      this.setupLocaleTexts();
    }

    if (changedProps.has('budgetElement')) {
      debugger;
    }

    if (changedProps.has('_page')) {
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

      // Refresh list when returning back to a ballot
      if (page=='area-ballot' && this.$$("#budgetBallot") && this.$$("#budgetBallot").refreshList) {
        this.$$("#budgetBallot").refreshList();
      }

      // Reset ballot tab view to list
      if (oldPage=='area-ballot' && this.$$("#budgetBallot") && page!='post') {
        this.$$("#budgetBallot").selectedView = 0;
      }

      // Cancel login polling if needed
      if (oldPage=='area-ballot' && this.$$("#budgetBallot")) {
        this._hideFavoriteItem();
      }

      setTimeout(() => {
        if (page=='area-ballot' && this.currentBallot && this.currentBallot.favoriteItem) {
          this.$$("#favoriteIcon").hidden = false;
          this.resetFavoriteIconPosition();
        }
      });

      // Do not allow access to voting-completed from a reload
      if (page=='voting-completed' && oldPage!='area-ballot') {
        window.location = "/";
      }

      // Refresh counts if coming from voting-completed
      if (oldPage=='voting-completed' && this.$$("#selectVotingArea")) {
        this.$$("#selectVotingArea").refreshAreaCounters();
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

    clearTimeout(this.__snackbarTimer);
    this._snackbarOpened = true;
    this.__snackbarTimer = setTimeout(() => { this._snackbarOpened = false }, 3000);
  }

  _locationChanged(location) {
    if (location instanceof CustomEvent)
      location = { pathname: location.detail };

    if (location.pathname==="/" && this.oneBallotId) {
      const path = '/area-ballot/'+this.oneBallotId;
      window.history.pushState({}, null, path);
      location = { pathname: path };
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
      case 'quiz':
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
