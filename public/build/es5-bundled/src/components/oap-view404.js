define(["./oap-app.js"],function(_oapApp){"use strict";function _templateObject_79a6b2b0b3d311e9a050a3559baad73b(){var data=babelHelpers.taggedTemplateLiteral(["\n      <section>\n        <h2>Oops! You hit a 404</h2>\n        <p>\n          The page you're looking for doesn't seem to exist. Head back\n          <a href=\"/\">home</a> and try again?\n        </p>\n      </section>\n    "]);_templateObject_79a6b2b0b3d311e9a050a3559baad73b=function _templateObject_79a6b2b0b3d311e9a050a3559baad73b(){return data};return data}//import { SharedStyles } from './shared-styles.js';
var OapView404=/*#__PURE__*/function(_OapPageViewElement){babelHelpers.inherits(OapView404,_OapPageViewElement);function OapView404(){babelHelpers.classCallCheck(this,OapView404);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(OapView404).apply(this,arguments))}babelHelpers.createClass(OapView404,[{key:"render",value:function render(){return(0,_oapApp.html$1)(_templateObject_79a6b2b0b3d311e9a050a3559baad73b())}}]);return OapView404}(_oapApp.OapPageViewElement);window.customElements.define("oap-view404",OapView404)});