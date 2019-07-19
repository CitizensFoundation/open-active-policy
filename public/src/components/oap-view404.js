import { html } from 'lit-element';
import { OapPageViewElement } from './oap-page-view-element';

// These are the shared styles needed by this element.
//import { SharedStyles } from './shared-styles.js';

class OapView404 extends OapPageViewElement {
  render() {
    return html`
      <section>
        <h2>Oops! You hit a 404</h2>
        <p>
          The page you're looking for doesn't seem to exist. Head back
          <a href="/">home</a> and try again?
        </p>
      </section>
    `
  }
}

window.customElements.define('oap-view404', OapView404);
