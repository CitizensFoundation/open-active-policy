/**
@license
Copyright (c) 2010-2019 Citizens Foundation
*/

import { html } from 'lit-element';
import { OapArticleItemStyles } from './oap-article-item-styles.js';
import { OapBaseElement } from '../oap-base-element';
import { OapShadowStyles } from '../oap-shadow-styles';
import '../oap-icons.js';
import '@polymer/iron-image';
import '@polymer/paper-menu-button';
import '@polymer/paper-icon-button';
import '@polymer/paper-listbox';
import '@polymer/paper-item';
import '@polymer/paper-fab';
import 'paper-share-button';
import { OapFlexLayout } from '../oap-flex-layout.js';

class OapArticleItem extends OapBaseElement {
  static get properties() {
    return {
      item: {
        type: Object
      },

      elevation: Number,

      selected: Boolean,

      ballotElement: {
        type: Object
      },

      selectedInBudget: {
        type: Boolean
      },

      hideClose: Boolean,

      isBookmarked: {
        type: Boolean
      },

      toExpensive: {
        type: Boolean
      },

      isExcluded: {
        type: Boolean
      },

      isBlockedBy: {
        type: Object
      },

      isFavorite: {
        type: Boolean
      },

      browsingMode: {
        type: Boolean
      },

      imageTabSelected: {
        type: Boolean
      },

      descriptionTabSelected: {
        type: Boolean
      },

      descriptionPdfLink: {
        type: String
      },

      small: {
        type: Boolean
      },

      tiny: {
        type: Boolean
      },

      imageLoaded: {
        type: Boolean,
        value: false
      },

      inBudgetSelection: Boolean,

      configFromServer: Object,

      listBoxSelection: Number,

      selectedExclusiveId: String,

      onlyDisplay: Boolean
    };
  }

  static get styles() {
    return [
      OapArticleItemStyles,
      OapShadowStyles,
      OapFlexLayout
    ];
  }

  getName() {
    if (this.item.exclusiveOptions) {
      return this.item.name.split(": ")[0];
    } else {
      return this.item.name;
    }
  }

  render() {
    return html`
      <div id="topContainer"
           ?module-type="${this.item.module_type=="ModuleTypeCard"}"
           class="itemContent shadow-animation shadow-elevation-3dp layout horizontal"
           ?inbudget="${this.selected}" ?blocked-by="${this.isBlockedBy}">
        <div id="opacityLayer"></div>
        <div id="innerContainer" ?hidden="${this.item.hideInnerContainer}">
          <div id="leftColor" class="leftColor" ?hidden="${this.selected}"></div>
          <div class="layout-inline vertical">
            <div class="layout horizontal">
              <div class="image" ?hidden="${!this.selected}"><img class="cardImage" src="${this.item.image_url}"/></div>
            </div>
            <div class="name"
              ?exclusive-active="${this.item.exclusiveOptions && !this.selectedExclusiveId}"
              ?module-type="${this.item.module_type=="ModuleTypeCard"}"
              ?in-budget-selection="${this.inBudgetSelection}"
              @click="${this.topClick}"
              ?inbudget="${this.selected}">
              ${this.getName()}
            </div>
            <div class="exclusiveName" ?hidden="${this.selected || !this.selectedExclusiveId}">${this.item.name.split(": ")[1]}</div>
            <div class="layout-inline vertical" ?hidden="${this.item.module_type=="ModuleTypeCard"}">
              <div class="description" ?hidden="${!this.selected}">${this.item.description}</div>
              <div class="buttons" ?hidden="${!this.onlyDisplay===true}">
                <div id="closeButton" ?hidden="${this.hideClose}" class="shadow-animation shadow-elevation-2dp" @click="${()=>{this.fire("oap-close-master-dialog")}}" title="${this.localize('close')}">
                   ${this.localize("close")}
                </div>
              </div>
              <div class="buttons" ?hidden="${(this.item.exclusive_ids && !this.selectedExclusiveId) || this.onlyDisplay===true}">
                <div id="addToBudgetButton" class="shadow-animation shadow-elevation-2dp addRemoveButton"
                          ?hidden="${this.selected}"
                          ?exclusive-active="${this.item.exclusiveOptions}"
                          ?exclusive-selected="${this.selectedExclusiveId}"
                          ?disabled="${this.toExpensive || this.isExcluded}" title="${this.localize('add_to_budget')}" icon="add" @click="${this._toggleInBudget}">
                  <div class="priceText">+${this.item.price}</div>
                </div>
                <div raised elevation="5" class="addRemoveButton removeButton shadow-animation  shadow-elevation-4dp" ?hidden="${!this.selected}"
                          title="${this.localize('remove_from_budget')}" icon="remove" @click="${this._toggleInBudget}">
                  <div class="priceText">-${this.item.price}</div>
                </div>
              </div>
              ${(this.item.exclusiveOptions && !this.selectedExclusiveId && !this.selected) ? html`
                <paper-menu-button @tap="${this._openMenu}" class="editExclusiveMenuButton" horizontal-align="right">
                  <paper-icon-button id="editExclusiveOptions" class="shadow-animation shadow-elevation-2dp  dropdown-trigger  editExclusiveButton" slot="dropdown-trigger" @click="${this._clickedDropDownMenu}" alt="${this.localize('openDetailMenu')}" icon="menu"></paper-icon-button>
                  <paper-listbox class="dropdown-content" slot="dropdown-content" id="listBox" @click="${this.noClick}" @selected-changed="${this.selectedExclusiveChanged}">
                    ${this.item.exclusiveOptions.map((item)=>{
                      return html`
                        <paper-item data-id="${item.id}" @click="${this.noClick}">
                          ${item.name.split(": ")[1]}
                        </paper-item>
                      `
                    })}
                  </paper-listbox>
                </paper-menu-button>
              ` : ''}
            </div>
            <div class="subCategory" hidden ?inbudget="${this.selected}" ?blockedBy="${this.isBlockedBy}">${this.item.sub_category}</div>
          </div>
        </div>
        <div id="isBlockedByInfo" ?hidden="${!this.isBlockedBy}">
          ${this.isBlockedBy ? html`
            ${this.localize("blockedBy")} ${this.isBlockedBy.name}
          ` : ''}
        </div>
      </div>
    `;
  }

