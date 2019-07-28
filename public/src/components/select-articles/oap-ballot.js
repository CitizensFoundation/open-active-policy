import { html } from 'lit-element';
import { OapPageViewElement } from '../oap-page-view-element.js';
import { OapBallotStyles } from './oap-ballot-styles';
import { encryptVote } from '../ballot-encryption-behavior.js'
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { repeat } from 'lit-html/directives/repeat';

import '@polymer/paper-tabs/paper-tab';
import '@polymer/paper-tabs/paper-tabs';
import './oap-article-item';

class OapBallot extends OapPageViewElement {
  static get properties() {
    return {
      area: {
        type: Object
      },

      areaId: {
        type: String
      },

      configFromServer: String,

      areaIdRoutePath: {
        type: Object
      },

      selectedView: {
        type: Number
      },

      budgetElement: {
        type: Object
      },

      votePublicKey: {
        type: String
      },

      budgetBallotItems: Array,

      wide: Boolean,

      popupWindow: Object,

      favoriteItem: {
        type: Object
      },

      country: Object,

      oldFavoriteItem: Object,

      showMap: Boolean,

      usedBonusesAndPenalties: Object,
    };
  }

  static get styles() {
    return [
      OapBallotStyles
    ];
  }

  render() {
    return html`${this.area ?
      html`
        <div class="topContainer layout vertical">
          <div class="layout horizontal center-center tabsContainer">
            <paper-tabs id="tabs" selected="${this.selectedView}" @selected-changed="${this._selectedChanged}">
              <paper-tab>
                <div>${this.localize('favorite')} ${this.budgetBallotItems ? html` (${this.budgetBallotItems.length})` : html``}</div>
              </paper-tab>
              <paper-tab>
                <div>${this.localize('finalSelection')} ${(this.budgetElement && this.budgetElement.selectedItems) ? html` (${this.budgetElement.selectedItems.length})` : html``}</div>
              </paper-tab>
            </paper-tabs>
          </div>

          ${(this.budgetBallotItems && this.budgetElement) ?
            html`
              <div id="itemContainer" class="itemContainer layout horizontal center-center flex wrap" ?hidden="${this.selectedView===1}">
                ${repeat(this.budgetBallotItems, (item) => item.id,  (item, index) =>
                  html`
                    <oap-article-item
                      .name="${item.id}"
                      class="ballotAreaItem"
                      .configFromServer="${this.configFromServer}"
                      .language="${this.language}"
                      .budgetElement="${this.budgetElement}"
                      .item="${item}">
                    </oap-article-item>
                  `
                )}
              </div>
            `
            :
            ''
          }

          ${(this.budgetElement && this.budgetElement.selectedItems) ?
            html`
              <div id="itemContainerFinal" class="itemContainer layout horizontal center-center flex wrap" ?hidden="${this.selectedView===0}">
                ${repeat(this.budgetElement.selectedItems, (item) => item.id,  (item, index) =>
                  html`
                    <oap-article-item
                      .name="${item.id}"
                      class="ballotAreaItem"
                      .configFromServer="${this.configFromServer}"
                      .language="${this.language}"
                      .budgetElement="${this.budgetElement}"
                      .item="${item}">
                    </oap-article-item>
                  `
                )}
              </div>
            `
            :
            ''
          }

        </div>
      `
      :
      ''
    }
    `
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('areaIdRoutePath')) {
      if (this.areaIdRoutePath) {
        if (this.areaIdRoutePath==='completePostingOfVoteAfterRedirect') {
          this.completeIfAuthenticatedVote();
        } else {
          this.areaId = this.areaIdRoutePath;
        }
      }
    }

    if (changedProps.has('budgetElement')) {
//      this.loadArea();
    }

