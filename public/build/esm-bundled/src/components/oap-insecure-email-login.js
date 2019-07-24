import{PaperCheckedElementBehavior,PaperInkyFocusBehaviorImpl,Polymer,html,afterNextRender,css,html$1,OapBaseElement}from"./oap-app.js";const template=html`<style>
  :host {
    display: inline-block;
    white-space: nowrap;
    cursor: pointer;
    --calculated-paper-checkbox-size: var(--paper-checkbox-size, 18px);
    /* -1px is a sentinel for the default and is replaced in \`attached\`. */
    --calculated-paper-checkbox-ink-size: var(--paper-checkbox-ink-size, -1px);
    @apply --paper-font-common-base;
    line-height: 0;
    -webkit-tap-highlight-color: transparent;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:focus) {
    outline: none;
  }

  .hidden {
    display: none;
  }

  #checkboxContainer {
    display: inline-block;
    position: relative;
    width: var(--calculated-paper-checkbox-size);
    height: var(--calculated-paper-checkbox-size);
    min-width: var(--calculated-paper-checkbox-size);
    margin: var(--paper-checkbox-margin, initial);
    vertical-align: var(--paper-checkbox-vertical-align, middle);
    background-color: var(--paper-checkbox-unchecked-background-color, transparent);
  }

  #ink {
    position: absolute;

    /* Center the ripple in the checkbox by negative offsetting it by
     * (inkWidth - rippleWidth) / 2 */
    top: calc(0px - (var(--calculated-paper-checkbox-ink-size) - var(--calculated-paper-checkbox-size)) / 2);
    left: calc(0px - (var(--calculated-paper-checkbox-ink-size) - var(--calculated-paper-checkbox-size)) / 2);
    width: var(--calculated-paper-checkbox-ink-size);
    height: var(--calculated-paper-checkbox-ink-size);
    color: var(--paper-checkbox-unchecked-ink-color, var(--primary-text-color));
    opacity: 0.6;
    pointer-events: none;
  }

  #ink:dir(rtl) {
    right: calc(0px - (var(--calculated-paper-checkbox-ink-size) - var(--calculated-paper-checkbox-size)) / 2);
    left: auto;
  }

  #ink[checked] {
    color: var(--paper-checkbox-checked-ink-color, var(--primary-color));
  }

  #checkbox {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    border: solid 2px;
    border-color: var(--paper-checkbox-unchecked-color, var(--primary-text-color));
    border-radius: 2px;
    pointer-events: none;
    -webkit-transition: background-color 140ms, border-color 140ms;
    transition: background-color 140ms, border-color 140ms;

    -webkit-transition-duration: var(--paper-checkbox-animation-duration, 140ms);
    transition-duration: var(--paper-checkbox-animation-duration, 140ms);
  }

  /* checkbox checked animations */
  #checkbox.checked #checkmark {
    -webkit-animation: checkmark-expand 140ms ease-out forwards;
    animation: checkmark-expand 140ms ease-out forwards;

    -webkit-animation-duration: var(--paper-checkbox-animation-duration, 140ms);
    animation-duration: var(--paper-checkbox-animation-duration, 140ms);
  }

  @-webkit-keyframes checkmark-expand {
    0% {
      -webkit-transform: scale(0, 0) rotate(45deg);
    }
    100% {
      -webkit-transform: scale(1, 1) rotate(45deg);
    }
  }

  @keyframes checkmark-expand {
    0% {
      transform: scale(0, 0) rotate(45deg);
    }
    100% {
      transform: scale(1, 1) rotate(45deg);
    }
  }

  #checkbox.checked {
    background-color: var(--paper-checkbox-checked-color, var(--primary-color));
    border-color: var(--paper-checkbox-checked-color, var(--primary-color));
  }

  #checkmark {
    position: absolute;
    width: 36%;
    height: 70%;
    border-style: solid;
    border-top: none;
    border-left: none;
    border-right-width: calc(2/15 * var(--calculated-paper-checkbox-size));
    border-bottom-width: calc(2/15 * var(--calculated-paper-checkbox-size));
    border-color: var(--paper-checkbox-checkmark-color, white);
    -webkit-transform-origin: 97% 86%;
    transform-origin: 97% 86%;
    box-sizing: content-box; /* protect against page-level box-sizing */
  }

  #checkmark:dir(rtl) {
    -webkit-transform-origin: 50% 14%;
    transform-origin: 50% 14%;
  }

  /* label */
  #checkboxLabel {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    padding-left: var(--paper-checkbox-label-spacing, 8px);
    white-space: normal;
    line-height: normal;
    color: var(--paper-checkbox-label-color, var(--primary-text-color));
    @apply --paper-checkbox-label;
  }

  :host([checked]) #checkboxLabel {
    color: var(--paper-checkbox-label-checked-color, var(--paper-checkbox-label-color, var(--primary-text-color)));
    @apply --paper-checkbox-label-checked;
  }

  #checkboxLabel:dir(rtl) {
    padding-right: var(--paper-checkbox-label-spacing, 8px);
    padding-left: 0;
  }

  #checkboxLabel[hidden] {
    display: none;
  }

  /* disabled state */

  :host([disabled]) #checkbox {
    opacity: 0.5;
    border-color: var(--paper-checkbox-unchecked-color, var(--primary-text-color));
  }

  :host([disabled][checked]) #checkbox {
    background-color: var(--paper-checkbox-unchecked-color, var(--primary-text-color));
    opacity: 0.5;
  }

  :host([disabled]) #checkboxLabel  {
    opacity: 0.65;
  }

  /* invalid state */
  #checkbox.invalid:not(.checked) {
    border-color: var(--paper-checkbox-error-color, var(--error-color));
  }
</style>

<div id="checkboxContainer">
  <div id="checkbox" class$="[[_computeCheckboxClass(checked, invalid)]]">
    <div id="checkmark" class$="[[_computeCheckmarkClass(checked)]]"></div>
  </div>
</div>

<div id="checkboxLabel"><slot></slot></div>`;template.setAttribute("strip-whitespace","");/**
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
                                               */Polymer({_template:template,is:"paper-checkbox",behaviors:[PaperCheckedElementBehavior],/** @private */hostAttributes:{role:"checkbox","aria-checked":!1,tabindex:0},properties:{/**
     * Fired when the checked state changes due to user interaction.
     *
     * @event change
     */ /**
         * Fired when the checked state changes.
         *
         * @event iron-change
         */ariaActiveAttribute:{type:String,value:"aria-checked"}},attached:function(){// Wait until styles have resolved to check for the default sentinel.
// See polymer#4009 for more details.
afterNextRender(this,function(){var inkSize=this.getComputedStyleValue("--calculated-paper-checkbox-ink-size").trim();// If unset, compute and set the default `--paper-checkbox-ink-size`.
if("-1px"===inkSize){var checkboxSizeText=this.getComputedStyleValue("--calculated-paper-checkbox-size").trim(),units="px",unitsMatches=checkboxSizeText.match(/[A-Za-z]+$/);if(null!==unitsMatches){units=unitsMatches[0]}var checkboxSize=parseFloat(checkboxSizeText),defaultInkSize=8/3*checkboxSize;if("px"===units){defaultInkSize=Math.floor(defaultInkSize);// The checkbox and ripple need to have the same parity so that their
// centers align.
if(defaultInkSize%2!==checkboxSize%2){defaultInkSize++}}this.updateStyles({"--paper-checkbox-ink-size":defaultInkSize+units})}})},_computeCheckboxClass:function(checked,invalid){var className="";if(checked){className+="checked "}if(invalid){className+="invalid"}return className},_computeCheckmarkClass:function(checked){return checked?"":"hidden"},// create ripple inside the checkboxContainer
_createRipple:function(){this._rippleContainer=this.$.checkboxContainer;return PaperInkyFocusBehaviorImpl._createRipple.call(this)}});const OapInsecureEmailLoginStyles=css`
  paper-dialog {
    padding-left: 8px;
    padding-right: 8px;
    width: 440px;
    background-color: #fff;
  }

  paper-dialog {
    z-index: 9999;
  }

  @media (max-width: 480px) {
    paper-dialog {
      padding: 0;
      margin: 0;
      height: 100%;
      width: 100%;
    }
  }

  paper-spinner {
    padding:0;
    margin:0;
  }

  .buttons {
    margin-left: 0;
    padding-left: 0;
    color: var(--app-accent-color);
    font-size: 18px;
    padding-top: 8px;
  }

  .checkBox {
    margin-top: 16px;
  }

  paper-input {
    --paper-input-container-focus-color: var(--app-accent-color);
  }

  paper-checkbox {
    --paper-checkbox-checked-color: var(--app-accent-color);
    padding-top: 8px;
  }

  .postcodeWrongWard {
    color: var(--paper-red-a400);
  }
`;var oapInsecureEmailLoginStyles={OapInsecureEmailLoginStyles:OapInsecureEmailLoginStyles};class OapInsecureEmailLogin extends OapBaseElement{static get properties(){return{correctAreaId:{type:String},areaName:{type:String},correctAreaName:{type:String},postCode:{type:String},userSpinner:{type:Boolean},confirmedAge:{type:Boolean},postCodeValidationPattern:{type:String},emailValidationPattern:{type:String},emailErrorMessage:{type:String},passwordErrorMessage:{type:String},name:{type:String},email:{type:String},submitText:{type:String},onLoginFunction:{type:Function},areaId:String,configFromServer:Object,postCodes:{type:Object},postCodesAreas:{type:Object},postCodesAreasNames:{type:Object}}}static get styles(){return[OapInsecureEmailLoginStyles]}render(){return html$1`
      <paper-dialog id="dialog" with-backdrop>
        <div class="layout horizontal center-center">
          <h2>${this.localize("loginWithEmailAndPostCode")}</h2>
        </div>

        <form is="iron-form" id="form">
          <paper-input id="email"
                        type="text"
                        label="${this.localize("userEmail")}"
                        value="${this.email}"
                        minlength="5"
                        error-message="${this.emailErrorMessage}">
          </paper-input>

          <paper-input id="postCode"
                        type="text"
                        label="${this.localize("postCode")}"
                        value="${this.postCode}"
                        maxlength="${this.configFromServer.client_config.insecureEmailPostcodeMaxLength}">
          </paper-input>

          <div class="postcodeWrongWard" ?hidden="${!this.correctAreaId}">
            ${this.localize("thisPostCodeDoesNotBelongTo")} ${this.areaName}.<br><br>
            ${this.localize("forThisCodeYouCanVoteHere")} <a href="/area-ballot/${this.correctAreaId}" @click="${this._resetCorrectArea}">${this.correctAreaName}</a>
            ${this.localize("orEnterApostCodeThatBelongsTo")} ${this.areaName}.
          </div>

          ${this.configFromServer.client_config.insecureEmailAgeLimit?html$1`
            <paper-checkbox id="confirmedAge" class="checkBox" name="confirmedAge">
              ${this.localize("confirmAge")}
            </paper-checkbox>
          `:html$1``}


        </form>
        <div class="buttons layout vertical">
          <paper-button autofocus @tap="${this._validateAndSend}">${this.localize("authenticateAndVote")}</paper-button>
        </div>
      </paper-dialog>
    `}updated(changedProps){super.updated(changedProps)}firstUpdated(){super.firstUpdated();Object.entries(this.configFromServer.client_config.insecureEmailLoginPostCodes).forEach(entry=>{let areaId=entry[0],postCodes=entry[1];postCodes.forEach(postCode=>{this.postCodesAreas[postCode]=areaId;this.postCodesAreasNames[postCode]=this.configFromServer.client_config.insecureEmailLoginAreaNames[areaId]})})}constructor(){super();this.emailValidationPattern="^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";this.confirmedAge=!1;this.postCodesAreas={};this.postCodesAreasNames={}}_resetCorrectArea(){setTimeout(()=>{this.correctAreaId=null;this.correctAreaName=null;this.close()},100)}_loginCompleted(){this.onLoginFunction();this.close()}isValidPostcode(areaId,postCode){postCode=postCode.replace(/\s/g,"").toUpperCase();return-1<this.configFromServer.client_config.insecureEmailLoginPostCodes[areaId].indexOf(postCode)}getAreaForPostCode(postCode){postCode=postCode.replace(/\s/g,"").toUpperCase();if(this.postCodesAreas[postCode]&&this.postCodesAreasNames[postCode]){return{id:this.postCodesAreas[postCode],name:this.postCodesAreasNames[postCode]}}else{return null}}open(areaId,areaName,onLoginFunction){this.onLoginFunction=onLoginFunction;this.areaId=areaId;this.areaName=areaName;this.userSpinner=!1;this.opened=!1;this.postCode="";this.confirmedAge=!1;this.email="";this.$$("#dialog").open()}_validateAndSend(e){this.email=this.$$("#email").value;this.postCode=this.$$("#postCode").value;if(this.email&&this.postCode&&this.$$("#confirmedAge").checked){const re=new RegExp(this.emailValidationPattern);if(re.test(this.email)){if(this.isValidPostcode(this.areaId,this.postCode)){fetch("/votes/insecure_email_login",{method:"POST",cache:"no-cache",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({insecure_email:this.email.toLowerCase(),postCode:this.postCode})}).then(response=>response.json()).then(response=>{if(response&&!0===response.ok){this._loginCompleted()}else{this.fire("oav-error",this.localize("error_not_authorized"))}}).catch(()=>{this.fire("oav-error",this.localize("general_error"))});return!0}else if(this.getAreaForPostCode(this.postCode)){var areaInfo=this.getAreaForPostCode(this.postCode);this.correctAreaId=areaInfo.id;this.correctAreaName=areaInfo.name}else{this.fire("oav-error",this.localize("enterValidPostcode"))}}else{this.fire("oav-error",this.localize("enterValidEmail"))}}else{this.fire("oav-error",this.localize("completeForm"));return!1}}close(){var dialog=this.$$("#dialog");if(dialog){dialog.close()}this.opened=!1;this.userSpinner=!1}}window.customElements.define("oap-insecure-email-login",OapInsecureEmailLogin);export{oapInsecureEmailLoginStyles as $oapInsecureEmailLoginStyles,OapInsecureEmailLoginStyles};