  noClick(event) {
    event.preventDefault();
  }

  selectedExclusiveChanged(event) {
    if (event.detail.value!==null) {
      this.selectedExclusiveId = this.item.exclusiveOptions[event.detail.value].id;
      if (this.item.id!=this.selectedExclusiveId) {
        this.oldElementNeedsSwapping = this.item;
        this.item = this.ballotElement.getItem(this.selectedExclusiveId);
        this.item.selectedExclusiveId = this.selectedExclusiveId;
        this.item.exclusiveOptions = this.oldElementNeedsSwapping.exclusiveOptions;
      }
      if (this.oldElementNeedsSwapping) {
        this.ballotElement.swapOutItem(this.oldElementNeedsSwapping, this.item);
        this.oldElementNeedsSwapping=null;
      }
      this.fire('oap-set-state-of-remaining-items');
    }
  }

  topClick(event) {
    if (event.target.localName!="paper-item") {
      if ((!this.item.exclusiveOptions || this.selectedExclusiveId) && !this.selected && this.item.module_type!="ModuleTypeCard") {
        this.fire('oap-open-article-item', this.item);
      }
    }
  }

  exclusiveNumberOf() {
    if (this.item.exclusive_ids) {
      const ids = this.item.exclusive_ids.split(',');
      let current;

      ids.forEach((id, index)=>{
        if (this.item.id==id) {
          current = index+1;
        }
      })

      return "("+current+"/"+ids.length+")";
    } else {
      return "";
    }
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('selected')) {
      if (this.selected) {
        this.elevation = 4;
        this.$$("#topContainer").classList.add("shadow-elevation-12dp")
      } else {
        this.elevation = 1;
        this.$$("#topContainer").classList.remove("shadow-elevation-12dp")
      }
    }

    if (changedProps.has('item')) {
      if (this.item) {
        if (this.item.exclusiveOptions && this.item.exclusiveOptions.length==1) {
          this.selectedExclusiveId = this.item.id;
        }

        if (this.item.selectedExclusiveId) {
          this.selectedExclusiveId = this.item.selectedExclusiveId;
        }

        if (!this.onlyDisplay)
          this.resetFromBudget();

        if (this.item.module_type=="ModuleTypeCard") {
          const color = this.configFromServer.client_config.moduleTypeColorLookup[this.item.module_content_type];

          this.$$("#topContainer").style.backgroundColor=color;
          this.$$("#topContainer").style.color="#FFF";
        }
      }
    }

