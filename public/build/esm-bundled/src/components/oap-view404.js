import{html$1 as html,OapPageViewElement}from"./oap-app.js";//import { SharedStyles } from './shared-styles.js';
class OapView404 extends OapPageViewElement{render(){return html`
      <section>
        <h2>Oops! You hit a 404</h2>
        <p>
          The page you're looking for doesn't seem to exist. Head back
          <a href="/">home</a> and try again?
        </p>
      </section>
    `}}window.customElements.define("oap-view404",OapView404);