    if (changedProps.has('favoriteItem')) {
      this.oldFavoriteItem = changedProps.get('favoriteItem');
      if (!this.favoriteItem && this.oldFavoriteItem) {
        this.fire("oav-hide-favorite-item");
      }
    }
  }

  constructor() {
    super();
    this.showMap = false;
    this.area = {name: "Blah", id: 1};
  }

  connectedCallback() {
    super.connectedCallback();
    this.reset();
    window.appBallot = this;
    this.fire('oav-set-ballot-element', this);
  }

  firstUpdated() {
    this._setupListeners();
    installMediaQueryWatcher(`(min-width: 1024px)`,
      (matches) => {
        this.wide = matches;
      });
  }

  disconnectedCallback() {
    this._removeListeners();
  }

  loadArea() {
    this.oldFavoriteItem = null;
    this.favoriteItem = null;
    if (this.areaId) {
      this.reset();
      this.fire('ak-clear-area');
      fetch("/votes/get_ballot?area_id="+this.areaId+"&locale="+this.language, { credentials: 'same-origin' })
      .then(res => res.json())
      .then(response => {
        this.area = response.area;
        this.budgetBallotItems = this._setupLocationsAndTranslation(response.budget_ballot_items);
        this.fire('oav-set-title', this.localize('ballot_area_name', 'area_name', this.area.name));
        this.fire('oav-set-area', { areaName: this.area.name, totalBudget: this.area.budget_amount });
        setTimeout( () => {
          this.$$("#tabs").shadowRoot.getElementById("selectionBar").style.setProperty("border-bottom", "3px solid var(--paper-tabs-selection-bar-color)");
        });
      })
      .catch(error => {
        this.fire('ak-error', error);
        console.error('Error:', error);
      });
    }
  }

  _setupListeners() {
    this.addEventListener("oav-toggle-item-in-budget", this._toggleItemInBudget);
    this.addEventListener("oav-set-favorite-item-in-budget", this._toggleFavoriteItem);
    this.addEventListener("oav-submit-vote", this._postVoteToServer);
    this.addEventListener("oav-item-selected-in-budget", this._itemSelectedInBudget);
    this.addEventListener("oav-item-de-selected-from-budget", this._itemDeSelectedFromBudget);
  }

  _removeListeners() {
    this.removeEventListener("oav-toggle-item-in-budget", this._toggleItemInBudget);
    this.removeEventListener("oav-set-favorite-item-in-budget", this._toggleFavoriteItem);
    this.removeEventListener("oav-submit-vote", this._postVoteToServer);
    this.removeEventListener("oav-item-selected-in-budget", this._itemSelectedInBudget);
    this.removeEventListener("oav-item-de-selected-from-budget", this._itemDeSelectedFromBudget);
  }

  reset() {
    if (this.budgetElement) {
      this.budgetElement.reset();
    }
    this._resetBallotItems();
    this.area = {id: 1, name: "Hello"};
    this.favoriteItem = null;
    this.selectedView = 0;
    this.fire('oav-set-area', { areaName: null, totalBudget: null });
    this.usedBonusesAndPenalties = [];
  }

  _selectedChanged(event) {
    this.selectedView = parseInt(event.detail.value);
  }

  _scrollItemIntoView(itemId) {
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var isIE11 = /Trident.*rv[ :]*11\./.test(navigator.userAgent);

    var items = this.shadowRoot.querySelectorAll("oap-article-item");
    items.forEach(function (item) {
      if (item.name==itemId) {
        if (iOS || isIE11) {
          item.scrollIntoView(false);
        } else {
          item.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        }

        if (this.wide) {
          item.animate([
            { transform: "translateX(-3px)", easing: 'ease-in' },
            { transform: "translateX(3px)", easing: 'ease-out' },
            { transform: "translateX(-5px)", easing: 'ease-in' },
            { transform: "translateX(5px)", easing: 'ease-out' },
            { transform: "translateX(-7px)", easing: 'ease-in' },
            { transform: "translateX(7px)", easing: 'ease-out' },
          ], {
            duration: 450,
            iterations: 1
          });
        }
      }
    }.bind(this));
  }

  _resetBallotItems() {
    var listItems = this.$$("#itemContainer");
    if (listItems) {
      for (var i = 0; i < listItems.children.length; i++) {
        var listItem = listItems.children[i];
        if (listItem.id != 'domRepeat') {
          listItem.setNotTooExpensive();
          listItem.removeFromBudget();
        }
      }
    }
  }

  _toggleFavoriteItem(event) {
    var item = event.detail.item;
    if (item) {
      this.activity('toggle', 'favorite');
    } else {
      this.activity('detoggle', 'favorite');
    }
    if (this.favoriteItem != item) {
      this.favoriteItem = item;
      var listItems = this.$$("#itemContainer");
      for (var i = 0; i < listItems.children.length; i++) {
        var listItem = listItems.children[i];
        if (listItem.id != 'domRepeat') {
          listItem.resetFromBudget();
        }
      }
    } else {
      console.warn("Trying to set item as favorite a second time");
    }
  }

  _toggleItemInBudget(event) {
    this.budgetElement.toggleBudgetItem(event.detail.item);
    var found =  this.budgetBallotItems.find((item)=> {
      return item.id==event.detail.item.id;
    });
    if (!found) {
      this.budgetBallotItems.unshift(event.detail.item);
    }
  }

  _itemSelectedInBudget(event) {
    var listItems = this.$$("#itemContainer");
    let item;
    for (var i = 0; i < listItems.children.length; i++) {
      var listItem = listItems.children[i];
      if (listItem.id != 'domRepeat' && listItem.item.id == event.detail.itemId) {
        listItem.setInBudget();
        const itemId = listItem.item.id;
        item = listItem.item;
        listItem.classList.add("sendToTop");
        setTimeout(() => {
          this.removeFromAvailableItems(itemId);
          this.requestUpdate();
        }, 500);
      }
    }
    this._checkBonusesAndPenalties(item, "select");
    this._setStateOfRemainingItems();
    this.requestUpdate();
  }

  _resetExclusive(itemIds) {
    setTimeout(()=>{
      var listItems = this.$$("#itemContainer");
      for (var i = 0; i < listItems.children.length; i++) {
        var listItem = listItems.children[i];
        if (listItem.id != 'domRepeat' && itemIds.indexOf(listItem.item.id) > -1) {
          listItem.setNotExcluded();
       }
      }
    }, 50);
  }

  removeFromAvailableItems(itemId) {
    for( var i = 0; i < this.budgetBallotItems.length; i++){
      if (this.budgetBallotItems[i].id==itemId) {
        this.budgetBallotItems.splice(i,1);
      }
    }
  }

  _itemDeSelectedFromBudget(event) {
    var listItems = this.$$("#itemContainerFinal");
    let item;
    for (var i = 0; i < listItems.children.length; i++) {
      var listItem = listItems.children[i];
      if (listItem.id != 'domRepeat' && listItem.item.id == event.detail.itemId) {
        if (listItem.item.exclusive_ids) {
          this._resetExclusive(listItem.item.exclusive_ids.split(","));
        }
        listItem.removeFromBudget();
        this.fire("oav-reset-favorite-icon-position");
      }
    }
    this._setStateOfRemainingItems();
    this.requestUpdate();
  }

  _checkBonusesAndPenalties(item, action) {
    const test = "High Authority,High Tradition,High Collective,High Law/Order,Low Science";

    let bonusesRules = item.bonus.split(",");
    bonusesRules = bonusesRules.map((rule) => {
      return rule = rule.toLowerCase().replace("law/order","lawAndOrder").replace("law and order","lawAndOrder").replace("social progress","socialProgress");
    });

    let penaltyRules = item.penalty.split(",");
    penaltyRules = penaltyRules.map((rule) => {
      return rule = rule.toLowerCase().replace("law/order","lawAndOrder").replace("law and order","lawAndOrder").replace("social progress","socialProgress");
    });

    let bonusesAndPenalties = [];

    bonusesRules.forEach((bonus) => {
      const splitBonus = bonus.split(" ");
      const level = splitBonus[0];
      const attitute = splitBonus[1];
      if (level==="bonus") {
      } else if (level==="high") {
        if (this.country.culturalAttitutes[attitute]==2) {
          bonusesAndPenalties.push({id: item.id, type:"bonus", value: 7, attitute: attitute, level: level});
        }
      } else if (level==="medium") {
        if (this.country.culturalAttitutes[attitute]==1) {
          bonusesAndPenalties.push({id: item.id, type:"bonus", value: 5, attitute: attitute, level: level});
        }
      } else if (level==="low") {
        if (this.country.culturalAttitutes[attitute]==0) {
          bonusesAndPenalties.push({id: item.id, type:"bonus", value: 2, attitute: attitute, level: level});
        }
      }
    });

    penaltyRules.forEach((bonus) => {
      const splitBonus = bonus.split(" ");
      const level = splitBonus[0];
      const attitute = splitBonus[1];
      if (level==="bonus") {
      } else if (level==="high") {
        if (this.country.culturalAttitutes[attitute]==2) {
          bonusesAndPenalties.push({id: item.id, type:"penalty", value: 7, attitute: attitute, level: level});
        }
      } else if (level==="medium") {
        if (this.country.culturalAttitutes[attitute]==1) {
          bonusesAndPenalties.push({id: item.id, type:"penalty", value: 5, attitute: attitute, level: level});
        }
      } else if (level==="low") {
        if (this.country.culturalAttitutes[attitute]==0) {
          bonusesAndPenalties.push({id: item.id, type:"penalty", value: 1, attitute: attitute, level: level});
        }
      }
    });

    if (bonusesAndPenalties.length>0) {
      let htmlString="";
      bonusesAndPenalties.forEach((item)=>{
        const usedKey = item.id+item.type+item.value+item.attitute+item.level;
        if (!this.usedBonusesAndPenalties[usedKey]) {
          this.usedBonusesAndPenalties[usedKey] = true;
          if (item.type==="bonus") {
            this.budgetElement.totalBudget+=item.value;
  //          this.fire("oap-set-total-budget", this.budgetElement.totalBudget+=item.value);
          } else if (item.type==="penalty") {
            this.budgetElement.totalBudget-=item.value;
  //          this.fire("oap-set-total-budget", this.budgetElement.totalBudget-=item.value);
          }
          htmlString+='<span style="width: 40px;height: 40px">'+this._getEmojiFromAttitute(item.attitute)
          htmlString+='</span> <b>'+this.localize(item.type)+'</b>: '+item.value+" <em>"+this.localize(item.attitute)+"</em> "+this.localize(item.level)+'<br>';
        } else {
          console.warn("Trying to use bonus again: "+usedKey);
        }
      });
      if (htmlString.length>0) {
        this.fire('oap-open-snackbar', htmlString);
      }
    }

  }

  _getEmojiFromAttitute(attitute) {
    const emojis = {
          authority: "🏛️",
          liberty: "🌅",
          science: "🔬",
          tradition: "🏺",
          collective: "👥",
          independence: "🛡️",
          privacy: "🔐",
          lawAndOrder: "👮",
          socialProgress: "✊",
          naturalResourceWealth: "🔋",
          borderDensity: "🛂",
          hostilityNeighboringCountries: "🌐",
          barrieresToCitizenship: "🧱"
    }
    return emojis[attitute];
  }

  _setStateOfRemainingItems() {
    setTimeout(()=>{
      var budgetLeft = this.budgetElement.totalBudget-this.budgetElement.selectedBudget;
      var listItems = this.$$("#itemContainer");
      const allSelectedIds = this.budgetElement.selectedItems.map((item) => {
        return item.id;
      });
      for (var i = 0; i < listItems.children.length; i++) {
        var listItem = listItems.children[i];
        if (listItem.id != 'domRepeat' && !listItem.selected) {

          if (listItem.item.exclusive_ids && listItem.item.exclusive_ids.length>0) {
            listItem.item.exclusive_ids.split(",").forEach((id) => {
              if (allSelectedIds.indexOf(id) > -1) {
                console.log("excluding: "+listItem.item.id+" for "+listItem.item.exclusive_ids);
                listItem.setExcluded();
              } else {
                //listItem.setNotExcluded();
              }
            });
          }

          if (listItem.item.price<=budgetLeft) {
            listItem.setNotTooExpensive();
          } else {
            listItem.setTooExpensive();
          }
        }
      }
    }, 50);
  }

  _postVoteToServer() {
    if (this.budgetElement.selectedItems && this.budgetElement.selectedItems.length>0) {
      this.completePostingOfVote(this._createEncryptedVotes());
    } else {
      this.fire('oav-error', this.localize('error_no_items_selected'));
      console.error('error_no_items_selected');
    }
  }

  _createEncryptedVotes() {
    var selectedItemIds = this.budgetElement.selectedItems.map((item) => {
      return item.id;
    });
    return encryptVote(this.votePublicKey,
                       { selectedItemIds: selectedItemIds,
                         favoriteItemId: this.favoriteItem ? this.favoriteItem.id : null });
  }

  completePostingOfVote(encryptedVotes) {
    if (this.area && this.area.id) {
      if (encryptedVotes) {
        return fetch('/votes/post_vote', {
          method: "POST",
          cache: "no-cache",
          credentials: 'same-origin',
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ encrypted_vote: encryptedVotes, area_id: this.area.id,  })
        })
        .then(response => response.json())
        .then(response => {
          if (response && response.vote_ok === true) {
            if (this.configFromServer.client_config.insecureEmailLoginEnabled===true) {
              this.fire("oav-insecure-email-login", { areaId: this.area.id, areaName: this.area.name, onLoginFunction: this._setVotingCompleted.bind(this)})
            } else {
              window.location = this._getSamlUrlWithLanguage();
            }
          } else {
            this.fire('oav-error', this.localize('error_could_not_post_vote'));
          }
        })
      } else {
        this.fire('oav-error', this.localize('error_encryption'));
        console.error("No encrypted votes!");
      }
    } else {
      this.fire('oav-error', this.localize('error_could_not_post_vote'));
      console.warn("Not sending as no area id");
    }
  }

  _setVotingCompleted() {
    this.reset();
    this.areaId = null;
    const path = '/voting-completed';
    window.history.pushState({}, null, path);
    this.fire('location-changed', path);

    var dialog = document.querySelector('oap-app').getDialog("authDialog");
    if (dialog)
      dialog.close();
  }

  completeIfAuthenticatedVote() {
    fetch('/votes/is_vote_authenticated', { credentials: 'same-origin' })
    .then(response => response.json())
    .then(response => {
      if (response && response.vote_ok===true) {
        this._setVotingCompleted();
        this.activity('completed', 'voting');
      } else {
        this.fire('oav-error', this.localize('error_could_not_post_vote'));
      }
    })
  }

  _getSamlUrlWithLanguage() {
    var url = this.configFromServer.auth_url;
    if (this.language=='en') {
      url+='&siteLanguage=en';
    } else if (this.language=='pl') {
      url+='&siteLanguage=pl';
    }
    return url;
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  _setupLocationsAndTranslation(budgetBallotItems) {
    var arrayLength = budgetBallotItems.length;
    for (var i = 0; i < arrayLength; i++) {
      if (budgetBallotItems[i].locations && budgetBallotItems[i].locations != "") {
        var hashArray = [];
        var locationsArray = budgetBallotItems[i].locations.replace(' ','').split(',');
        var counter = 0;
        while (counter<locationsArray.length) {
          hashArray.push({ latitude: locationsArray[counter], longitude: locationsArray[counter+1]});
          counter+=2;
        }
        budgetBallotItems[i].locations = hashArray;
      } else {
        budgetBallotItems[i].locations = [];
      }
    }

    return this.shuffle(budgetBallotItems);
  }
}

window.customElements.define('oap-ballot', OapBallot);
