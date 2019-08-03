import { html } from 'lit-element';
import '@polymer/paper-button/paper-button';

import { OapPageViewElement } from '../oap-page-view-element';
import { OapFilterArticlesStyles } from './oap-filter-articles-styles';
import './oap-swipable-cards';
import { OapShadowStyles } from '../oap-shadow-styles';

class OapFilterArticles extends OapPageViewElement {
  static get properties() {
    return {
      allItems: Array,
      completed: Boolean,
      configFromServer: Object,
      country: Object,
      selectedItems: Array,
      filteredItems: Array
    };
  }

  static get styles() {
    return [
      OapFilterArticlesStyles,
      OapShadowStyles
    ];
  }

  render() {
    return html`
      ${this.completed ? html`
        <div class="layout vertical center-center topContainer shadow-animation shadow-elevation-3d" style="width: 100%;">
          <div class="completeHeader">
            ${this.localize("youHaveCompletedTheFiltering")}
          </div>
          <div class="buttonContainer">
            <paper-button raised class="continueButton" @click="${()=> { this.fire('oap-filtering-finished') }}">${this.localize("continueToSelection")}</paper-button>
          </div>
        </div>
    ` : html`
        <oap-swipable-cards
          .country="${this.country}"
          .selectedItems="${this.selectedItems}"
          .filteredItems="${this.filteredItems}"
          .configFromServer="${this.configFromServer}"
          .language="${this.language}"
          @completed="${this.setCompleted}"
          .disableUpSwipe="true"
          .items="${this.allItems}">
        </oap-swipable-cards>
      `}

    `
  }

  setCompleted() {
    this.completed=true;
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('allItems')) {
      this.completed=false;
    }
  }
}

window.customElements.define('oap-filter-articles', OapFilterArticles);
