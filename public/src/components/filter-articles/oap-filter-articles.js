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
      completed: Boolean
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
        <div class="vertical completed">
          <div class="completeHeader">
            ${this.localize("youHaveCompletedTheFiltering")}
          </div>
          <div>
            ${this.localize("correctQuizAnswers")}: ${this.correctAnswers}
          </div>
          <div>
            ${this.localize("incorrectQuizAnswers")}: ${this.incorrectAnswers}
          </div>
          <div>
            <paper-button raise class="continueButton" @click="${()=> { this.fire('oap-filtering-finished') }}">${this.localize("continueToFiltering")}</paper-button>
          </div>
        </div>
    ` : html`
        <oap-swipable-cards @completed="${this.setCompleted}" .disableUpSwipe="true" .items="${this.allItems}"></oap-swipable-cards>
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
