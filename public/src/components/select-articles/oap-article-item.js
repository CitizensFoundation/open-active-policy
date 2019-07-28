/**
@license
Copyright (c) 2010-2019 Citizens Foundation
*/

import { html } from 'lit-element';
import { OapArticleItemStyles } from './oap-article-item-styles.js';
import { OapBaseElement } from '../oap-base-element';
import { OapShadowStyles } from '../oap-shadow-styles';

import '@polymer/iron-image';
import '@polymer/paper-menu-button';
import '@polymer/paper-icon-button';
import '@polymer/paper-listbox';
import '@polymer/paper-item';
import '@polymer/paper-fab';
import '@polymer/paper-button';
import 'paper-share-button';
import { OapFlexLayout } from '../oap-flex-layout.js';

class OapArticleItem extends OapBaseElement {
  static get properties() {
    return {
      item: {
        type: Object
      },

      elevation: Number,

      ballotElement: {
        type: Object
      },

      selectedInBudget: {
        type: Boolean
      },

      isBookmarked: {
        type: Boolean
      },

      toExpensive: {
        type: Boolean
      },

      isExcluded: {
        type: Boolean
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

      configFromServer: Object,

      listBoxSelection: Number
    };
  }

  static get styles() {
    return [
      OapArticleItemStyles,
      OapShadowStyles,
      OapFlexLayout
    ];
  }

  render() {
    return html`
      <div id="topContainer" class="itemContent shadow-animation shadow-elevation-3dp layout horizontal" ?small="${this.small}" ?tiny="${this.tiny}">
        <div id="opacityLayer"></div>
        <div id="leftColor" class="leftColor"></div>
        <div>
          <div class="layout horizontal" ?hidden="${this.descriptionTabSelected}">
            <div class="name" ?small="${this.small}" ?tiny="${this.tiny}">${this.item.name}</div>
          </div>
          <div class="buttons" ?hidden="${this.descriptionTabSelected}">
            <paper-button raised id="addToBudgetButton" .elevation="5" class="addRemoveButton" ?hidden="${this.selected}"
                      ?disabled="${this.toExpensive || this.isExcluded}" title="${this.localize('add_to_budget')}" icon="add" @click="${this._toggleInBudget}">
                      +${this.item.price}
            </paper-button>

            <paper-button raised elevation="5" class="addRemoveButton removeButton" ?hidden="${!this.selected}"
                      title="${this.localize('remove_from_budget')}" icon="remove" @click="${this._toggleInBudget}">
                      -${this.item.price}
            </paper-button>
          </div>
        </div>
      </div>
    `;
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
        this.resetFromBudget();
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
    this.listBoxSelection = 0;
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
  }

  _imageLoadedChanged(event) {
    if (event.detail.value) {
      this.imageLoaded = true;
    }
  }

  _clickedDropDownMenu() {
    this.activity('click', 'dropdown');
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
    if (!this.isExcluded) {
      this.$$("#addToBudgetButton").style.backgroundColor=color;
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
            this.setExcluded();
          } else {
            this.setNotExcluded();
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
    this.selected = true;
    const color = this.configFromServer.client_config.moduleTypeColorLookup[this.item.module_content_type];
    this.$$("#addToBudgetButton").style.backgroundColor=color;

    this.$$("#opacityLayer").style.backgroundColor=color;
    this.$$("#opacityLayer").classList.add("cover");
    this.$$("#opacityLayer").style.display="block";
    setTimeout(()=>{
      this.$$("#opacityLayer").style.display="none";
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
    if (!this.isExcluded) {
      const color = this.configFromServer.client_config.moduleTypeColorLookup[this.item.module_content_type];
      this.$$("#addToBudgetButton").style.backgroundColor=color;
    }
  }

  setExcluded() {
    //console.log("setTooExpensive itemId: "+this.item.id);
    this.$$("#addToBudgetButton").style.backgroundColor="#888";
    this.isExcluded = true;
    this.requestUpdate();
  }

  setNotExcluded () {
    //console.log("setNotTooExpensive itemId: "+this.item.id);
    this.isExcluded = false;
    const color = this.configFromServer.client_config.moduleTypeColorLookup[this.item.module_content_type];
    this.$$("#addToBudgetButton").style.backgroundColor=color;
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
    this.fire('oav-toggle-item-in-budget', { item: this.item });
    this.fire('oap-close-snackbar');
  }
}

window.customElements.define('oap-article-item', OapArticleItem);
