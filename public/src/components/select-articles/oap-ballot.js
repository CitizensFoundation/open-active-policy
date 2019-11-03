import { html } from 'lit-element';
import { OapPageViewElement } from '../oap-page-view-element.js';
import { OapBallotStyles } from './oap-ballot-styles';
import { encryptVote } from '../ballot-encryption-behavior.js'
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { repeat } from 'lit-html/directives/repeat';

import { GetBonusesAndPenaltiesForItem, GetEmojiFromAttitute } from '../oap-bonuses-and-penalties';

import '@polymer/paper-tabs/paper-tab';
import '@polymer/paper-tabs/paper-tabs';
import './oap-article-item';
import { OapFlexLayout } from '../oap-flex-layout';

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

      processedBallotItems: Array,

      wide: Boolean,

      popupWindow: Object,

      favoriteItem: {
        type: Object
      },

      country: Object,

      oldFavoriteItem: Object,

      showMap: Boolean,

      usedBonusesAndPenalties: Object,

      savedVoteId: Number
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
        <div class="tabsContainer">
          <div id="selectedTab" ?selected="${this.selectedView===1}" @click="${()=>{ this.selectTabAndScroll(1)}}" class="tab selectedTab">${this.localize('finalSelection')} ${(this.budgetElement && this.budgetElement.selectedItems) ? html` (${this.budgetElement.selectedItems.length})` : html``}</div>
          <div id="favTab" ?selected="${this.selectedView===0}" @click="${()=>{ this.selectTabAndScroll(0)}}" class="tab favTab">${this.localize('favorite')} ${this.processedBallotItems ? html` (${this.processedBallotItems.length})` : html``}</div>
        </div>

        <div class="topContainer">
          ${(this.processedBallotItems && this.budgetElement) ?
            html`
              <div id="itemContainer" class="itemContainer layout horizontal center-center flex wrap" ?hidden="${this.selectedView===1}">
                ${repeat(this.processedBallotItems, (item) => item.id,  (item, index) =>
                  html`
                    <oap-article-item
                      .name="${item.id}"
                      class="ballotAreaItem"
                      .configFromServer="${this.configFromServer}"
                      .language="${this.language}"
                      .inBudgetSelection="${true}"
                      @goto-selected-id="${this.gotoSelectedId}"
                      .budgetElement="${this.budgetElement}"
                      .ballotElement="${this}"
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
                <div class="headerContainer">
                  <div class="constitutionFor">${this.localize("constitutionFor")}</div>
                  <div class="countryHeader">${this.country.name}</div>
                </div>
                <div id="submitButtonContainer" class="layout horizontal center-center">
                   <paper-button  id="submitButton" raised  ?disabled="${this.submitDisabled}" class="buttton" @click="${()=> { this.fire('oap-submit-ballot') }}">${this.localize("submitConstitution")}</paper-button>
                </div>
                <div class="finalItems">

                </div>
                ${repeat(this.budgetElement.selectedItems, (item) => item.id,  (item, index) => {
                   let headerTemplate = html``;
                    if (index===0 || this.budgetElement.selectedItems[index-1].module_type_index!=item.module_type_index) {
                      headerTemplate = html`
                        <div style="width: 100%;background-color:${this.getModuleColorForItem(item)}" class="flex finalHeader">${this.getModuleTypeName(item.module_content_type)}</div>
                      `;
                    }
                    return html`
                      ${headerTemplate}
                      <oap-article-item
                        .name="${item.id}"
                        class="ballotAreaItem"
                        .configFromServer="${this.configFromServer}"
                        .language="${this.language}"
                        .budgetElement="${this.budgetElement}"
                        .item="${item}">
                      </oap-article-item>
                    `
                  }
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

  getModuleTypeName(module_content_type) {
    return this.localize(module_content_type.toLowerCase().replace('/',''));
  }

  processBallotItems() {
    this.processedBallotItems = [];
    let currentExclusives = [];
    let lastExclusiveSeries = null;
    this.budgetBallotItems.forEach((item)=> {
      if (lastExclusiveSeries && item.exclusive_ids!=lastExclusiveSeries) {
        if (currentExclusives.length>0) {
          const currentCombined = currentExclusives[0];
          const optionItems = currentExclusives.map((item)=>{
            return {id: item.id, name: item.name }
          });
          currentCombined.exclusiveOptions = optionItems;
          this.processedBallotItems.push(currentCombined);
          currentExclusives = [];
          lastExclusiveSeries = null;
        } else {
          console.warn("Unexpected state of lastExclusiveSeries");
        }
      }

      if (item.exclusive_ids) {
        currentExclusives.push(item);
        lastExclusiveSeries = item.exclusive_ids;
      } else {
        this.processedBallotItems.push(item);
      }
    });
  }

  gotoSelectedId(event) {
    this.selectedView = 1;
    setTimeout(()=>{
      this._scrollItemIntoView(event.detail, true);
    }, 150);
  }

  selectTabAndScroll(view) {
    this.selectedView = view;
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  getModuleColorForItem(item) {
    return this.configFromServer.client_config.moduleTypeColorLookup[item.module_content_type];
  }

  choicePointsAtZero() {
    this.selectTabAndScroll(1);
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

    if (changedProps.has('budgetBallotItems') && this.budgetBallotItems) {
      this.processBallotItems();
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
    setTimeout(()=>{
      this._resetSelected();
      setTimeout(()=>{
        this.setStateOfRemainingItems();
      }, 25);
    }, 75);
  }

  disconnectedCallback() {
    this._removeListeners();
  }

  _setupListeners() {
    this.addEventListener("oav-toggle-item-in-budget", this._toggleItemInBudget);
    this.addEventListener("oav-submit-vote", this._postVoteToServer);
    this.addEventListener("oav-item-selected-in-budget", this._itemSelectedInBudget);
    this.addEventListener("oav-item-de-selected-from-budget", this._itemDeSelectedFromBudget);
    this.addEventListener("oap-submit-ballot", this._postVoteToServer);
    this.addEventListener("oap-set-state-of-remaining-items", () => { this.setStateOfRemainingItems()});
  }

  _removeListeners() {
    this.removeEventListener("oav-toggle-item-in-budget", this._toggleItemInBudget);
    this.removeEventListener("oav-submit-vote", this._postVoteToServer);
    this.removeEventListener("oav-item-selected-in-budget", this._itemSelectedInBudget);
    this.removeEventListener("oav-item-de-selected-from-budget", this._itemDeSelectedFromBudget);
    this.removeEventListener("oap-submit-ballot", this._postVoteToServer);
    this.removeEventListener("oap-set-state-of-remaining-items", () => { this.setStateOfRemainingItems()});
  }

  reset() {
    console.error("BALLOT reset");
    if (this.budgetElement) {
      this.budgetElement.reset();
    }
    this._resetBallotItems();
    this.area = {id: 1, name: "Hello"};
    this.favoriteItem = null;
    this.selectedView = 0;
    this.fire('oav-set-area', { areaName: null, totalChoicePoints: null });
    if (!this.usedBonusesAndPenalties)
     this.usedBonusesAndPenalties = {};
  }

  _selectedChanged(event) {
    this.selectedView = parseInt(event.detail.value);
  }

  _scrollItemIntoView(itemId, fromSelectedItems) {
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var isIE11 = /Trident.*rv[ :]*11\./.test(navigator.userAgent);

    let selectorText;
    if (fromSelectedItems) {
      selectorText = "#itemContainerFinal > oap-article-item"
    } else {
      selectorText = "#itemContainer > oap-article-item"
    }

    var items = this.shadowRoot.querySelectorAll(selectorText);
    items.forEach(function (item) {
      if (item.name==itemId) {
        if (iOS || isIE11) {
          item.scrollIntoView(false);
        } else {
          item.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        }

        if (window.innerWidth>600) {
          item.animate([
            { transform: "translateX(-3px)", easing: 'ease-in' },
            { transform: "translateX(3px)", easing: 'ease-out' },
            { transform: "translateX(-5px)", easing: 'ease-in' },
            { transform: "translateX(5px)", easing: 'ease-out' },
            { transform: "translateX(-7px)", easing: 'ease-in' },
            { transform: "translateX(7px)", easing: 'ease-out' },
          ], {
            duration: 400,
            iterations: 2
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

  _toggleItemInBudget(event) {
    this.budgetElement.toggleBudgetItem(event.detail.item);
    const selectedTab = this.$$("#selectedTab");
    const favTab = this.$$("#favTab");
    const color = this.configFromServer.client_config.moduleTypeColorLookup[event.detail.item.module_content_type];
    const originalColor = window.getComputedStyle? window.getComputedStyle(selectedTab, null).getPropertyValue("color") : selectedTab.style.color;
    this.style.setProperty('--oap-active-selection-color', color);
    this.style.setProperty('--oap-active-selection-original-color', originalColor);
    selectedTab.classList.add("selectedTabAnimation");
    setTimeout(()=>{
      selectedTab.classList.remove("selectedTabAnimation");
    }, 1400);

    favTab.classList.add("favOpacityDown");
    setTimeout(()=>{
      favTab.classList.remove("favOpacityDown");
    }, 770);

    var found = this.processedBallotItems.find((item)=> {
      return item.id==event.detail.item.id;
    });
    if (!found) {
      this.processedBallotItems.unshift(event.detail.item);
      this.requestUpdate();
    }
  }

  getItem(itemId) {
    let returnItem;
    for( var i = 0; i < this.budgetBallotItems.length; i++){
      if (this.budgetBallotItems[i].id==itemId) {
        returnItem = this.budgetBallotItems[i];
        break;
      }
    }
    return returnItem;
  }

  swapOutItem(oldItem, newItem) {
    for( var i = 0; i < this.processedBallotItems.length; i++){
      if (this.processedBallotItems[i].id==oldItem.id) {
        /*newItem.hideInnerContainer = true;
        setTimeout(()=>{
          newItem.hideInnerContainer = false;
          newItem.selected = true;
        }, 650);*/
        this.processedBallotItems[i] = newItem;
        //TODO: Get this working without circular problems
        //this.fire('oap-filtered-items-changed', this.processedBallotItems);
        break;
      }
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
        }, 450);
        break;
      }
    }

    setTimeout(()=>{
      this._checkBonusesAndPenalties(item, "select");
    }, 600)
  }

  _resetSelected() {
    var listItems = this.$$("#itemContainer");
    for (var i = 0; i < listItems.children.length; i++) {
      listItems.children[i].selected = null;
    }
  }

  _resetExclusive(itemIds) {
    setTimeout(()=>{
      var listItems = this.$$("#itemContainer");
      for (var i = 0; i < listItems.children.length; i++) {
        var listItem = listItems.children[i];
        if (itemIds.indexOf(listItem.item.id) > -1) {
          listItem.setNotBlockedBy();
       }
      }
    }, 50);
  }

  addToProcessListIfNeeded(itemToAdd) {
    var found = this.processedBallotItems.find((item)=> {
      return item.id==itemToAdd.id;
    });
    if (!found) {
      this.processedBallotItems.unshift(itemToAdd);
      this.requestUpdate();
    }
  }

  removeFromAvailableItems(itemId) {
    for( var i = 0; i < this.processedBallotItems.length; i++){
      if (this.processedBallotItems[i].id==itemId) {
        this.processedBallotItems.splice(i,1);
        console.error("Removed: "+itemId);
         //TODO: Get this working without circular problems
        //this.fire('oap-filtered-items-changed', this.processedBallotItems);
        break;
      }
    }
  }

  _itemDeSelectedFromBudget(event) {
    var listItems = this.$$("#itemContainerFinal");
    let item;
    for (var i = 0; i < listItems.children.length; i++) {
      var listItem = listItems.children[i];
      if (listItem.tagName != 'DIV' && listItem.item.id == event.detail.itemId) {
        if (listItem.item.exclusive_ids) {
          this._resetExclusive(listItem.item.exclusive_ids.split(","));
        }
        listItem.removeFromBudget();
        this.fire("oav-reset-favorite-icon-position");
        break;
      }
    }
    this.requestUpdate();
  }

  _checkBonusesAndPenalties(item, action) {
    const test = "High Authority,High Tradition,High Collective,High Law/Order,Low Science";
    let bonusesAndPenalties = GetBonusesAndPenaltiesForItem(item, this.country).bonusesAndPenalties;
    let totalValue = 0;
    let emojis = [];
    if (bonusesAndPenalties.length>0) {
      let htmlString="";
      bonusesAndPenalties.forEach((item)=>{
        const usedKey = item.id+item.type+item.value+item.attitute+item.level;
        if (!this.usedBonusesAndPenalties[usedKey]) {
          this.usedBonusesAndPenalties[usedKey] = true;
          this.fire('oap-usedBonusesAndPenalties-changed', this.usedBonusesAndPenalties);
          if (item.type==="bonus") {
            this.budgetElement.totalChoicePoints+=item.value;
            let emoji = GetEmojiFromAttitute(item.attitute);
            if (!emojis.indexOf(emoji)>-1) {
              emojis.push(emoji);
            }
            totalValue+=item.value;
          } else if (item.type==="penalty") {
            const pointsWillBeLeft = (this.budgetElement.totalChoicePoints-item.value)-this.budgetElement.usedChoicePoints;
            if (pointsWillBeLeft>=0) {
              this.budgetElement.totalChoicePoints-=item.value;
            } else {
              this.budgetElement.totalChoicePoints-=(item.value+pointsWillBeLeft);
            }
            totalValue-=item.value;
            let emoji = GetEmojiFromAttitute(item.attitute);
            if (!emojis.indexOf(emoji)>-1) {
              emojis.push(emoji);
            }
          }
          htmlString+='<span style="font-size: 17px;">';
          htmlString+='<span '+(item.type=="penalty" ? 'style="color: red;"' : 'style="color: green;"')+'><b>'+this.localize(item.type)+'</b>: '+item.value+" <em>"+this.localize(item.attitute)+"</em> "+'</span><span style="padding-left:1px;padding-bottom:8px;padding-top:8px;">'+GetEmojiFromAttitute(item.attitute)+'</span><br>';
        } else {
          console.warn("Trying to use bonus again: "+usedKey);
        }
      });
      if (htmlString.length>0) {
        if (totalValue!=0) {
          this.fire('oap-open-snackbar', htmlString);
          setTimeout(()=>{
            this.budgetElement.bonusPenalty3dText(totalValue, emojis[0]);
          })
        }
      }
    }
  }

  async setStateOfRemainingItems(startTimeout, inbetweenTimeout) {
    await new Promise(resolve => setTimeout(resolve, startTimeout ? startTimeout: 125 ));
    var choicePointsLeft = this.budgetElement.totalChoicePoints-this.budgetElement.usedChoicePoints;
    var listItems = this.$$("#itemContainer");
    if (listItems) {
      const allSelectedIds = this.budgetElement.selectedItems.map((item) => {
        return item.id;
      });
      for (var i = 0; i < listItems.children.length; i++) {
        await new Promise(resolve => setTimeout(resolve, inbetweenTimeout ? inbetweenTimeout : 5));
        var listItem = listItems.children[i];
        if (!listItem) {
          console.error("NO LIST ITEM");
          this.setStateOfRemainingItems();
        } else {
        if (!listItem.selected) {

          if (listItem.item.exclusive_ids && listItem.item.exclusive_ids.length>0) {
            listItem.item.exclusive_ids.split(",").forEach((id) => {
              const index = allSelectedIds.indexOf(id);
              if (index> -1) {
                listItem.setBlockedBy({name: this.budgetElement.selectedItems[index].name, id: this.budgetElement.selectedItems[index].id});
              } else {
                //listItem.setNotBlockedBy();
              }
            });
          }

          if (listItem.item.price<=choicePointsLeft) {
            listItem.setNotTooExpensive();
          } else {
            listItem.setTooExpensive();
          }
        }
        }
      }
    } else {
      console.warn("Trying to setStateOfItems with no listItems");
    }
  }

  _postVoteToServer() {
    if (this.budgetElement.selectedItems && this.budgetElement.selectedItems.length>0) {
      this.completePostingOfVote(this._createB64Votes());
    } else {
      this.fire('oav-error', this.localize('error_no_items_selected'));
      console.error('error_no_items_selected');
    }
  }

  _createB64Votes() {
    return btoa(encodeURIComponent(JSON.stringify({items: this.budgetElement.selectedItems, country: this.country})).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
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
            this.savedVoteId = response.vote_id;
            this.fire('oap-submit-ballot-for-review', this.savedVoteId);
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
}

window.customElements.define('oap-ballot', OapBallot);
