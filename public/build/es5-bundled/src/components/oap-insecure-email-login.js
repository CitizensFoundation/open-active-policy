define(["exports","./oap-app.js"],function(_exports,_oapApp){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.OapInsecureEmailLoginStyles=_exports.$oapInsecureEmailLoginStyles=void 0;function _templateObject5_8ecfa560b14a11e9a5ed5bfeb0e0bbde(){var data=babelHelpers.taggedTemplateLiteral([""]);_templateObject5_8ecfa560b14a11e9a5ed5bfeb0e0bbde=function _templateObject5_8ecfa560b14a11e9a5ed5bfeb0e0bbde(){return data};return data}function _templateObject4_8ecfa560b14a11e9a5ed5bfeb0e0bbde(){var data=babelHelpers.taggedTemplateLiteral(["\n            <paper-checkbox id=\"confirmedAge\" class=\"checkBox\" name=\"confirmedAge\">\n              ","\n            </paper-checkbox>\n          "]);_templateObject4_8ecfa560b14a11e9a5ed5bfeb0e0bbde=function _templateObject4_8ecfa560b14a11e9a5ed5bfeb0e0bbde(){return data};return data}function _templateObject3_8ecfa560b14a11e9a5ed5bfeb0e0bbde(){var data=babelHelpers.taggedTemplateLiteral(["\n      <paper-dialog id=\"dialog\" with-backdrop>\n        <div class=\"layout horizontal center-center\">\n          <h2>","</h2>\n        </div>\n\n        <form is=\"iron-form\" id=\"form\">\n          <paper-input id=\"email\"\n                        type=\"text\"\n                        label=\"","\"\n                        value=\"","\"\n                        minlength=\"5\"\n                        error-message=\"","\">\n          </paper-input>\n\n          <paper-input id=\"postCode\"\n                        type=\"text\"\n                        label=\"","\"\n                        value=\"","\"\n                        maxlength=\"","\">\n          </paper-input>\n\n          <div class=\"postcodeWrongWard\" ?hidden=\"","\">\n            "," ",".<br><br>\n            "," <a href=\"/area-ballot/","\" @click=\"","\">","</a>\n            "," ",".\n          </div>\n\n          ","\n\n\n        </form>\n        <div class=\"buttons layout vertical\">\n          <paper-button autofocus @tap=\"","\">","</paper-button>\n        </div>\n      </paper-dialog>\n    "]);_templateObject3_8ecfa560b14a11e9a5ed5bfeb0e0bbde=function _templateObject3_8ecfa560b14a11e9a5ed5bfeb0e0bbde(){return data};return data}function _templateObject2_8ecfa560b14a11e9a5ed5bfeb0e0bbde(){var data=babelHelpers.taggedTemplateLiteral(["\n  paper-dialog {\n    padding-left: 8px;\n    padding-right: 8px;\n    width: 440px;\n    background-color: #fff;\n  }\n\n  paper-dialog {\n    z-index: 9999;\n  }\n\n  @media (max-width: 480px) {\n    paper-dialog {\n      padding: 0;\n      margin: 0;\n      height: 100%;\n      width: 100%;\n    }\n  }\n\n  paper-spinner {\n    padding:0;\n    margin:0;\n  }\n\n  .buttons {\n    margin-left: 0;\n    padding-left: 0;\n    color: var(--app-accent-color);\n    font-size: 18px;\n    padding-top: 8px;\n  }\n\n  .checkBox {\n    margin-top: 16px;\n  }\n\n  paper-input {\n    --paper-input-container-focus-color: var(--app-accent-color);\n  }\n\n  paper-checkbox {\n    --paper-checkbox-checked-color: var(--app-accent-color);\n    padding-top: 8px;\n  }\n\n  .postcodeWrongWard {\n    color: var(--paper-red-a400);\n  }\n"]);_templateObject2_8ecfa560b14a11e9a5ed5bfeb0e0bbde=function _templateObject2_8ecfa560b14a11e9a5ed5bfeb0e0bbde(){return data};return data}function _templateObject_8ecfa560b14a11e9a5ed5bfeb0e0bbde(){var data=babelHelpers.taggedTemplateLiteral(["<style>\n  :host {\n    display: inline-block;\n    white-space: nowrap;\n    cursor: pointer;\n    --calculated-paper-checkbox-size: var(--paper-checkbox-size, 18px);\n    /* -1px is a sentinel for the default and is replaced in `attached`. */\n    --calculated-paper-checkbox-ink-size: var(--paper-checkbox-ink-size, -1px);\n    @apply --paper-font-common-base;\n    line-height: 0;\n    -webkit-tap-highlight-color: transparent;\n  }\n\n  :host([hidden]) {\n    display: none !important;\n  }\n\n  :host(:focus) {\n    outline: none;\n  }\n\n  .hidden {\n    display: none;\n  }\n\n  #checkboxContainer {\n    display: inline-block;\n    position: relative;\n    width: var(--calculated-paper-checkbox-size);\n    height: var(--calculated-paper-checkbox-size);\n    min-width: var(--calculated-paper-checkbox-size);\n    margin: var(--paper-checkbox-margin, initial);\n    vertical-align: var(--paper-checkbox-vertical-align, middle);\n    background-color: var(--paper-checkbox-unchecked-background-color, transparent);\n  }\n\n  #ink {\n    position: absolute;\n\n    /* Center the ripple in the checkbox by negative offsetting it by\n     * (inkWidth - rippleWidth) / 2 */\n    top: calc(0px - (var(--calculated-paper-checkbox-ink-size) - var(--calculated-paper-checkbox-size)) / 2);\n    left: calc(0px - (var(--calculated-paper-checkbox-ink-size) - var(--calculated-paper-checkbox-size)) / 2);\n    width: var(--calculated-paper-checkbox-ink-size);\n    height: var(--calculated-paper-checkbox-ink-size);\n    color: var(--paper-checkbox-unchecked-ink-color, var(--primary-text-color));\n    opacity: 0.6;\n    pointer-events: none;\n  }\n\n  #ink:dir(rtl) {\n    right: calc(0px - (var(--calculated-paper-checkbox-ink-size) - var(--calculated-paper-checkbox-size)) / 2);\n    left: auto;\n  }\n\n  #ink[checked] {\n    color: var(--paper-checkbox-checked-ink-color, var(--primary-color));\n  }\n\n  #checkbox {\n    position: relative;\n    box-sizing: border-box;\n    height: 100%;\n    border: solid 2px;\n    border-color: var(--paper-checkbox-unchecked-color, var(--primary-text-color));\n    border-radius: 2px;\n    pointer-events: none;\n    -webkit-transition: background-color 140ms, border-color 140ms;\n    transition: background-color 140ms, border-color 140ms;\n\n    -webkit-transition-duration: var(--paper-checkbox-animation-duration, 140ms);\n    transition-duration: var(--paper-checkbox-animation-duration, 140ms);\n  }\n\n  /* checkbox checked animations */\n  #checkbox.checked #checkmark {\n    -webkit-animation: checkmark-expand 140ms ease-out forwards;\n    animation: checkmark-expand 140ms ease-out forwards;\n\n    -webkit-animation-duration: var(--paper-checkbox-animation-duration, 140ms);\n    animation-duration: var(--paper-checkbox-animation-duration, 140ms);\n  }\n\n  @-webkit-keyframes checkmark-expand {\n    0% {\n      -webkit-transform: scale(0, 0) rotate(45deg);\n    }\n    100% {\n      -webkit-transform: scale(1, 1) rotate(45deg);\n    }\n  }\n\n  @keyframes checkmark-expand {\n    0% {\n      transform: scale(0, 0) rotate(45deg);\n    }\n    100% {\n      transform: scale(1, 1) rotate(45deg);\n    }\n  }\n\n  #checkbox.checked {\n    background-color: var(--paper-checkbox-checked-color, var(--primary-color));\n    border-color: var(--paper-checkbox-checked-color, var(--primary-color));\n  }\n\n  #checkmark {\n    position: absolute;\n    width: 36%;\n    height: 70%;\n    border-style: solid;\n    border-top: none;\n    border-left: none;\n    border-right-width: calc(2/15 * var(--calculated-paper-checkbox-size));\n    border-bottom-width: calc(2/15 * var(--calculated-paper-checkbox-size));\n    border-color: var(--paper-checkbox-checkmark-color, white);\n    -webkit-transform-origin: 97% 86%;\n    transform-origin: 97% 86%;\n    box-sizing: content-box; /* protect against page-level box-sizing */\n  }\n\n  #checkmark:dir(rtl) {\n    -webkit-transform-origin: 50% 14%;\n    transform-origin: 50% 14%;\n  }\n\n  /* label */\n  #checkboxLabel {\n    position: relative;\n    display: inline-block;\n    vertical-align: middle;\n    padding-left: var(--paper-checkbox-label-spacing, 8px);\n    white-space: normal;\n    line-height: normal;\n    color: var(--paper-checkbox-label-color, var(--primary-text-color));\n    @apply --paper-checkbox-label;\n  }\n\n  :host([checked]) #checkboxLabel {\n    color: var(--paper-checkbox-label-checked-color, var(--paper-checkbox-label-color, var(--primary-text-color)));\n    @apply --paper-checkbox-label-checked;\n  }\n\n  #checkboxLabel:dir(rtl) {\n    padding-right: var(--paper-checkbox-label-spacing, 8px);\n    padding-left: 0;\n  }\n\n  #checkboxLabel[hidden] {\n    display: none;\n  }\n\n  /* disabled state */\n\n  :host([disabled]) #checkbox {\n    opacity: 0.5;\n    border-color: var(--paper-checkbox-unchecked-color, var(--primary-text-color));\n  }\n\n  :host([disabled][checked]) #checkbox {\n    background-color: var(--paper-checkbox-unchecked-color, var(--primary-text-color));\n    opacity: 0.5;\n  }\n\n  :host([disabled]) #checkboxLabel  {\n    opacity: 0.65;\n  }\n\n  /* invalid state */\n  #checkbox.invalid:not(.checked) {\n    border-color: var(--paper-checkbox-error-color, var(--error-color));\n  }\n</style>\n\n<div id=\"checkboxContainer\">\n  <div id=\"checkbox\" class$=\"[[_computeCheckboxClass(checked, invalid)]]\">\n    <div id=\"checkmark\" class$=\"[[_computeCheckmarkClass(checked)]]\"></div>\n  </div>\n</div>\n\n<div id=\"checkboxLabel\"><slot></slot></div>"],["<style>\n  :host {\n    display: inline-block;\n    white-space: nowrap;\n    cursor: pointer;\n    --calculated-paper-checkbox-size: var(--paper-checkbox-size, 18px);\n    /* -1px is a sentinel for the default and is replaced in \\`attached\\`. */\n    --calculated-paper-checkbox-ink-size: var(--paper-checkbox-ink-size, -1px);\n    @apply --paper-font-common-base;\n    line-height: 0;\n    -webkit-tap-highlight-color: transparent;\n  }\n\n  :host([hidden]) {\n    display: none !important;\n  }\n\n  :host(:focus) {\n    outline: none;\n  }\n\n  .hidden {\n    display: none;\n  }\n\n  #checkboxContainer {\n    display: inline-block;\n    position: relative;\n    width: var(--calculated-paper-checkbox-size);\n    height: var(--calculated-paper-checkbox-size);\n    min-width: var(--calculated-paper-checkbox-size);\n    margin: var(--paper-checkbox-margin, initial);\n    vertical-align: var(--paper-checkbox-vertical-align, middle);\n    background-color: var(--paper-checkbox-unchecked-background-color, transparent);\n  }\n\n  #ink {\n    position: absolute;\n\n    /* Center the ripple in the checkbox by negative offsetting it by\n     * (inkWidth - rippleWidth) / 2 */\n    top: calc(0px - (var(--calculated-paper-checkbox-ink-size) - var(--calculated-paper-checkbox-size)) / 2);\n    left: calc(0px - (var(--calculated-paper-checkbox-ink-size) - var(--calculated-paper-checkbox-size)) / 2);\n    width: var(--calculated-paper-checkbox-ink-size);\n    height: var(--calculated-paper-checkbox-ink-size);\n    color: var(--paper-checkbox-unchecked-ink-color, var(--primary-text-color));\n    opacity: 0.6;\n    pointer-events: none;\n  }\n\n  #ink:dir(rtl) {\n    right: calc(0px - (var(--calculated-paper-checkbox-ink-size) - var(--calculated-paper-checkbox-size)) / 2);\n    left: auto;\n  }\n\n  #ink[checked] {\n    color: var(--paper-checkbox-checked-ink-color, var(--primary-color));\n  }\n\n  #checkbox {\n    position: relative;\n    box-sizing: border-box;\n    height: 100%;\n    border: solid 2px;\n    border-color: var(--paper-checkbox-unchecked-color, var(--primary-text-color));\n    border-radius: 2px;\n    pointer-events: none;\n    -webkit-transition: background-color 140ms, border-color 140ms;\n    transition: background-color 140ms, border-color 140ms;\n\n    -webkit-transition-duration: var(--paper-checkbox-animation-duration, 140ms);\n    transition-duration: var(--paper-checkbox-animation-duration, 140ms);\n  }\n\n  /* checkbox checked animations */\n  #checkbox.checked #checkmark {\n    -webkit-animation: checkmark-expand 140ms ease-out forwards;\n    animation: checkmark-expand 140ms ease-out forwards;\n\n    -webkit-animation-duration: var(--paper-checkbox-animation-duration, 140ms);\n    animation-duration: var(--paper-checkbox-animation-duration, 140ms);\n  }\n\n  @-webkit-keyframes checkmark-expand {\n    0% {\n      -webkit-transform: scale(0, 0) rotate(45deg);\n    }\n    100% {\n      -webkit-transform: scale(1, 1) rotate(45deg);\n    }\n  }\n\n  @keyframes checkmark-expand {\n    0% {\n      transform: scale(0, 0) rotate(45deg);\n    }\n    100% {\n      transform: scale(1, 1) rotate(45deg);\n    }\n  }\n\n  #checkbox.checked {\n    background-color: var(--paper-checkbox-checked-color, var(--primary-color));\n    border-color: var(--paper-checkbox-checked-color, var(--primary-color));\n  }\n\n  #checkmark {\n    position: absolute;\n    width: 36%;\n    height: 70%;\n    border-style: solid;\n    border-top: none;\n    border-left: none;\n    border-right-width: calc(2/15 * var(--calculated-paper-checkbox-size));\n    border-bottom-width: calc(2/15 * var(--calculated-paper-checkbox-size));\n    border-color: var(--paper-checkbox-checkmark-color, white);\n    -webkit-transform-origin: 97% 86%;\n    transform-origin: 97% 86%;\n    box-sizing: content-box; /* protect against page-level box-sizing */\n  }\n\n  #checkmark:dir(rtl) {\n    -webkit-transform-origin: 50% 14%;\n    transform-origin: 50% 14%;\n  }\n\n  /* label */\n  #checkboxLabel {\n    position: relative;\n    display: inline-block;\n    vertical-align: middle;\n    padding-left: var(--paper-checkbox-label-spacing, 8px);\n    white-space: normal;\n    line-height: normal;\n    color: var(--paper-checkbox-label-color, var(--primary-text-color));\n    @apply --paper-checkbox-label;\n  }\n\n  :host([checked]) #checkboxLabel {\n    color: var(--paper-checkbox-label-checked-color, var(--paper-checkbox-label-color, var(--primary-text-color)));\n    @apply --paper-checkbox-label-checked;\n  }\n\n  #checkboxLabel:dir(rtl) {\n    padding-right: var(--paper-checkbox-label-spacing, 8px);\n    padding-left: 0;\n  }\n\n  #checkboxLabel[hidden] {\n    display: none;\n  }\n\n  /* disabled state */\n\n  :host([disabled]) #checkbox {\n    opacity: 0.5;\n    border-color: var(--paper-checkbox-unchecked-color, var(--primary-text-color));\n  }\n\n  :host([disabled][checked]) #checkbox {\n    background-color: var(--paper-checkbox-unchecked-color, var(--primary-text-color));\n    opacity: 0.5;\n  }\n\n  :host([disabled]) #checkboxLabel  {\n    opacity: 0.65;\n  }\n\n  /* invalid state */\n  #checkbox.invalid:not(.checked) {\n    border-color: var(--paper-checkbox-error-color, var(--error-color));\n  }\n</style>\n\n<div id=\"checkboxContainer\">\n  <div id=\"checkbox\" class$=\"[[_computeCheckboxClass(checked, invalid)]]\">\n    <div id=\"checkmark\" class$=\"[[_computeCheckmarkClass(checked)]]\"></div>\n  </div>\n</div>\n\n<div id=\"checkboxLabel\"><slot></slot></div>"]);_templateObject_8ecfa560b14a11e9a5ed5bfeb0e0bbde=function _templateObject_8ecfa560b14a11e9a5ed5bfeb0e0bbde(){return data};return data}var template=(0,_oapApp.html)(_templateObject_8ecfa560b14a11e9a5ed5bfeb0e0bbde());template.setAttribute("strip-whitespace","");/**
                                               Material design:
                                               [Checkbox](https://www.google.com/design/spec/components/selection-controls.html#selection-controls-checkbox)
                                               
                                               `paper-checkbox` is a button that can be either checked or unchecked. User can
                                               tap the checkbox to check or uncheck it. Usually you use checkboxes to allow
                                               user to select multiple options from a set. If you have a single ON/OFF option,
                                               avoid using a single checkbox and use `paper-toggle-button` instead.
                                               
                                               Example:
                                               
                                                   <paper-checkbox>label</paper-checkbox>
                                               
                                                   <paper-checkbox checked> label</paper-checkbox>
                                               
                                               ### Styling
                                               
                                               The following custom properties and mixins are available for styling:
                                               
                                               Custom property | Description | Default
                                               ----------------|-------------|----------
                                               `--paper-checkbox-unchecked-background-color` | Checkbox background color when the input is not checked | `transparent`
                                               `--paper-checkbox-unchecked-color` | Checkbox border color when the input is not checked | `--primary-text-color`
                                               `--paper-checkbox-unchecked-ink-color` | Selected/focus ripple color when the input is not checked | `--primary-text-color`
                                               `--paper-checkbox-checked-color` | Checkbox color when the input is checked | `--primary-color`
                                               `--paper-checkbox-checked-ink-color` | Selected/focus ripple color when the input is checked | `--primary-color`
                                               `--paper-checkbox-checkmark-color` | Checkmark color | `white`
                                               `--paper-checkbox-label-color` | Label color | `--primary-text-color`
                                               `--paper-checkbox-label-checked-color` | Label color when the input is checked | `--paper-checkbox-label-color`
                                               `--paper-checkbox-label-spacing` | Spacing between the label and the checkbox | `8px`
                                               `--paper-checkbox-label` | Mixin applied to the label | `{}`
                                               `--paper-checkbox-label-checked` | Mixin applied to the label when the input is checked | `{}`
                                               `--paper-checkbox-error-color` | Checkbox color when invalid | `--error-color`
                                               `--paper-checkbox-size` | Size of the checkbox | `18px`
                                               `--paper-checkbox-ink-size` | Size of the ripple | `48px`
                                               `--paper-checkbox-margin` | Margin around the checkbox container | `initial`
                                               `--paper-checkbox-vertical-align` | Vertical alignment of the checkbox container | `middle`
                                               
                                               This element applies the mixin `--paper-font-common-base` but does not import
                                               `paper-styles/typography.html`. In order to apply the `Roboto` font to this
                                               element, make sure you've imported `paper-styles/typography.html`.
                                               
                                               @demo demo/index.html
                                               */(0,_oapApp.Polymer)({_template:template,is:"paper-checkbox",behaviors:[_oapApp.PaperCheckedElementBehavior],/** @private */hostAttributes:{role:"checkbox","aria-checked":!1,tabindex:0},properties:{/**
     * Fired when the checked state changes due to user interaction.
     *
     * @event change
     */ /**
         * Fired when the checked state changes.
         *
         * @event iron-change
         */ariaActiveAttribute:{type:String,value:"aria-checked"}},attached:function attached(){// Wait until styles have resolved to check for the default sentinel.
// See polymer#4009 for more details.
(0,_oapApp.afterNextRender)(this,function(){var inkSize=this.getComputedStyleValue("--calculated-paper-checkbox-ink-size").trim();// If unset, compute and set the default `--paper-checkbox-ink-size`.
if("-1px"===inkSize){var checkboxSizeText=this.getComputedStyleValue("--calculated-paper-checkbox-size").trim(),units="px",unitsMatches=checkboxSizeText.match(/[A-Za-z]+$/);if(null!==unitsMatches){units=unitsMatches[0]}var checkboxSize=parseFloat(checkboxSizeText),defaultInkSize=8/3*checkboxSize;if("px"===units){defaultInkSize=Math.floor(defaultInkSize);// The checkbox and ripple need to have the same parity so that their
// centers align.
if(defaultInkSize%2!==checkboxSize%2){defaultInkSize++}}this.updateStyles({"--paper-checkbox-ink-size":defaultInkSize+units})}})},_computeCheckboxClass:function _computeCheckboxClass(checked,invalid){var className="";if(checked){className+="checked "}if(invalid){className+="invalid"}return className},_computeCheckmarkClass:function _computeCheckmarkClass(checked){return checked?"":"hidden"},// create ripple inside the checkboxContainer
_createRipple:function _createRipple(){this._rippleContainer=this.$.checkboxContainer;return _oapApp.PaperInkyFocusBehaviorImpl._createRipple.call(this)}});var OapInsecureEmailLoginStyles=(0,_oapApp.css)(_templateObject2_8ecfa560b14a11e9a5ed5bfeb0e0bbde());_exports.OapInsecureEmailLoginStyles=OapInsecureEmailLoginStyles;var oapInsecureEmailLoginStyles={OapInsecureEmailLoginStyles:OapInsecureEmailLoginStyles};_exports.$oapInsecureEmailLoginStyles=oapInsecureEmailLoginStyles;var OapInsecureEmailLogin=/*#__PURE__*/function(_OapBaseElement){babelHelpers.inherits(OapInsecureEmailLogin,_OapBaseElement);babelHelpers.createClass(OapInsecureEmailLogin,[{key:"render",value:function render(){return(0,_oapApp.html$1)(_templateObject3_8ecfa560b14a11e9a5ed5bfeb0e0bbde(),this.localize("loginWithEmailAndPostCode"),this.localize("userEmail"),this.email,this.emailErrorMessage,this.localize("postCode"),this.postCode,this.configFromServer.client_config.insecureEmailPostcodeMaxLength,!this.correctAreaId,this.localize("thisPostCodeDoesNotBelongTo"),this.areaName,this.localize("forThisCodeYouCanVoteHere"),this.correctAreaId,this._resetCorrectArea,this.correctAreaName,this.localize("orEnterApostCodeThatBelongsTo"),this.areaName,this.configFromServer.client_config.insecureEmailAgeLimit?(0,_oapApp.html$1)(_templateObject4_8ecfa560b14a11e9a5ed5bfeb0e0bbde(),this.localize("confirmAge")):(0,_oapApp.html$1)(_templateObject5_8ecfa560b14a11e9a5ed5bfeb0e0bbde()),this._validateAndSend,this.localize("authenticateAndVote"))}},{key:"updated",value:function updated(changedProps){babelHelpers.get(babelHelpers.getPrototypeOf(OapInsecureEmailLogin.prototype),"updated",this).call(this,changedProps)}},{key:"firstUpdated",value:function firstUpdated(){var _this2=this;babelHelpers.get(babelHelpers.getPrototypeOf(OapInsecureEmailLogin.prototype),"firstUpdated",this).call(this);Object.entries(this.configFromServer.client_config.insecureEmailLoginPostCodes).forEach(function(entry){var areaId=entry[0],postCodes=entry[1];postCodes.forEach(function(postCode){_this2.postCodesAreas[postCode]=areaId;_this2.postCodesAreasNames[postCode]=_this2.configFromServer.client_config.insecureEmailLoginAreaNames[areaId]})})}}],[{key:"properties",get:function get(){return{correctAreaId:{type:String},areaName:{type:String},correctAreaName:{type:String},postCode:{type:String},userSpinner:{type:Boolean},confirmedAge:{type:Boolean},postCodeValidationPattern:{type:String},emailValidationPattern:{type:String},emailErrorMessage:{type:String},passwordErrorMessage:{type:String},name:{type:String},email:{type:String},submitText:{type:String},onLoginFunction:{type:Function},areaId:String,configFromServer:Object,postCodes:{type:Object},postCodesAreas:{type:Object},postCodesAreasNames:{type:Object}}}},{key:"styles",get:function get(){return[OapInsecureEmailLoginStyles]}}]);function OapInsecureEmailLogin(){var _this;babelHelpers.classCallCheck(this,OapInsecureEmailLogin);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(OapInsecureEmailLogin).call(this));_this.emailValidationPattern="^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";_this.confirmedAge=!1;_this.postCodesAreas={};_this.postCodesAreasNames={};return _this}babelHelpers.createClass(OapInsecureEmailLogin,[{key:"_resetCorrectArea",value:function _resetCorrectArea(){var _this3=this;setTimeout(function(){_this3.correctAreaId=null;_this3.correctAreaName=null;_this3.close()},100)}},{key:"_loginCompleted",value:function _loginCompleted(){this.onLoginFunction();this.close()}},{key:"isValidPostcode",value:function isValidPostcode(areaId,postCode){postCode=postCode.replace(/\s/g,"").toUpperCase();return-1<this.configFromServer.client_config.insecureEmailLoginPostCodes[areaId].indexOf(postCode)}},{key:"getAreaForPostCode",value:function getAreaForPostCode(postCode){postCode=postCode.replace(/\s/g,"").toUpperCase();if(this.postCodesAreas[postCode]&&this.postCodesAreasNames[postCode]){return{id:this.postCodesAreas[postCode],name:this.postCodesAreasNames[postCode]}}else{return null}}},{key:"open",value:function open(areaId,areaName,onLoginFunction){this.onLoginFunction=onLoginFunction;this.areaId=areaId;this.areaName=areaName;this.userSpinner=!1;this.opened=!1;this.postCode="";this.confirmedAge=!1;this.email="";this.$$("#dialog").open()}},{key:"_validateAndSend",value:function _validateAndSend(e){var _this4=this;this.email=this.$$("#email").value;this.postCode=this.$$("#postCode").value;if(this.email&&this.postCode&&this.$$("#confirmedAge").checked){var re=new RegExp(this.emailValidationPattern);if(re.test(this.email)){if(this.isValidPostcode(this.areaId,this.postCode)){fetch("/votes/insecure_email_login",{method:"POST",cache:"no-cache",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({insecure_email:this.email.toLowerCase(),postCode:this.postCode})}).then(function(response){return response.json()}).then(function(response){if(response&&!0===response.ok){_this4._loginCompleted()}else{_this4.fire("oav-error",_this4.localize("error_not_authorized"))}}).catch(function(){_this4.fire("oav-error",_this4.localize("general_error"))});return!0}else if(this.getAreaForPostCode(this.postCode)){var areaInfo=this.getAreaForPostCode(this.postCode);this.correctAreaId=areaInfo.id;this.correctAreaName=areaInfo.name}else{this.fire("oav-error",this.localize("enterValidPostcode"))}}else{this.fire("oav-error",this.localize("enterValidEmail"))}}else{this.fire("oav-error",this.localize("completeForm"));return!1}}},{key:"close",value:function close(){var dialog=this.$$("#dialog");if(dialog){dialog.close()}this.opened=!1;this.userSpinner=!1}}]);return OapInsecureEmailLogin}(_oapApp.OapBaseElement);window.customElements.define("oap-insecure-email-login",OapInsecureEmailLogin)});