    if (changedProps.has('small')) {
      if (this.small) {
        this.mapsHeight = '260';
        this.mapsWidth = '146';
      } else {
        this.mapsHeight = '169';
        this.mapsWidth = '300';
      }
    }

    if (changedProps.has('tiny')) {
      if (this.tiny) {
        this.mapsHeight = '220';
        this.mapsWidth = '124';
      } else {
        this.mapsHeight = '169';
        this.mapsWidth = '300';
      }
    }
  }

  constructor() {
    super();
    this.reset();
    this.listBoxSelection = null;
    this.inBudgetSelection = false;
  }

  reset() {
    this.small = false;
    this.descriptionTabSelected = false;
    this.imageTabSelected = true;
    this.isFavorite = false;
    this.toExpensive = false;
    this.isBookmarked = false;
    this.selected = false;
    this.isExcluded = false;
    this.isBlockedBy = null;
    this.oldElementNeedsSwapping=null;
    this.selectedExclusiveId = null;
  }

  _imageLoadedChanged(event) {
    if (event.detail.value) {
      this.imageLoaded = true;
    }
  }

  _clickedDropDownMenu(event) {
    event.preventDefault();
    this.activity('click', 'exclusiveDropdown');
  }

  _costIsOne(cost) {
    if (cost && cost<=1.0) {
      return true;
    } else {
      return false;
    }
  }

  _openPdf() {
    this.activity('click', 'openPdf');
    if (this.item.descriptionPdfLink) {
      window.open(this.item.descriptionPdfLink, '_blank');
    }
  }

  _showPost() {
    this.activity('click', 'showPost');
    window.appLastArea = '/'+window.location.hash;
    const path = "/post/"+this.item.idea_id;
    window.history.pushState({}, null, path);
    this.fire('location-changed', path);
    setTimeout( () => {
      this.$$("#listBox").select(0);
    });
  }

  _itemShareUrl() {
    if (this.item) {
      return encodeURIComponent("https://"+window.location.host+"/items/"+this.item.id);
    } else {
      return null;
    }
  }

  _shareTap(event, detail) {
    this.activity('click', 'shareItem');
  }

  resetFromBudget() {
    //console.log("resetFromBudget itemId: "+this.item.id);
    const color = this.configFromServer.client_config.moduleTypeColorLookup[this.item.module_content_type];

    this.$$("#leftColor").style.backgroundColor=color;
    if (!this.isExcluded && !this.isBlockedBy) {
      this.$$("#addToBudgetButton").style.backgroundColor=color;
      if (this.$$("#editExclusiveOptions")) {
        this.$$("#editExclusiveOptions").style.backgroundColor="#FFF";
        this.$$("#editExclusiveOptions").style.color=color;
      }
    }

    if (this.budgetElement) {
      if (this.budgetElement.selectedItems.indexOf(this.item) > -1) {
        this.setInBudget();
        this.setNotTooExpensive();
        if (this.budgetElement.currentBallot.favoriteItem==this.item) {
          this.isFavorite = true;
        } else {
          this.isFavorite = false;
        }
      } else {
        var budgetLeft = this.budgetElement.totalBudget-this.budgetElement.selectedBudget;
        if (this.item.cost>budgetLeft) {
          this.setTooExpensive()
        } else {
          this.setNotTooExpensive()
        }
        this.removeFromBudget();
      }
      if (this.item.exclusive_ids && this.item.exclusive_ids.length>0) {
        const allSelectedIds = this.budgetElement.selectedItems.map((item) => {
          return item.id;
        });
        this.item.exclusive_ids.split(",").forEach((id) => {
          if (allSelectedIds.indexOf(id) > -1) {
            this.setBlockedBy({name: this.item.name, id: this.item.id });
          } else {
            this.setNotBlockedBy();
          }
        });
      }
    }
    this._setImageMode(true);
  }

  _setImageMode(disableActivity) {
    if (!disableActivity || disableActivity===false) {
      this.activity('select', 'imageMode');
    }
    this.imageTabSelected = true;
    this.descriptionTabSelected = false;
    this.mapTabSelected = false;
  }

  _setMapMode() {
    this.activity('select', 'mapMode');
    this.imageTabSelected = false;
    this.descriptionTabSelected = false;
    this.mapTabSelected = true;
  }

  _setDescriptionMode() {
    this.activity('select', 'descriptionMode');
    this.imageTabSelected = false;
    this.descriptionTabSelected = true;
    this.mapTabSelected = false;
  }

  _toggleDescription() {
    this.activity('toggle', 'description');
    if (this.descriptionTabSelected===true) {
      this._setImageMode();
    } else {
      this._setDescriptionMode();
    }
  }

  _openMenu() {
    this.activity('open', 'itemMenu');
  }

  setInBudget() {
    //console.log("setInBudget itemId: "+this.item.id);
    const color = this.configFromServer.client_config.moduleTypeColorLookup[this.item.module_content_type];
    this.$$("#addToBudgetButton").style.backgroundColor=color;
    if (this.$$("#editExclusiveOptions")) {
      this.$$("#editExclusiveOptions").style.backgroundColor="#FFF";
      this.$$("#editExclusiveOptions").style.color=color;
    }

    this.$$("#opacityLayer").style.backgroundColor=color;
    this.$$("#opacityLayer").classList.add("cover");
    this.$$("#opacityLayer").style.display="block";
    setTimeout(()=>{
      this.$$("#opacityLayer").style.display="none";
      this.selected = true;
    }, 600);
  }

  removeFromBudget() {
    //console.log("removeFromBudget itemId: "+this.item.id);
    this.selected = false;
    this.isFavorite = false;
  }

  setTooExpensive() {
    //console.log("setTooExpensive itemId: "+this.item.id);
    this.toExpensive = true;
    this.$$("#addToBudgetButton").style.backgroundColor="#999";
  }

  setNotTooExpensive() {
    //console.log("setNotTooExpensive itemId: "+this.item.id);
    this.toExpensive = false;
    if (!this.isExcluded && !this.isBlockedBy) {
      const color = this.configFromServer.client_config.moduleTypeColorLookup[this.item.module_content_type];
      this.$$("#addToBudgetButton").style.backgroundColor=color;
      if (this.$$("#editExclusiveOptions")) {
        this.$$("#editExclusiveOptions").style.backgroundColor="#FFF";
        this.$$("#editExclusiveOptions").style.color=color;
      }
    }
  }

  setBlockedBy(blockedByInfo) {
    //console.log("setTooExpensive itemId: "+this.item.id);
    if (blockedByInfo.id!=this.item.id) {
      this.$$("#addToBudgetButton").style.display="none";
      this.$$("#innerContainer").style.opacity = 0.4;
      const color = this.configFromServer.client_config.moduleTypeColorLookup[this.item.module_content_type];
      this.isBlockedBy = blockedByInfo;
      this.$$("#isBlockedByInfo").style.color=color;
      this.requestUpdate();
    }
  }

  setNotBlockedBy () {
    //console.log("setNotTooExpensive itemId: "+this.item.id);
    this.isBlockedBy = null;
    this.$$("#addToBudgetButton").style.display="block";
    this.$$("#innerContainer").style.opacity = 1.0;
    this.requestUpdate();
  }

  _toggleFavorite() {
    if (this.budgetElement.currentBallot.favoriteItem &&
        this.budgetElement.currentBallot.favoriteItem.id == this.item.id) {
      this.fire('oav-set-favorite-item-in-budget', {
        item: null
      });
      this.isFavorite = false;
    } else {
      var button = this.$$("#addFavoriteButton");
      var buttonRect = button.getBoundingClientRect();
      var left = buttonRect.left;// + window.scrollX;
      var top = buttonRect.top;// + window.scrollY;
      this.isFavorite = true;

      this.fire('oav-set-favorite-item-in-budget', {
        item: this.item,
        orgAnimPos: { left: left, top: top },
        budgetAnimPos: this.budgetElement.getItemLeftTop(this.item)
      });
      setTimeout(()=> {
        this.requestUpdate();
      });
    }
  }

  _toggleInBudget(event) {
    //console.log("_toggleInBudget itemId: "+this.item.id);
    event.stopPropagation();
    if (this.oldElementNeedsSwapping) {
      this.ballotElement.swapOutItem(this.oldElementNeedsSwapping, this.item);
      this.oldElementNeedsSwapping=null;
    }
    if (event.target && !event.target.attributes['disabled']) {
      this.fire('oav-toggle-item-in-budget', { item: this.item });
      this.fire('oap-close-snackbar');
    } else {
      console.warn("Trying to click disabled button");
    }
  }
}

window.customElements.define('oap-article-item', OapArticleItem);
