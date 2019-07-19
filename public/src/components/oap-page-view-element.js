// Locale implementation inspired by https://github.com/PolymerElements/app-localize-behavior

import { LitElement } from 'lit-element';
import { OapBaseElement } from './oap-base-element';

export class OapPageViewElement extends OapBaseElement {

  shouldUpdate() {
    return this.active;
  }

  static get properties() {
    return {
      active: { type: Boolean },
    }
  }
}
