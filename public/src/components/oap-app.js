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
import './select-articles/oap-3d-budget';

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
            <div id="choicePoints" class="choicePoints" ?hidden="${this._page==="area-ballot"}">
              ${this.localize('youHave')} ${this.choicePoints}${this.localize("cp")}
            </div>
            <div ?hidden="${!this.showExit}" class="layout horizontal exitIconInBudget">
              <paper-icon-button class="closeButton" alt="${this.localize('close')}" icon="closeExit" @click="${this._exit}"></paper-icon-button>
            </div>
            <div class="helpIconInBudget">
              <paper-icon-button icon="help-outline" alt="${this.localize('help')}" @click="${this._help}}"></paper-icon-button>
            </div>
            <div class="budgetConstainer layout horizontal center-center" ?hidden="${this.hideBudget}">
              <oap-3d-budget
                id="budget"
                .areaName="${this.areaName}"
                .language="${this.language}"
                .showExit="${this.showExit}"
                .totalBudget="${this.choicePoints}"
                .configFromServer="${this.configFromServer}"
                .currentBallot="${this.currentBallot}">
              </oap-3d-budget>
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

    this.allItems = [
      { id: '1',
    branch: 'Executive Core Articles',
    name: 'Head of State: Empowered President',
    description:
     'An Empowered President, elected directly or indirectly by the entire electorate, meant to personify the will of the people in single individual\'s leadership abilities.',
    module_type: 'Exclusive',
    exlusive_ids: 'e{1,2,3,4}',
    time_period: 'Early Modern',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/Group+10.png',
    price:  20  },
  { id: '2',
    branch: 'Executive Core Articles',
    name: 'Head of State: Prime Minister',
    description:
     'As the head of the Legislative/Parliamentary system, the Prime Minister’s authority arises from the elected representatives choice of a leader amongst themselves. This helps reduce gridlock in government, while also disconnecting the Head of State from the direct will of the electorate.',
    module_type: 'Exclusive',
    exlusive_ids: 'm{1,3},m{1,2,3,4}',
    time_period: 'Early Modern',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/Group1.png',
    price:  20  },
  { id: '3',
    branch: 'Executive Core Articles',
    name: 'Head of State: King',
    description:
     'Historically the center of authority in pre-modern governments, the King\'s authority rests on a traditional architecture of original military conquest, hereditary transitions of power, and usually some notion of Divine Will. Though once always autocratic and ruling through all powerful fiat of their will, many monarchs have ceded power to more democratic and parliamentary governments, becoming largely figureheads of continuity and tradition.',
    module_type: 'Exclusive',
    exlusive_ids: '1,2,3,4',
    time_period: 'Ancient',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/xo.png',
    price:  20  },
  { id: '4',
    branch: 'Executive Core Articles',
    name: 'Head of State: High Priest',
    description:
     'In a proper Theocracy, the central authority rests with the highest authority of the clergy of the religious faith that underpins the government, the spiritual leader of the majority of the population of the country. This authority may function as an interpretive and judicial authority primarily; or it may be an absolute autocratic authority over all structures of government.',
    module_type: 'Exclusive',
    exlusive_ids: '1,2,3,4',
    time_period: 'Ancient',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x17.png',
    price:  20  },
  { id: '5',
    branch: 'Executive Core Articles',
    name: 'Figurehead Executive: Vice President',
    description:
     'Whether elected individually or packaged with a President on a "ticket", the VP gives the electorate the comfort of knowing they have chosen a worthy successor to the President, and a smooth transition of power is guaranteed should something unexpected happen to the chief executive. The VP position is also a valuable political actor for diplomacy and affairs of state.',
    module_type: 'Exclusive',
    exlusive_ids: '5,6',
    time_period: 'Early Modern',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x9.png',
    price:  5  },
  { id: '6',
    branch: 'Executive Core Articles',
    name: 'Figurehead Executive: Figurehead President',
    description:
     'In the case of the Head of State being a Prime Minister, King or Supreme Theocrat, then there might be an executive position called President, that may be appointed or elected, and generally performs public relations for the government, as well as matters of diplomacy and affairs of state.',
    module_type: 'Exclusive',
    exlusive_ids: '5,6',
    time_period: 'Modern/Contemporary',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar13.png',
    price:  5  },
  { id: '7',
    branch: 'Executive Core Articles',
    name: 'Cabinet: Appointed by Head of State',
    description:
     'Sometimes called "to the victor go the spoils" approach, this allows the Executive Head of State to compose a team of cabinet members that they select, insuring a team of like minded individuals likely to work well with the Head of State and each other. Comes with increased risk of cronyism.',
    module_type: 'Exclusive',
    exlusive_ids: '7,8',
    time_period: 'Early Modern',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x7.png',
    price:  5  },
  { id: '8',
    branch: 'Executive Core Articles',
    name: 'Cabinet: Appointed by Legislature/Parliament',
    description:
     'In a Prime Minister\'s cabinet, integrated into the parliamentary process, the factions in the legislative body may also control the staffing of the PM\'s cabinet, again helping the government be as integrated, coherent and internal conflict-free as possible.',
    module_type: 'Exclusive',
    exlusive_ids: '7,8',
    time_period: 'Early Modern',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/Group4.png',
    price:  5  },
  { id: '9',
    branch: 'Executive Amendments',
    name: 'Veto Power',
    description:
     'The ability of the Executive to serve as a check on laws generated by the Legislative/Parliamentary Branch. This gives the Executive a roll of oversight of the law making process, thus giving them the chance to lead from a "bully pulpit" against popular opinion if the new law polls well, or to function as an agent of that public opinion as their elected Executive in stopping an unpopular law.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Early Modern',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/Group+6+(1).png',
    price:  10  },
  { id: '10',
    branch: 'Executive Amendments',
    name: 'Term Limits',
    description:
     'In the case of an Empowered President, this provides for a set number of terms to which the executive may be elected, usually limited to no more than 2 or 3 terms, and usually no more than 4 to 6 years in length.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Modern/Contemporary',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x5.png',
    price:  5  },
  { id: '11',
    branch: 'Executive Amendments',
    name: 'Age Requirement',
    description:
     'Sets a minimum age for the Head of State/chief executive, making life experience a key requirement for service as national leader.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Early Modern',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x10.png',
    price:  5  },
  { id: '12',
    branch: 'Executive Amendments',
    name: 'Meritocracy Requirement',
    description:
     'Sets requirements of achievement for prospective candidates for Head of State, in professional, academic, and political life as qualifications for public service as Head of State. This may involve actual objective testing, or evaluation by a peer review panel.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Futurist',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x11.png',
    price:  5  },
  { id: '13',
    branch: 'Executive Amendments',
    name: 'Conflict of Interest Constraints',
    description:
     'Sets a constitutional prohibition against any business or organizational ties that might pit the Head of State\'s self-interest against the interest of the State.The Head of State must not abrogate their loyalties, and their commitment to the public good must be beyond question.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Modern/Contemporary',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar8.png',
    price:  5  },
  { id: '14',
    branch: 'Executive Amendments',
    name: 'Emoluments Prohibition',
    description:
     'The Head of State must not be allowed to accept gifts from foreign entities who might be trying to use such gifts to sway foreign policy decisions that the Head of State should make without such influence.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Early Modern',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar7.png',
    price:  5  },
  { id: '15',
    branch: 'Executive Amendments',
    name: 'Power of Executive Orders/Royal Decree',
    description:
     'Confers to the Executive branch the authority to issue edicts/executive orders/decrees that function roughly the same as laws passed by the Legislative/Parliamentary Branch, though they generally sunset when the Executive goes through a transition of power.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Ancient',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar5.png',
    price:  10  },
  { id: '16',
    branch: 'Executive Amendments',
    name: 'Religious Authority',
    description:
     'Confers on the Head of State authority over the state religion, and the ability to make decrees that have both religious and legal significance to the society.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Ancient',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar4.png',
    price:  20  },
  { id: '17',
    branch: 'Executive Amendments',
    name: 'Control of Taxation/Budget',
    description:
     'The Branch that has this power makes the ultimate decisions on the government\'s revenue sources, funding allocation and debt and deficit management, the so called "power of the purse."',
    module_type: 'Delegated',
    exlusive_ids: 'E v. L/P',
    time_period: 'Early Modern',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar20.png',
    price:  10  },
  { id: '18',
    branch: 'Executive Amendments',
    name: 'Control of Military',
    description:
     'The Branch with this authority functions as the sole civilian oversight and command of the government\'s defense force and standing army, if any.',
    module_type: 'Delegated',
    exlusive_ids: 'E v. L/P',
    time_period: 'Early Modern',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar2.png',
    price:  10  },
  { id: '19',
    branch: 'Executive Amendments',
    name: 'Control of Diplomacy',
    description:
     'This conveys on the Branch the responsibility of negotiating treaties, appointing ambassadors, maintaining trade relationships and open lines of communication with neighboring countries and international allies alike.',
    module_type: 'Delegated',
    exlusive_ids: 'E v. L/P',
    time_period: 'Early Modern',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar17.png',
    price:  10  },
  { id: '20',
    branch: 'Executive Amendments',
    name: 'Authority to Declare War',
    description:
     'Gives the Branch the sole authority to formally engage in hostilities with another nation state.',
    module_type: 'Delegated',
    exlusive_ids: 'E v. L/P',
    time_period: 'Early Modern',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar16.png',
    price:  10  },
  { id: '21',
    branch: 'Executive Amendments',
    name: 'Authority to Sign/Ratify Treaties',
    description:
     'When the fruits of either war or diplomacy generate a lasting legal document of new relationship between the government and another state or multiple state actors, this confers on the Branch the ultimate authority for confirming these agreements as the law of the land.',
    module_type: 'Delegated',
    exlusive_ids: 'E v. L/P',
    time_period: 'Early Modern',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/Module+image+size+-+864x580+Copy+5.png',
    price:  10  },
  { id: '22',
    branch: 'Executive Amendments',
    name: 'Control of Police Forces',
    description:
     'The government with this institutes a federalized power structure for it police enforcement, and for the oversight of local policing efforts and prosecutorial authority. This delegates which Branch has oversight and executive control over this chain of command.',
    module_type: 'Delegated',
    exlusive_ids: 'E v. J',
    time_period: 'Modern/Contemporary',
    design_area: 'Executive',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x8.png',
    price:  10  },
  { id: '23',
    branch: 'Legislative/ Parliamentary Core Articles',
    name: 'Basic Organization of Parliament/ Legislature: Unicameral',
    description:
     'Creates a Legislature or Parliament with a single house representing the entire electorate, either by region or proportional representation.When this body agrees on something and successfully executes its processes and procedural requirements, the matter being voted on becomes law immediately. This allows the body to be more nimble, and to have a greater appearance of society on a level playing field.',
    module_type: 'Exclusive',
    exlusive_ids: '23,24',
    time_period: 'Modern/Contemporary',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x16.png',
    price:  20  },
  { id: '24',
    branch: 'Legislative/ Parliamentary Core Articles',
    name: 'Basic Organization of Parliament/ Legislature: Bicameral',
    description:
     'Creates two chambers or houses of legislative debate and process, generally one more directly democratic ("lower"), and the other more representative of the entrenched power in the society ("upper"). Laws generated in either house must be reconciled with both bodies, creating oversight and forcing compromise by different interests. This tends to promote stability and durable legislation.',
    module_type: 'Exclusive',
    exlusive_ids: '23,24',
    time_period: 'Modern/Contemporary',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar11.png',
    price:  20  },
  { id: '25',
    branch: 'Legislative/ Parliamentary Core Articles',
    name: 'Representation of Constituents: Proportional Distribution',
    description:
     'The electorate creates the legislative body by voting for candidates and/or parties in a national election, and the proportion of the national vote by party/candidate affiliation determines the balance of power in the legislative body. If no one party achieves a majority, a coalition government of compromise become necessary.',
    module_type: 'Exclusive',
    exlusive_ids: '25,26,27',
    time_period: 'Modern/Contemporary',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x7+copy.png',
    price:  10  },
  { id: '26',
    branch: 'Legislative/ Parliamentary Core Articles',
    name: 'Representation of Constituents: Regional Empowerment',
    description:
     'Each region/province/state/municipality holds elections for its specific representative, that then go to the capital to form a government to decide the national interest.',
    module_type: 'Exclusive',
    exlusive_ids: '25,26,27',
    time_period: 'Ancient',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x13.png',
    price:  20  },
  { id: '27',
    branch: 'Legislative/ Parliamentary Core Articles',
    name: 'Representation of Constituents: Hybrid',
    description:
     'This frames a balance between popular vote and regional representation, usually giving an outsized influence to smaller rural areas with entrenched interests that feel they would be drown out in a straight popular vote.',
    module_type: 'Exclusive',
    exlusive_ids: '25,26,27',
    time_period: 'Early Modern',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar12.png',
    price:  10  },
  { id: '28',
    branch: 'Legislative/ Parliamentary Core Articles',
    name: 'Parliamentary Procedure: Laborious & Byzantine',
    description:
     'This frames the parliamentary procedure for the legislative body or bodies as almost impossibly complex, by layering committees, requiring super majorities, enforcing deliberation periods, barring amendments or revisions to bills, etc. This makes the legal system stable and unreactive, favoring the status quo.',
    module_type: 'Exclusive',
    exlusive_ids: '28,29,30',
    time_period: 'Ancient',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x3.png',
    price:  20  },
  { id: '29',
    branch: 'Legislative/ Parliamentary Core Articles',
    name: 'Parliamentary Procedure: Elaborate & Stringent',
    description:
     'Here we frame what some would think of as the "right" amount of procedural forced debate and ability of a minority party to force compromise or revision in the deliberative process. Reconciling chambers divergent bills, filibuster tactics, while still allowing the function of law making to go on at a reasonable pace.',
    module_type: 'Exclusive',
    exlusive_ids: '28,29.30',
    time_period: 'Early Modern',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar7.png',
    price:  10  },
  { id: '30',
    branch: 'Legislative/ Parliamentary Core Articles',
    name: 'Parliamentary Procedure: Functional & Expedient',
    description:
     'Here we frame the most nimble legislative body, usually unicameral, that has few impediments to swift up and down votes to enact new laws. This makes it very responsive to public opinion if that opinion is represented by the elected officials; unfortunately it does allow for a majority party to rapidly change the legal landscape with little recourse to the minority parties in opposition.',
    module_type: 'Exclusive',
    exlusive_ids: '28,29,30',
    time_period: 'Futurist',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar16.png',
    price:  20  },
  { id: '31',
    branch: 'Legislative/ Parliamentary Core Articles',
    name: 'Entrenchment of Constitution: Very Difficult',
    description:
     'This means it requires multiple very unlikely political conditions to come together to allow for the constitution to be altered in the future. Supermajorities in all chambers, unanimous consent across all branches, majorities among all local and regional political actors, and possibly popular vote referendum for final confirmation. This insures the constitution\'s guarantees of rights and due process cannot be easily stripped; it also means government is less nimble in confronting societal change.',
    module_type: 'Exclusive',
    exlusive_ids: '31,32,33',
    time_period: 'Ancient',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar8.png',
    price:  20  },
  { id: '32',
    branch: 'Legislative/ Parliamentary Core Articles',
    name: 'Entrenchment of Constitution: Difficult',
    description:
     'This frames changing the constitution as high bar, with a supermajority OR regional majorities and/or public referendums. It seeks to find the balance between stable rule of law, and capacity for the law to adapt to a changing society.',
    module_type: 'Exclusive',
    exlusive_ids: '31,32,33',
    time_period: 'Early Modern',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/Group+10.png',
    price:  10  },
  { id: '33',
    branch: 'Legislative/ Parliamentary Core Articles',
    name: 'Entrenchment of Constitution: Expedient',
    description:
     'This frames a constitution that can be modified generally with simple legislative procedure, allowing the framework of the law to evolve with the society in real time, making the government both agile in addressing public opinion, and vulnerable to norms being dismantled by demagogues and autocrats.',
    module_type: 'Exclusive',
    exlusive_ids: '31,32,33',
    time_period: 'Futurist',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/Group+6+(1).png',
    price:  20  },
  { id: '34',
    branch: 'Legislative/ Parliamentary Amendments',
    name: 'No Confidence Vote',
    description:
     'This allows the parliamentary body to call a floor vote on whether or not the body has confidence in its leadership, and generally demands a snap election.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Early Modern',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar13.png',
    price:  5  },
  { id: '35',
    branch: 'Legislative/ Parliamentary Amendments',
    name: 'Quorum Requirements',
    description:
     'This demands that a minimum number of representatives of any given chamber must be present in order for the business of the chamber to proceed. This is meant to force attendance and engaged debate; it also gives members of minority and opposition parties the ability to hijack the process by not showing up to vote.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Early Modern',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x8.png',
    price:  5  },
  { id: '36',
    branch: 'Legislative/ Parliamentary Amendments',
    name: 'Lobbying Constraints',
    description:
     'This codifies in the constitution limits on contributions from private and corporate interests to representatives, and limits on former representatives becoming lobbyists. To be effective in protecting the will of the people from being sold to special interests it must carry stiff penalties for those caught violating these constitutional rules.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Futurist',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x11.png',
    price:  10  },
  { id: '37',
    branch: 'Legislative/ Parliamentary Amendments',
    name: 'Power of Oversight/ Investigation',
    description:
     'This conveys the power to the legislature of review, investigation and oversight of all political activities the Executive and Judicial branches.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Early Modern',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x10.png',
    price:  5  },
  { id: '38',
    branch: 'Legislative/ Parliamentary Amendments',
    name: 'Impeachment Powers',
    description:
     'This frames the Legislative/Parliamentary branch as the authority over Heads of States or members of the Judiciary who have violated laws or norms as set forth in the constitution. Specific parliamentary procedure is laid out, with its own due process; the case for and against the removal of the political actor is made, and a vote that determines their removal or survival.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Early Modern',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x9.png',
    price:  10  },
  { id: '39',
    branch: 'Legislative/ Parliamentary Amendments',
    name: 'Power to Repeal Executive Orders',
    description:
     'Akin to a "reverse veto", this frames the authority of the legislative body or bodies to repeal or reverse the legal and political effects of an Executive Order/Edict/Decree of the Executive Branch.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Early Modern',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x7.png',
    price:  5  },
  { id: '40',
    branch: 'Legislative/ Parliamentary Amendments',
    name: 'Public Access/ Oversight/ Audit',
    description:
     'This frames a constitutional process for the public to review legislative action and question process and methods in law making. Regional and/or municipal bodies will appoint auditors, who will address/enforce any ethical and accounting transgression in full public review.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Modern/Contemporary',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar13.png',
    price:  5  },
  { id: '41',
    branch: 'Legislative/ Parliamentary Amendments',
    name: 'Ombudsman',
    description:
     'This appoints an individual as chief ethics officer for the legislative body, final authority on matters of conduct, propriety and functionality of the parliamentary process.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Early Modern',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x11.png',
    price:  5  },
  { id: '42',
    branch: 'Legislative/ Parliamentary Amendments',
    name: 'Control of Taxation/Budget',
    description:
     'The Branch that has this power makes the ultimate decisions on the government\'s revenue sources, funding allocation and debt and deficit management, the so called "power of the purse."',
    module_type: 'Delegated',
    exlusive_ids: 'E v L/P',
    time_period: 'Early Modern',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/Group+6+(1).png',
    price:  10  },
  { id: '43',
    branch: 'Legislative/ Parliamentary Amendments',
    name: 'Control of Military',
    description:
     'The Branch with this authority functions as the sole civilian oversight and command of the government\'s defense force and standing army, if any.',
    module_type: 'Delegated',
    exlusive_ids: 'E v L/P',
    time_period: 'Early Modern',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar17.png',
    price:  10  },
  { id: '44',
    branch: 'Legislative/ Parliamentary Amendments',
    name: 'Control of Diplomacy',
    description:
     'This conveys on the Branch the responsibility of negotiating treaties, appointing ambassadors, maintaining trade relationships and open lines of communication with neighboring countries and international allies alike.',
    module_type: 'Delegated',
    exlusive_ids: 'E v L/P',
    time_period: 'Early Modern',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar2.png',
    price:  10  },
  { id: '45',
    branch: 'Legislative/ Parliamentary Amendments',
    name: 'Authority to Declare War',
    description:
     'Gives the Branch the sole authority to formally engage in hostilities with another nation state.',
    module_type: 'Delegated',
    exlusive_ids: 'E v L/P',
    time_period: 'Early Modern',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x8.png',
    price:  10  },
  { id: '46',
    branch: 'Legislative/ Parliamentary Amendments',
    name: 'Authority to Sign/Ratify Treaties',
    description:
     'When the fruits of either war or diplomacy generate a lasting legal document of new relationship between the government and another state or multiple state actors, this confers on the Branch the ultimate authority for confirming these agreements as the law of the land.',
    module_type: 'Delegated',
    exlusive_ids: 'E v L/P',
    time_period: 'Early Modern',
    design_area: 'Legislative/Parliamentary',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x13.png',
    price:  10  },
  { id: '47',
    branch: 'Judicial Core Articles',
    name: 'Judicial Authority: Independent Judiciary',
    description:
     'This frames a Judicial Branch that has full equal authority to the Executive and Legislative Branches; it may preside over the rule of law, legislation and executive orders, judging their validity and viability based on constraints of this constitution and traditions of jurisprudence, striking them down if needed.',
    module_type: 'Exclusive',
    exlusive_ids: 'b{48,49}',
    time_period: 'Early Modern',
    design_area: 'Judicial',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x3.png',
    price:  20  },
  { id: '48',
    branch: 'Judicial Core Articles',
    name: 'Judicial Authority: Subordinate Judiciary',
    description:
     'With this framing, the judiciary is subordinate to the Executive and/or Legislative/Parliamentary Branches, performing in an interpretive and advisory capacity, focusing on executing and enforcing the laws.',
    module_type: 'Exclusive',
    exlusive_ids: '48,49',
    time_period: 'Ancient',
    design_area: 'Judicial',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar7.png',
    price:  20  },
  { id: '49',
    branch: 'Judicial Core Articles',
    name: 'Judicial Assignment: Appointed',
    description:
     'Judges are appointed by the Executive, Legislative/Parliamentary or regional authorities. This makes the Judiciary more in synch with the political climate of the government, reducing conflict between branches, increasing risk of political cronyism.',
    module_type: 'Exclusive',
    exlusive_ids: ' 50,51,52',
    time_period: 'Early Modern',
    design_area: 'Judicial',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar17.png',
    price:  20  },
  { id: '50',
    branch: 'Judicial Core Articles',
    name: 'Judicial Assignment: Elected',
    description:
     'Judges are elected directly by the people, meaning they are responsive to variations in public opinion in the electorate, and less beholden to the political makeup of other Branches.',
    module_type: 'Exclusive',
    exlusive_ids: '49',
    time_period: 'Modern/Contemporary',
    design_area: 'Judicial',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/Group1.png',
    price:  20  },
  { id: '51',
    branch: 'Judicial Core Articles',
    name: 'Judicial Assignment: Hybrid',
    description:
     'With this framing, judges come to the bench through a combination of direct election in some strata of the judiciary, and appointment in others, usually arranged in a tiered system that allows regional elected judges to review decisions by appointees, and vice versa.',
    module_type: 'Exclusive',
    exlusive_ids: '49,50',
    time_period: 'Modern/Contemporary',
    design_area: 'Judicial',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/xo.png',
    price:  10  },
  { id: '52',
    branch: 'Judicial Core Articles',
    name: 'Judicial Jurisdiction: Federalized',
    description:
     'This frames a judiciary that is top-down from a central government. If judges are elected, it is in nationwide elections; federal jurisdiction presides over matters down to regional courts.',
    module_type: 'Exclusive',
    exlusive_ids: '53',
    time_period: 'Early Modern',
    design_area: 'Judicial',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x17.png',
    price:  20  },
  { id: '53',
    branch: 'Judicial Core Articles',
    name: 'Judicial Jurisdiction: Regional',
    description:
     'This frames a judiciary that builds its authority from regional courts upward, with precedent decided on the local level, and central courts adjudicating national matters based on consensus ruling among regional top jurists.',
    module_type: 'Exclusive',
    exlusive_ids: '52',
    time_period: 'Early Modern',
    design_area: 'Judicial',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x9.png',
    price:  20  },
  { id: '54',
    branch: 'Judicial Core Articles',
    name: 'Judicial Jurisdiction: Hybrid',
    description:
     'This frames a bifurcated system in which areas of jurisdiction are divided between regional and federal matters, with the courts having a tiered review process in which regional and federal jurists may challenge one another over interpretation and enforcement of the law.',
    module_type: 'Exclusive',
    exlusive_ids: '52,53',
    time_period: 'Modern/Contemporary',
    design_area: 'Judicial',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar13.png',
    price:  10  },
  { id: '55',
    branch: 'Judicial Core Amendments',
    name: 'Habeas Corpus',
    description:
     'Core principle of jurisprudence from the High Middle Ages, this frames the citizens right not to be tried in absentia, that the defendant must be present to arrange for their defense, and confront witnesses brought against them.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Ancient',
    design_area: 'Judicial',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x7.png',
    price:  5  },
  { id: '56',
    branch: 'Judicial Core Amendments',
    name: 'Supreme Court',
    description:
     'This frames the top of the judicial tiered system of courts as the ultimate final arbiter of the rule of law, able to overrule or strike down the legislation and orders/edicts generated by the Executive and Legislative/Parliamentary Branches.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Early Modern',
    design_area: 'Judicial',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/Group4.png',
    price:  10  },
  { id: '57',
    branch: 'Judicial Core Amendments',
    name: 'Universal Legal Standing',
    description:
     'Confers on to all citizens the equal protection and entitlement to due process under the law, regardless of gender, property or class.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Modern/Contemporary',
    design_area: 'Judicial',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/Group+6+(1).png',
    price:  5  },
  { id: '58',
    branch: 'Judicial Core Amendments',
    name: 'Elected Public Prosecutor/ Attorney General',
    description:
     'Constructs the position of the government\'s top law enforcement official as a position directly elected by the people, rather than a political appointee. This gives the electorate the ability to set the tone for enforcement and justice climate of the society.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Futurist',
    design_area: 'Judicial',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x5.png',
    price:  10  },
  { id: '59',
    branch: 'Judicial Core Amendments',
    name: 'Religious Foundation of Jurisprudence',
    description:
     'This ties the constitutions framing of the rule of law to a religious text or creed, with a pre-existing set of legal codes, which become the foundation for jurisprudence for the judiciary of this government. All new laws must build on this framework, or are unconstitutional by this framing.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Ancient',
    design_area: 'Judicial',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x10.png',
    price:  20  },
  { id: '60',
    branch: 'Judicial Core Amendments',
    name: 'Control of Police Forces',
    description:
     'The government with this institutes a federalized power structure for it police enforcement, and for the oversight of local policing efforts and prosecutorial authority. This delegates which Branch has oversight and executive control over this chain of command.',
    module_type: 'Delegated',
    exlusive_ids: '',
    time_period: 'Modern/Contemporary',
    design_area: 'Judicial',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/Group1.png',
    price:  10  },
  { id: '61',
    branch: 'Civil Core Articles',
    name: 'Suffrage: Universal',
    description:
     'Every citizen above a certain age (usually between 17-21) has the right to vote regardless of race, gender, class or property.',
    module_type: 'Exclusive',
    exlusive_ids: '',
    time_period: 'Modern/Contemporary',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/xo.png',
    price:  10  },
  { id: '62',
    branch: 'Civil Core Articles',
    name: 'Suffrage: Land Owners Only',
    description:
     'Frames the electorate as landed property owners only, on the principle that only those paying property tax have "bought in" to the system, creating a class-based limited electorate, usually favoring a status quo.',
    module_type: 'Exclusive',
    exlusive_ids: '',
    time_period: 'Ancient',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x17.png',
    price:  20  },
  { id: '63',
    branch: 'Civil Core Articles',
    name: 'Suffrage: Men Only',
    description:
     'Frames the electorate in terms of a regressive patriarchy, allowing only men to vote.',
    module_type: 'Exclusive',
    exlusive_ids: '',
    time_period: 'Ancient',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x9.png',
    price:  20  },
  { id: '64',
    branch: 'Civil Core Articles',
    name: 'Citizenship: Automatic by Birth',
    description:
     'Frames into the constitution the right of jus sanguinis, or the blood right of birth in place conveying on the individual irrevocable rights of citizenship.',
    module_type: 'Exclusive',
    exlusive_ids: '',
    time_period: 'Ancient',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar13.png',
    price:  10  },
  { id: '65',
    branch: 'Civil Core Articles',
    name: 'Citizenship: Generational/ Ethnic Group Only',
    description:
     'Creates a tiered system of citizenship, requiring multiple generations of immigrant ancestory before full citizenship is conveyed upon the descendent of the original immigrant.',
    module_type: 'Exclusive',
    exlusive_ids: '',
    time_period: 'Modern/Contemporary',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x7.png',
    price:  20  },
  { id: '66',
    branch: 'Civil Core Articles',
    name: 'Citizenship: Rigorous Application Only',
    description:
     'An exclusive meritocratic framing of citizenship that requires all citizens to pass a test to certify their citizenship and attain all rights to voting and legal standing.',
    module_type: '',
    exlusive_ids: '',
    time_period: 'Futurist',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/Group4.png',
    price:  20  },
  { id: '67',
    branch: 'Civil Core Articles',
    name: 'Citizenship: Hybrid',
    description:
     'Creates a more complex constitutional approach to citizenship, with some combination of resident alien, partial citizenship, birthright citizenship and naturalization through meritocratic application in tiers to accommodate as many residents of the nation\'s situations as possible.',
    module_type: 'Exclusive',
    exlusive_ids: '',
    time_period: 'Modern/Contemporary',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/Group+6+(1).png',
    price:  10  },
  { id: '68',
    branch: 'Civil Core Articles',
    name:
     'Balance of Federal/ National Power with Regional/  Local Authority: Federal Autocracy',
    description:
     'Creates a government in which all authority rests with the central state, and all civil legal matters between citizen and government are resolved with this centralized authority.',
    module_type: 'Exclusive',
    exlusive_ids: '',
    time_period: 'Modern/Contemporary',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x5.png',
    price:  20  },
  { id: '69',
    branch: 'Civil Core Articles',
    name:
     'Balance of Federal/ National Power with Regional/  Local Authority: Balance of Federal- Regional States Authority',
    description:
     'Divides authority for resolving civil matters with citizens between a federal authority and regional authority, carving out different areas of jurisdiction for each, with differences between regions allowing for minor variations in design and application of the law, while leaving matters of basic civil rights to federal resolution.',
    module_type: 'Exclusive',
    exlusive_ids: '',
    time_period: 'Early Modern',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x10.png',
    price:  10  },
  { id: '70',
    branch: 'Civil Core Articles',
    name:
     'Balance of Federal/ National Power with Regional/  Local Authority: Regional Autonomy',
    description:
     'Frames a government with a weak central authority whose main focus is on international diplomacy and national defense, without much control or influence over the rule of law on the regional and local level. Presupposes fiercely independent regions bound together by loose coalition of neighbors with differing cultural needs.',
    module_type: 'Exclusive',
    exlusive_ids: '',
    time_period: 'Futurist',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x11.png',
    price:  20  },
  { id: '71',
    branch: 'Civil Amendments',
    name: 'Due Process/ Search & Seizure/ Probable Cause',
    description:
     'Frames the right of the individual not to be searched without a warrant or other legal due process around the concept of "Probable Cause". Meant to protect the citizen from unnecessary harassment by law enforcement.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Early Modern',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar11.png',
    price:  5  },
  { id: '72',
    branch: 'Civil Amendments',
    name: 'Right to Equal Treatment Under the Law',
    description:
     'Confers on the citizen the right of civil equality, which can be enforced against any discrimination based on class, race, gender, orientation or ethnicity by the government or other civil individual or cultural actor.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Modern/Contemporary',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x7+copy.png',
    price:  5  },
  { id: '73',
    branch: 'Civil Amendments',
    name: 'Right to Security',
    description:
     'Frames the government\'s responsibility for the protection of its citizens from outside attack, lawlessness and mayhem. Underpins support for military and police force, but also a fair and just rule of law.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Early Modern',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x13.png',
    price:  5  },
  { id: '74',
    branch: 'Civil Amendments',
    name: 'Right to Bear Arms',
    description:
     'Confers on the citizen the right to protect their own security, and the autonomy of their civil liberties, through the use of lethal force; the balance of self-defense and libertarian detente will vary based on the society governed.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Early Modern',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar12.png',
    price:  10  },
  { id: '75',
    branch: 'Civil Amendments',
    name: 'Right to Privacy',
    description:
     'Confers on the citizen the reasonable expectation that their personal, civil, business and governmental records can only be made public with their consent, and that others may not profit off this information without their consent; easily enforceable 100 years ago, a difficult moving target in the digital age.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Modern/Contemporary',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x3.png',
    price:  10  },
  { id: '76',
    branch: 'Civil Amendments',
    name: 'Rights of Children',
    description:
     'Excluded from the electorate by age, this frames rights for children in the legal process, including most of the following: education, legal standing and due process, safety from bodily harm, adequate medical care.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Modern/Contemporary',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar7.png',
    price:  10  },
  { id: '77',
    branch: 'Civil Amendments',
    name:
     'Ethical Treatment of Animals/ Endangered Species Protections',
    description:
     'Whether viewed as a natural resource or sentient co-citizens without a voice, this frames rights for the animal populations under the jurisdiction of the government.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Futurist',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar16.png',
    price:  20  },
  { id: '78',
    branch: 'Civil Amendments',
    name: 'Right to an Attorney',
    description:
     'Grants the citizen the right to legal representation, whether they can afford it or not, as a matter of due process and civil standing.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Early Modern',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar8.png',
    price:  5  },
  { id: '79',
    branch: 'Civil Amendments',
    name:
     'Prohibition of Retroactive Punishment/ Double Indemnity/ Cruel & Unusual Punishment',
    description:
     'Frames a legal system that cannot try a person for the same crime twice, cannot torture, humiliate or dehumanize prisoners; generally prohibitions against using prisoners for slave labor in current times, prohibition against trying descendents for the crimes of their ancestors.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Early Modern',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/Group+10.png',
    price:  5  },
  { id: '80',
    branch: 'Civil Amendments',
    name: 'Right of Restorative Justice',
    description:
     'Conveys on citizens, whether the perpetrator or victim of a crime, the right of access to a judicial system that allows them to confront the consequences of the crime, attempt to ameliorate the damage done to all parties by that crime, and as much as possible restore the social order that existed before the crime was committed.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Futurist',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/Group+6+(1).png',
    price:  20  },
  { id: '81',
    branch: 'Civil Amendments',
    name: 'Right to Die/ Right of Human Dignity',
    description:
     'Frames the right of every citizen in failing health to negotiate with their medical care a comfortable way to end their lives if they so choose.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Modern/Contemporary',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/rmar13.png',
    price:  5  },
  { id: '82',
    branch: 'Civil Amendments',
    name: 'Right of Non-Citizens to Amnesty',
    description:
     'Constitution recognizes the human rights of non-citizen residents, immigrants or refugees to claim amnesty to remain in the country and begin the process, whether rigorous application or generational naturalization, of becoming a citizen.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Early Modern',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/batch1/x8.png',
    price:  10  },
  { id: '83',
    branch: 'Civil Amendments',
    name:
     'Right to Proportional Share of National Natural Resource Wealth',
    description:
     'Confers on citizens the right to share in any wealth, profit or dividends generated by mineral, agricultural, forestry or animal resources, to be shared through some proportional scheme, on a monthly, quarterly or annual basis.',
    module_type: 'Simple',
    exlusive_ids: '',
    time_period: 'Futurist',
    design_area: 'Civil',
    'Sub Category': '',
    image_url:
     'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/modules/Group+10.png',
    price:  20  }
    ]

    this.soundEffects = {
      oap_short_win_1: {url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/soundsFx/oap_short_win_1.mp3", volume: 1.0},
      oap_new_level_1: {url: "https://open-active-policy-public.s3-eu-west-1.amazonaws.com/make-your-constitution+/soundsFx/oap_new_level_1.mp3", volume: 0.1}
    }

    this.cacheDataImages();
    this.cacheSoundEffects();
    this.filteredItems = this.allItems;
  }

  cacheSoundEffects() {
    if (this.soundEffects) {
      Object.values(this.soundEffects).forEach((effect) => {
        setTimeout( () => {
          const audio = new Audio(effect.url);
        });
      });
    }
  }

  playSoundEffect (event) {
    if (this.soundEffects[event.detail]) {
      const effect = this.soundEffects[event.detail];
      const audio = new Audio(effect.url);
      audio.volume = effect.volume;
      audio.play();
    }
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
    this.fire('oap-play-sound-effect', 'oap_short_win_1');
    this.fire("oap-overlay", {
      html: html`${this.localize("correctAnswer")}`,
      soundEffect: "",
      duration: 300,
    });

    this.choicePoints+=5;
    setTimeout(()=>{
      this.$$("#choicePoints").animate([
        { transform: "scale(1.2)" },
        { transform: "scale(1)" }
      ], {
        duration: 300,
        iterations: 1
      });
    }, 200);
    this.activity('correct', 'quizAnswer');
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
          const path = "/quiz";
          window.history.pushState({}, null, path);
          this.fire('location-changed', path);
        }

        if (this.configFromServer.client_config.welcomeLocales) {
          setTimeout( () => {
            if (!localStorage.getItem("haveClsosedWelcome")) {
              this.$$("#welcomeDialog").open();
            }
          });
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
    this.addEventListener("oap-play-sound-effect", this.playSoundEffect);
  }

  addItemToFinalList(event) {
    if (event.detail) {
      this.filteredItems.push(event.detail);
    } else {
      console.error("Can't find item to add to final list");
    }
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
    this.fire('oap-play-sound-effect', 'oap_new_level_1');
    const path = '/area-ballot/1';
    window.history.pushState({}, null, path);
    this.fire('location-changed', path);
    this.activity('finished', 'filtering');
  }

  quizFinished () {
    this.fire('oap-play-sound-effect', 'oap_new_level_1');
    const path = '/filter-articles';
    window.history.pushState({}, null, path);
    this.fire('location-changed', path);
    this.activity('finished', 'quiz');
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
    this.removeEventListener("oap-play-sound-effect", this.playSoundEffect);
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

      if (page==='area-ballot' && this.filteredItems.length===0) {
        window.history.pushState({}, null, "/quiz");
        this.fire('location-changed', "/quiz");
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

    if (location.pathname==="/") {
      const path = '/quiz';
      window.history.pushState({}, null, path);
      location = { pathname: path };
      this.fire('location-changed', path);
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
