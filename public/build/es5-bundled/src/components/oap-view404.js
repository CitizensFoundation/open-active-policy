define(["./oap-app.js"],function(_oapApp){"use strict";function _templateObject_b8ac7c40ff0211e9ba541ff549bd8a2a(){var data=babelHelpers.taggedTemplateLiteral(["\n      <section>\n        <h2>Oops! You hit a 404</h2>\n        <p>\n          The page you're looking for doesn't seem to exist. Head back\n          <a href=\"/\">home</a> and try again?\n        </p>\n      </section>\n    "]);_templateObject_b8ac7c40ff0211e9ba541ff549bd8a2a=function _templateObject_b8ac7c40ff0211e9ba541ff549bd8a2a(){return data};return data}//import { SharedStyles } from './shared-styles.js';
var OapView404=/*#__PURE__*/function(_OapPageViewElement){babelHelpers.inherits(OapView404,_OapPageViewElement);function OapView404(){babelHelpers.classCallCheck(this,OapView404);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(OapView404).apply(this,arguments))}babelHelpers.createClass(OapView404,[{key:"render",value:function render(){return(0,_oapApp.html$1)(_templateObject_b8ac7c40ff0211e9ba541ff549bd8a2a())}}]);return OapView404}(_oapApp.OapPageViewElement);window.customElements.define("oap-view404",OapView404)});