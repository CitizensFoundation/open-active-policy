import { html } from 'lit-element';
import '@polymer/paper-button/paper-button';

import { OapPageViewElement } from '../oap-page-view-element';
import { OapFilterArticlesStyles } from './oap-filter-articles-styles';
import './oap-swipable-cards';

class OapFilterArticles extends OapPageViewElement {
  static get properties() {
    return {
      allItems: Array
    };
  }

  static get styles() {
    return [
      OapFilterArticlesStyles,
    ];
  }

  render() {
    return html`
      <oap-swipable-cards .disableUpSwipe="true" .items="${this.allItems}"></oap-swipable-cards>
    `
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('allItems')) {
    }
  }
}

window.customElements.define('oap-filter-articles', OapFilterArticles);
