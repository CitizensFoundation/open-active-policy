// Code originally from https://www.outsystems.com/blog/posts/gestures_glamour_swipeable_stacked_cards/
/**
@license
Copyright (c) 2010-2019 Citizens Foundation. AGPL License. All rights reserved.
*/
import { html } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { OapBaseElement } from '../oap-base-element';
import { OapSwipableCardsStyles } from './oap-swipable-cards-styles';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';

import '@polymer/paper-icon-button';

import '../oap-icons';
import { GetBonusesAndPenaltiesForItem } from '../oap-bonuses-and-penalties';
import { OapFlexLayout } from '../oap-flex-layout';

class OapSwipableCards extends OapBaseElement {

  static get properties() {
    return {
      stackedOptions: String,
      rotate: Boolean,
      items: Array,
      itemsLeft: Array,
      visibleItems: Array,
      elementsMargin: Number,
      useOverlays: Boolean,
      maxElements: Number,
      currentPosition: Number,
      currentItemsPosition: Number,
      currentItem: Object,
      isFirstTime: Boolean,
      elementHeight: Number,
      velocity: Number,
      topObj: Object,
      rightObj: Object,
      leftObj: Object,
      listElNodesObj: Object,
      listElNodesWidth: Object,
      currentElementObj: Object,
      stackedCardsObj: Object,
      obj: Object,
      elTrans: Object,
      startTime: Number,
      startX: Number,
      startY: Number,
      translateX: Number,
      translateY: Number,
      currentX: Number,
      currentY: Number,
      timeTaken: Number,
      rightOpacity: Number,
      leftOpacity: Number,
      touchingElement: Boolean,
      disableUpSwipe: Boolean,
      hiddenImageIds: Object,
      rendering: Boolean,
      configFromServer: Object,
      automaticSelectionActive: Boolean,
      country: Object
    }
  }

  static get styles() {
    return [
      OapSwipableCardsStyles,
      OapFlexLayout
    ];
  }

  render() {
    return html`
    <div class="toppestContainer">
      <div class="stage">
          <div class="title">${this.localize("filterArticles")}</div>
            <div id="stacked-cards-block" class="stackedcards stackedcards--animatable init">
              <div class="stackedcards-container">
                ${repeat(this.visibleItems, (item) => item.id, (item, index) =>
                  html`
                    <div class="card" id="card${item.id}" style="${this.getCardStyle(item)}">
                      <div class="card-content">
                        <div id="imageContainer${item.id}" ?hidden="${item.module_type=="ModuleTypeCard"}" class="card-imagse"><img id="image${item.id}" class="cardImage" src="${item.image_url}"/></div>
                        <div class="cardTitles" ?module-type="${item.module_type=="ModuleTypeCard"}">
                          <div id="moduleName" class="name" ?module-type="${item.module_type=="ModuleTypeCard"}">${item.name}</div>
                          <div id="description${item.id}" class="description" ?module-type="${item.module_type=="ModuleTypeCard"}">${unsafeHTML(item.description)}</div>
                        </div>
                      ${(item.module_type==="ModuleTypeCard") ? html`
                        <div style="text-align:center" class="global-asctions  vertical center-center actionButtonContainer">
                          <div class="moduleSelectionTitle">${this.localize("moduleSelection")}</div>
                          <div class="layout  horizontal actionButtonInnerContainer">
                            <div class="left-actionx vertical">
                              <paper-button id="autoSelectionButton" class="typeButtons" @click="${this.startAutoSelection}">${this.localize("autoMaticCardSelection")}</paper-button>
                              <div class="winInfo">${this.localize("automaticInfo")}</div>
                            </div>
                            <div class="right-actionx vertical">
                              <paper-button id="manualSelectionButton" class="typeButtons" @click="${this.startManualSelection}">${this.localize("manualSelection")}</paper-button>
                              <div class="winInfo">${this.localize("win")} 3cp</div>
                            </div>
                          </div>
                        </div>
                        ` : html`` }
                      </div>
                    </div>
                  `
                )}
              </div>
              <div class="stackedcards--animatable stackedcards-overlay top"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png"  width="auto" height="auto"/></div>
              <div class="stackedcards--animatable stackedcards-overlay right"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="100" height="100"/></div>
              <div class="stackedcards--animatable stackedcards-overlay left"><img src="https://image.ibb.co/heTxf7/20_status_close_3x.png" width="auto" height="auto"/></div>
            </div>
            <div id="navigator" class="mainNavigator layout horizontal"></div>
            <div class="global-actions" ?hidden="${this.automaticSelectionActive===true || (this.currentItem && this.currentItem.module_type==="ModuleTypeCard")}">
              <div class="left-action"><img src="https://image.ibb.co/heTxf7/20_status_close_3x.png" width="26" height="26"/>
              </div>
              <div hidden>
                <div ?hidden="${this.disableUpSwipe}" class="top-action"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="18" height="16"/>
                </div>
              </div>
              <div style="width: 100px;">
               </div>
              <div class="right-action"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="30" height="28"/>
              </div>
            </div>
        </div>

      <div class="final-state hidden"><h2>${this.localize("filterArticlesDone")}</h2></div>
    </div>

    `;
  }

  constructor() {
    super();
    this.reset();
  }

  disconnectedCallback() {
    this.removeEventListeners();
    super.disconnectedCallback();
  }

  getCardStyle(item) {
    if (item.module_type==="ModuleTypeCard") {
      const color = this.configFromServer.client_config.moduleTypeColorLookup[item.module_content_type];
      return "color: #FFF;font-size: 20px;background-color:"+color;
    } else {
      return "";
    }
  }

  startAutomaticSelection() {
    this.automaticallySelectNext();
    this.removeEventListeners();
  }

  startManualSelection() {
    this.$$("#manualSelectionButton").disabled = true;
    this.fire("oap-bonus-points", 3);
    this.onActionTop(true);
    this.addEventListeners();
    setTimeout(()=>{
      if (this.$$("#manualSelectionButton"))
        this.$$("#manualSelectionButton").disabled = false;
    }, 750);
  }

  startAutoSelection() {
    this.$$("#autoSelectionButton").disabled = true;
    setTimeout(()=>{
      if (this.$$("#autoSelectionButton"))
        this.$$("#autoSelectionButton").disabled = false;
    }, 750);
    this.automaticallySelectNext();
  }

  automaticallySelectNext() {
    let futureModuleType;
    let currentModuleTypeCard;
    if (this.currentItemsPosition<this.items.length-1) {
      futureModuleType = this.items[this.currentItemsPosition].module_type;
      currentModuleTypeCard=this.items[this.currentItemsPosition].module_type==="ModuleTypeCard";
    }

    if ((currentModuleTypeCard && !this.automaticSelectionActive) || (this.items[this.currentItemsPosition] && futureModuleType!=="ModuleTypeCard")) {
      this.automaticSelectionActive = true;

      let random = Math.floor(Math.random() * 2);
      const bonusCount = GetBonusesAndPenaltiesForItem(this.items[this.currentItemsPosition], this.country).bonusCount;

      if (currentModuleTypeCard) {
        this.onActionTop(true);
      } else if (bonusCount===0 && Math.random()<0.7) {
        this.onActionLeft();
      } else {
        this.onActionRight();
      }
      setTimeout(()=>{
          this.automaticallySelectNext();
      }, window.debugOn===true ? 300 : 400);
    } else {
      this.automaticSelectionActive = false;
    }
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('currentItem')) {
      if (this.currentItem && this.currentItem.module_type==="ModuleTypeCard") {
        this.removeEventListeners();
      }
    }

    if (changedProps.has('items')) {
      if (this.items && this.items.length>0) {
        if (this.currentItemsPosition===0)
          this.currentItem = this.items[0];
        this.itemsLeft = [...this.items];
        this.visibleItems=this.itemsLeft.slice(0, 5);
        this.itemsLeft.shift();
        this.itemsLeft.shift();
        this.itemsLeft.shift();
        this.itemsLeft.shift();
        this.itemsLeft.shift();
        //TODO: Only show first 20 items and reload on demand
        this.requestUpdate();
        this.updateComplete.then(() => {
          this.activate();
          this.updateNavigator();
        });
      }
    }
  }

  updateNavigator() {
    const color = this.configFromServer.client_config.moduleTypeColorLookup[this.items[this.currentItemsPosition].module_content_type];
    this.$$("#moduleName").title = this.items[this.currentItemsPosition].module_content_type;
    const navigatorDiv = this.$$("#navigator");
    while (navigatorDiv.firstChild) {
      navigatorDiv.removeChild(navigatorDiv.firstChild);
    }
    let leftItems;
    if (this.itemsLeft.length>0) {
      leftItems = this.visibleItems.concat(this.itemsLeft);
    } else {
      leftItems = this.visibleItems.slice(1, Math.abs(6-this.currentPosition));
    }
    const pixels = 310.0/this.items.length;
    leftItems.forEach((item,index) => {
      const div = document.createElement("span");
      div.style.backgroundColor = this.configFromServer.client_config.moduleTypeColorLookup[item.module_content_type];
      if (index===0) {
        div.style.width = pixels+5+"px";
        div.style.height = "8px";
        div.title = item.name;
      } else {
        div.style.width = pixels+"px";
        div.style.height = "8px";
        div.title = item.module_content_type;
      }
      div.onclick = (event) => {
        //this.goTo(item.id);
      }
      navigatorDiv.appendChild(div);
    });
  }

  reset() {
    this.stackedOptions = 'Top';
    this.rotate = true;
    this.elementsMargin = 7;
    this.currentPosition = 0;
    this.currentItemsPosition = 0;
    this.currentItem=null;
    this.useOverlays = false;
    this.velocity = 0.3;
    this.isFirstTime = true;
    this.touchingElement = false;
    this.visibleItems = [];
    this.disableUpSwipe = true;
    this.hiddenImageIds = {};
    this.rendering = true;
    this.automaticSelectionActive = false;
  }

  activate() {
    this.obj = this.$$("#stacked-cards-block");

    this.refresh();

		if(this.useOverlays){
			this.leftObj.style.transform = 'translateX(0px) translateY(' + this.elTrans + 'px) translateZ(0px) rotate(0deg)';
			this.leftObj.style.webkitTransform = 'translateX(0px) translateY(' + this.elTrans + 'px) translateZ(0px) rotate(0deg)';

			this.rightObj.style.transform = 'translateX(0px) translateY(' + this.elTrans + 'px) translateZ(0px) rotate(0deg)';
			this.rightObj.style.webkitTransform = 'translateX(0px) translateY(' + this.elTrans + 'px) translateZ(0px) rotate(0deg)';

			this.topObj.style.transform = 'translateX(0px) translateY(' + this.elTrans + 'px) translateZ(0px) rotate(0deg)';
			this.topObj.style.webkitTransform = 'translateX(0px) translateY(' + this.elTrans + 'px) translateZ(0px) rotate(0deg)';

		} else if (this.leftObj) {
			this.leftObj.className = '';
			this.rightObj.className = '';
			this.topObj.className = '';

			this.leftObj.classList.add('stackedcards-overlay-hidden');
			this.rightObj.classList.add('stackedcards-overlay-hidden');
			this.topObj.classList.add('stackedcards-overlay-hidden');
		}

		//Remove class init
		setTimeout(function() {
			this.obj.classList.remove('init');
    }.bind(this), 250);

   //this.addEventListeners();
  }

  isImageHidden(imageId) {
    return this.hiddenImageIds[imageId]!=null;
  }

  hideImage(imageId) {
    const item = this.$$("#image"+imageId);
    if (item) {
      item.classList.add("imageCollapsed");
      this.hiddenImageIds[imageId]=true;
      const description = this.$$("#description"+imageId);
      description.classList.add("fullsizeDescription");
      this.requestUpdate();
    }
  }

  unhideImage(imageId) {
    const item = this.$$("#image"+imageId);
    if (item) {
      item.classList.remove("imageCollapsed");
      this.hiddenImageIds[imageId]=null;
      const description = this.$$("#description"+imageId);
      description.classList.remove("fullsizeDescription");
      this.requestUpdate();
    }
  }

  refresh() {
		this.stackedCardsObj = this.obj.querySelector('.stackedcards-container');
    this.listElNodesObj = this.stackedCardsObj.children;

		this.topObj = this.obj.querySelector('.stackedcards-overlay.top');
		this.rightObj = this.obj.querySelector('.stackedcards-overlay.right');
		this.leftObj = this.obj.querySelector('.stackedcards-overlay.left');

		this.countElements();
		this.setCurrentElement();
    this.changeBackground();
		this.listElNodesWidth = this.stackedCardsObj.offsetWidth;
		this.currentElementObj = this.listElNodesObj[0];
		this.updateUi();

		//Prepare elements on DOM
    var addMargin = this.elementsMargin * (this.visibleItems.length -1) + 'px';
    var i;

		if(this.stackedOptions === "Top"){

			for(i = this.visibleItems.length; i < this.maxElements; i++){
				this.listElNodesObj[i].classList.add('stackedcards-top', 'stackedcards--animatable', 'stackedcards-origin-top');
			}

			this.elTrans = this.elementsMargin * (this.visibleItems.length - 1);

			this.stackedCardsObj.style.marginBottom = addMargin;

		} else if(this.stackedOptions === "Bottom"){


			for(i = this.visibleItems.length; i < this.maxElements; i++){
				this.listElNodesObj[i].classList.add('stackedcards-bottom', 'stackedcards--animatable', 'stackedcards-origin-bottom');
			}

			this.elTrans = 0;

			this.stackedCardsObj.style.marginBottom = addMargin;

		} else if (this.stackedOptions === "None"){

			for(i = this.visibleItems.length; i < this.maxElements; i++){
				this.listElNodesObj[i].classList.add('stackedcards-none', 'stackedcards--animatable');
			}

			this.elTrans = 0;

		}

		for(i = this.visibleItems.length; i < this.maxElements; i++){
			this.listElNodesObj[i].style.zIndex = 0;
			this.listElNodesObj[i].style.opacity = 0;
			this.listElNodesObj[i].style.webkitTransform ='scale(' + (1 - (this.visibleItems.length * 0.04)) +') translateX(0) translateY(' + this.elTrans + 'px) translateZ(0)';
			this.listElNodesObj[i].style.transform ='scale(' + (1 - (this.visibleItems.length * 0.04)) +') translateX(0) translateY(' + this.elTrans + 'px) translateZ(0)';
		}

		if(this.listElNodesObj[this.currentPosition]){
			this.listElNodesObj[this.currentPosition].classList.add('stackedcards-active');
    }

    setTimeout(function() {
			this.obj.classList.remove('init');
    }.bind(this), 250);

  }

  addEventListeners() {
    console.error("Add event listeners");
     // JavaScript Document
    this.gestureStartHandler = this.gestureStart.bind(this);
    this.gestureMoveHandler = this.gestureMove.bind(this);
    this.gestureEndHandler = this.gestureEnd.bind(this);
		this.$$("#stacked-cards-block").addEventListener('touchstart', this.gestureStartHandler, {passive: true});
		this.$$("#stacked-cards-block").addEventListener('touchmove', this.gestureMoveHandler, {passive: true});
		this.$$("#stacked-cards-block").addEventListener('touchend', this.gestureEndHandler, {passive: true});

		//Add listeners to call global action for swipe cards
		var buttonLeft = this.$$('.left-action');
		var buttonTop = this.$$('.top-action');
		var buttonRight = this.$$('.right-action');

    buttonLeft.addEventListener('click', this.onActionLeft.bind(this), false);
    if (!this.disableUpSwipe) {
      buttonTop.addEventListener('click', this.onActionTop.bind(this), false);
    }
    buttonRight.addEventListener('click', this.onActionRight.bind(this), false);
  }

  removeEventListeners() {
    // JavaScript Document
    console.error("Remove eventlisteners");
    if (this.gestureStartHandler) {
      this.$$("#stacked-cards-block").removeEventListener('touchstart', this.gestureStartHandler, {passive: true});
      this.$$("#stacked-cards-block").removeEventListener('touchmove', this.gestureMoveHandler, {passive: true});
      this.$$("#stacked-cards-block").removeEventListener('touchend', this.gestureEndHandler, {passive: true});
      this.gestureStartHandler = null;
      this.gestureMoveHandler = null;
      this.gestureEndHandler = null;
      console.error("Remove eventlisteners DONE");
    }

   var buttonLeft = this.$$('.left-action');
   var buttonTop = this.$$('.top-action');
   var buttonRight = this.$$('.right-action');

   if (buttonLeft) {
    buttonLeft.removeEventListener('click', this.onActionLeft.bind(this), false);
    if (!this.disableUpSwipe) {
      buttonTop.removeEventListener('click', this.onActionTop.bind(this), false);
    }
    buttonRight.removeEventListener('click', this.onActionRight.bind(this), false);
   } else {
     console.error("No buttons to detach from");
   }
 }

  backToMiddle() {

    this.removeNoTransition();
    this.transformUi(0, 0, 1, this.currentElementObj);

    if(this.useOverlays){
      this.transformUi(0, 0, 0, this.leftObj);
      this.transformUi(0, 0, 0, this.rightObj);
      this.transformUi(0, 0, 0, this.topObj);
    }

    this.setZindex(5);

    if(!(this.currentPosition >= this.maxElements)){
      //roll back the opacity of second element
      if((this.currentPosition + 1) < this.maxElements){
        this.listElNodesObj[this.currentPosition + 1].style.opacity = '.8';
      }
    }
  }

  // Usable functions
  countElements() {
    this.maxElements = this.listElNodesObj.length;

    if(this.visibleItems.length > this.maxElements){
      this.visibleItems.length = this.maxElements;
    }
  }

  //Keep the active card.
  setCurrentElement() {
    this.currentElementObj = this.listElNodesObj[this.currentPosition];
  }

  //Change background for each swipe.
  changeBackground() {
    this.classList.add("background-" + this.currentPosition + "");
  }

  //Change states
  changeStages() {
    if(this.currentPosition == this.maxElements){
        this.fire("completed");
        //Event listener created to know when transition ends and changes states
        this.listElNodesObj[this.maxElements - 1].addEventListener('transitionend', function(){
          this.classList.add("background-7");
          this.$$('.stage').classList.add('hidden');
          this.$$('.final-state').classList.remove('hidden');
          this.$$('.final-state').classList.add('active');
          this.listElNodesObj[this.maxElements - 1].removeEventListener('transitionend', null, false);
      }.bind(this));
    }
  }

  //Functions to swipe left elements on logic external action.
  onActionLeft() {
    if(!(this.currentPosition >= this.maxElements)){
      if(this.useOverlays) {
        this.leftObj.classList.remove('no-transition');
        this.topObj.classList.remove('no-transition');
        this.leftObj.style.zIndex = '8';
        this.transformUi(0, 0, 1, this.leftObj);

      }

      setTimeout(function() {
        this.onSwipeLeft();
        this.resetOverlayLeft();
      }.bind(this),300);
    }
  }

  //Functions to swipe right elements on logic external action.
  onActionRight() {
    if(!(this.currentPosition >= this.maxElements)){
      if(this.useOverlays) {
        this.rightObj.classList.remove('no-transition');
        this.topObj.classList.remove('no-transition');
        this.rightObj.style.zIndex = '8';
        this.transformUi(0, 0, 1, this.rightObj);
      }

      setTimeout(function(){
        this.onSwipeRight();
        this.resetOverlayRight();
      }.bind(this),300);
    }
  }

  //Functions to swipe top elements on logic external action.
  onActionTop(force) {
    if(!(this.currentPosition >= this.maxElements)){
      if(this.useOverlays) {
        this.leftObj.classList.remove('no-transition');
        this.rightObj.classList.remove('no-transition');
        this.topObj.classList.remove('no-transition');
        this.topObj.style.zIndex = '8';
        this.transformUi(0, 0, 1, this.topObj);
      }

      setTimeout(function(){
        this.onSwipeTop(force);
        this.resetOverlays();
      }.bind(this),300); //wait animations end
    }
  }

  //Swipe active card to left.
  onSwipeLeft() {
    this.removeNoTransition();
    this.transformUi(-1000, 0, 0, this.currentElementObj);
    if(this.useOverlays){
      this.transformUi(-1000, 0, 0, this.leftObj); //Move leftOverlay
      this.transformUi(-1000, 0, 0, this.topObj); //Move topOverlay
      this.resetOverlayLeft();
    }
    this.fire('item-discarded', this.items[this.currentItemsPosition]);
    this.currentPosition = this.currentPosition + 1;
    this.currentItemsPosition = this.currentItemsPosition + 1;
    this.currentItem = this.items[this.currentItemsPosition];
    this.updateFromMainItemsList();
    this.activity('swipeLeft', 'filtering');
  }

  updateFromMainItemsList() {
    this.updateUi();
    this.setCurrentElement();
    this.changeBackground();
    this.changeStages();
    this.setActiveHidden();

    setTimeout(()=> {
      this.requestUpdate();
      this.updateComplete.then(() => {
        if (this.itemsLeft.length>0) {
          this.visibleItems.push(this.itemsLeft.shift());
          this.visibleItems.shift();
          this.currentPosition = 0;
          this.requestUpdate();
          this.updateComplete.then(() => {
            this.refresh();
            this.updateNavigator();
            this.requestUpdate();
         });
        }
      });
    }, 300);
  }

  //Swipe active card to right.
  onSwipeRight() {
    this.removeNoTransition();
    this.transformUi(1000, 0, 0, this.currentElementObj);
    if(this.useOverlays){
      this.transformUi(1000, 0, 0, this.rightObj); //Move rightOverlay
      this.transformUi(1000, 0, 0, this.topObj); //Move topOverlay
      this.resetOverlayRight();
    }
    this.fire('item-selected', this.items[this.currentItemsPosition]);

    this.currentPosition = this.currentPosition + 1;
    this.currentItemsPosition = this.currentItemsPosition + 1;
    this.currentItem = this.items[this.currentItemsPosition];
    this.updateUi();
    this.setCurrentElement();
    this.updateFromMainItemsList();
    this.activity('swipeRight', 'filtering');
  }

  //Swipe active card to top.
  onSwipeTop(forceUp) {
    if (!this.disableUpSwipe || forceUp) {
      this.removeNoTransition();
      this.transformUi(0, -1000, 0, this.currentElementObj);
      if(this.useOverlays){
        this.transformUi(0, -1000, 0, this.leftObj); //Move leftOverlay
        this.transformUi(0, -1000, 0, this.rightObj); //Move rightOverlay
        this.transformUi(0, -1000, 0, this.topObj); //Move topOverlay
        this.resetOverlays();
      }

      this.fire('item-bookmarked', this.items[this.currentItemsPosition]);
      this.currentPosition = this.currentPosition + 1;
      this.currentItemsPosition = this.currentItemsPosition + 1;
      this.currentItem = this.items[this.currentItemsPosition];
      this.updateUi();
      this.setCurrentElement();
      this.updateFromMainItemsList();
      this.activity('swipeUp', 'filtering');
    }
  }

  //Remove transitions from all elements to be moved in each swipe movement to improve perfomance of stacked cards.
  removeNoTransition() {
    if(this.listElNodesObj[this.currentPosition]){

      if(this.useOverlays) {
        this.leftObj.classList.remove('no-transition');
        this.rightObj.classList.remove('no-transition');
        this.topObj.classList.remove('no-transition');
      }

      this.listElNodesObj[this.currentPosition].classList.remove('no-transition');
      this.listElNodesObj[this.currentPosition].style.zIndex = 6;
    }

  }

  //Move the overlay left to initial position.
  resetOverlayLeft() {
    if(!(this.currentPosition >= this.maxElements)){
      if(this.useOverlays){
        setTimeout(function(){

          if(this.stackedOptions === "Top"){

            this.elTrans = this.elementsMargin * (this.visibleItems.length - 1);

          } else if(this.stackedOptions === "Bottom" || this.stackedOptions === "None"){

            this.elTrans = 0;

          }

          if(!this.isFirstTime){

            this.leftObj.classList.add('no-transition');
            this.topObj.classList.add('no-transition');

          }

          requestAnimationFrame(function(){

            this.leftObj.style.transform = "translateX(0) translateY(" + this.elTrans + "px) translateZ(0)";
            this.leftObj.style.webkitTransform = "translateX(0) translateY(" + this.elTrans + "px) translateZ(0)";
            this.leftObj.style.opacity = '0';

            this.topObj.style.transform = "translateX(0) translateY(" + this.elTrans + "px) translateZ(0)";
            this.topObj.style.webkitTransform = "translateX(0) translateY(" + this.elTrans + "px) translateZ(0)";
            this.topObj.style.opacity = '0';

          }.bind(this));

        }.bind(this),300);

        this.isFirstTime = false;
      }
    }
    }

  //Move the overlay right to initial position.
  resetOverlayRight() {
    if(!(this.currentPosition >= this.maxElements)){
      if(this.useOverlays){
        setTimeout(function(){

          if(this.stackedOptions === "Top"){+2

            this.elTrans = this.elementsMargin * (this.visibleItems.length - 1);

          } else if(this.stackedOptions === "Bottom" || this.stackedOptions === "None"){

            this.elTrans = 0;

          }

          if(!this.isFirstTime){

            this.rightObj.classList.add('no-transition');
            this.topObj.classList.add('no-transition');

          }

          requestAnimationFrame(function(){

            this.rightObj.style.transform = "translateX(0) translateY(" + this.elTrans + "px) translateZ(0)";
            this.rightObj.style.webkitTransform = "translateX(0) translateY(" + this.elTrans + "px) translateZ(0)";
            this.rightObj.style.opacity = '0';

            this.topObj.style.transform = "translateX(0) translateY(" + this.elTrans + "px) translateZ(0)";
            this.topObj.style.webkitTransform = "translateX(0) translateY(" + this.elTrans + "px) translateZ(0)";
            this.topObj.style.opacity = '0';

          }.bind(this));

        }.bind(this),300);

        this.isFirstTime = false;
      }
    }
    }

  //Move the overlays to initial position.
  resetOverlays() {
    if(!(this.currentPosition >= this.maxElements)){
      if(this.useOverlays){

        setTimeout(function(){
          if(this.stackedOptions === "Top"){

            this.elTrans = this.elementsMargin * (this.visibleItems.length - 1);

          } else if(this.stackedOptions === "Bottom" || this.stackedOptions === "None"){

            this.elTrans = 0;

          }

          if(!this.isFirstTime){

            this.leftObj.classList.add('no-transition');
            this.rightObj.classList.add('no-transition');
            this.topObj.classList.add('no-transition');

          }

          requestAnimationFrame(function(){

            this.leftObj.style.transform = "translateX(0) translateY(" + this.elTrans + "px) translateZ(0)";
            this.leftObj.style.webkitTransform = "translateX(0) translateY(" + this.elTrans + "px) translateZ(0)";
            this.leftObj.style.opacity = '0';

            this.rightObj.style.transform = "translateX(0) translateY(" + this.elTrans + "px) translateZ(0)";
            this.rightObj.style.webkitTransform = "translateX(0) translateY(" + this.elTrans + "px) translateZ(0)";
            this.rightObj.style.opacity = '0';

            this.topObj.style.transform = "translateX(0) translateY(" + this.elTrans + "px) translateZ(0)";
            this.topObj.style.webkitTransform = "translateX(0) translateY(" + this.elTrans + "px) translateZ(0)";
            this.topObj.style.opacity = '0';

          }.bind(this));

        }.bind(this),300);	// wait for animations time

        this.isFirstTime = false;
      }
    }
    }

  setActiveHidden() {
    if(!(this.currentPosition >= this.maxElements)){
      this.listElNodesObj[this.currentPosition - 1].classList.remove('stackedcards-active');
      this.listElNodesObj[this.currentPosition - 1].classList.add('stackedcards-hidden');
      this.listElNodesObj[this.currentPosition].classList.add('stackedcards-active');
    }
  }

  //Set the new z-index for specific card.
  setZindex(zIndex) {
    if(this.listElNodesObj[this.currentPosition]){
      this.listElNodesObj[this.currentPosition].style.zIndex = zIndex;
    }
  }

  // Remove element from the DOM after swipe. To use this method you need to call this in onSwipeLeft, onSwipeRight and onSwipeTop and put the method just above the variable 'this.currentPosition = this.currentPosition + 1'.
  //On the actions onSwipeLeft, onSwipeRight and onSwipeTop you need to remove the this.currentPosition variable (this.currentPosition = this.currentPosition + 1) and the setActiveHidden

  removeElement() {
    this.currentElementObj.remove();
    if(!(this.currentPosition >= this.maxElements)){
      this.listElNodesObj[this.currentPosition].classList.add('stackedcards-active');
    }
  }

  //Add translate X and Y to active card for each frame.
  transformUi(moveX,moveY,opacity,elementObj) {
    requestAnimationFrame( function(){
      var element = elementObj;

      // Function to generate rotate value
      function RotateRegulator(value) {
          if(value/10 > 15) {
            return 15;
          }
          else if(value/10 < -15) {
            return -15;
          }
          return value/10;
      }

      var rotateElement;

      if(this.rotate){
        rotateElement = RotateRegulator(moveX);
      } else {
        rotateElement = 0;
      }

      if(this.stackedOptions === "Top"){
        this.elTrans = this.elementsMargin * (5);
        if(element){
          element.style.webkitTransform = "translateX(" + moveX + "px) translateY(" + (moveY + this.elTrans) + "px) translateZ(0) rotate(" + rotateElement + "deg)";
          element.style.transform = "translateX(" + moveX + "px) translateY(" + (moveY + this.elTrans) + "px) translateZ(0) rotate(" + rotateElement + "deg)";
          element.style.opacity = opacity;
        }
      } else if(this.stackedOptions === "Bottom" || this.stackedOptions === "None"){

        if(element){
          element.style.webkitTransform = "translateX(" + moveX + "px) translateY(" + (moveY) + "px) translateZ(0) rotate(" + rotateElement + "deg)";
          element.style.transform = "translateX(" + moveX + "px) translateY(" + (moveY) + "px) translateZ(0) rotate(" + rotateElement + "deg)";
          element.style.opacity = opacity;
        }

      }
    }.bind(this));
  }

  //Action to update all elements on the DOM for each stacked card.
  updateUi() {
    requestAnimationFrame(function(){
      this.elTrans = 0;
      var elZindex = 5;
      var elScale = 1;
      var elOpac = 1;
      var elTransTop = this.visibleItems.length;
      var elTransInc = this.elementsMargin;

      var i;

      for(i = this.currentPosition; i < (this.currentPosition + this.visibleItems.length); i++){
        if(this.listElNodesObj[i]){
          if(this.stackedOptions === "Top"){

            this.listElNodesObj[i].classList.add('stackedcards-top', 'stackedcards--animatable', 'stackedcards-origin-top');

            if(this.useOverlays){
              this.leftObj.classList.add('stackedcards-origin-top');
              this.rightObj.classList.add('stackedcards-origin-top');
              this.topObj.classList.add('stackedcards-origin-top');
            }

            this.elTrans = elTransInc * elTransTop;
            elTransTop--;

          } else if(this.stackedOptions === "Bottom"){
            this.listElNodesObj[i].classList.add('stackedcards-bottom', 'stackedcards--animatable', 'stackedcards-origin-bottom');

            if(this.useOverlays){
              this.leftObj.classList.add('stackedcards-origin-bottom');
              this.rightObj.classList.add('stackedcards-origin-bottom');
              this.topObj.classList.add('stackedcards-origin-bottom');
            }

            this.elTrans = this.elTrans + elTransInc;

          } else if (this.stackedOptions === "None"){

            this.listElNodesObj[i].classList.add('stackedcards-none', 'stackedcards--animatable');
            this.elTrans = this.elTrans + elTransInc;

          }

          this.listElNodesObj[i].style.transform ='scale(' + elScale + ') translateX(0) translateY(' + (this.elTrans - elTransInc) + 'px) translateZ(0)';
          this.listElNodesObj[i].style.webkitTransform ='scale(' + elScale + ') translateX(0) translateY(' + (this.elTrans - elTransInc) + 'px) translateZ(0)';
          this.listElNodesObj[i].style.opacity = elOpac;
          this.listElNodesObj[i].style.zIndex = elZindex;

          elScale = elScale - 0.04;
          elOpac = elOpac - (1 / this.visibleItems.length);
          elZindex--;
        }
      }
    }.bind(this));

  }

  setOverlayOpacity() {

    this.topOpacity = (((this.translateY + (this.elementHeight) / 2) / 100) * -1);
    this.rightOpacity = this.translateX / 100;
    this.leftOpacity = ((this.translateX / 100) * -1);


    if(this.topOpacity > 1) {
      this.topOpacity = 1;
    }

    if(this.rightOpacity > 1) {
      this.rightOpacity = 1;
    }

    if(this.leftOpacity > 1) {
      this.leftOpacity = 1;
    }
  }

  gestureStart(evt) {
    this.startTime = new Date().getTime();

    this.startX = evt.changedTouches[0].clientX;
    this.startY = evt.changedTouches[0].clientY;

    this.currentX = this.startX;
    this.currentY = this.startY;

    this.setOverlayOpacity();

    this.touchingElement = true;
    if(!(this.currentPosition >= this.maxElements)){
      if(this.listElNodesObj[this.currentPosition]){
        this.listElNodesObj[this.currentPosition].classList.add('no-transition');
        this.setZindex(6);

        if(this.useOverlays){
          this.leftObj.classList.add('no-transition');
          this.rightObj.classList.add('no-transition');
          this.topObj.classList.add('no-transition');
        }

        if((this.currentPosition + 1) < this.maxElements){
          this.listElNodesObj[this.currentPosition + 1].style.opacity = '1';
        }

        this.elementHeight = this.listElNodesObj[this.currentPosition].offsetHeight / 3;
      }

    }

  }

  gestureMove(evt) {
    this.currentX = evt.changedTouches[0].pageX;
    this.currentY = evt.changedTouches[0].pageY;

    this.translateX = this.currentX - this.startX;
    this.translateY = this.currentY - this.startY;

    this.setOverlayOpacity();

    if(!(this.currentPosition >= this.maxElements)){
      //evt.preventDefault();
      this.transformUi(this.translateX, this.translateY, 1, this.currentElementObj);

      if(this.useOverlays){
        this.transformUi(this.translateX, this.translateY, this.topOpacity, this.topObj);

        if(this.translateX < 0){
          this.transformUi(this.translateX, this.translateY, this.leftOpacity, this.leftObj);
          this.transformUi(0, 0, 0, this.rightObj);

        } else if(this.translateX > 0){
          this.transformUi(this.translateX, this.translateY, this.rightOpacity, this.rightObj);
          this.transformUi(0, 0, 0, this.leftObj);
        }

        if(this.useOverlays){
          this.leftObj.style.zIndex = 8;
          this.rightObj.style.zIndex = 8;
          this.topObj.style.zIndex = 7;
        }

      }

    }

  }

  gestureEnd(evt) {

    if(!this.touchingElement){
      return;
    }

    this.translateX = this.currentX - this.startX;
    this.translateY = this.currentY - this.startY;

    this.timeTaken = new Date().getTime() - this.startTime;

    this.touchingElement = false;

    if(!(this.currentPosition >= this.maxElements)){
      if(this.translateY < (this.elementHeight * -1) && this.translateX > ((this.listElNodesWidth / 2) * -1) && this.translateX < (this.listElNodesWidth / 2)){  //is Top?

        if(this.translateY < (this.elementHeight * -1) || (Math.abs(this.translateY) / this.timeTaken > this.velocity)){ // Did It Move To Top?
          if (this.disableUpSwipe) {
            this.backToMiddle();
          } else {
            this.onSwipeTop();
          }
        } else {
          this.backToMiddle();
        }

      } else {

        if(this.translateX < 0){
          if(this.translateX < ((this.listElNodesWidth / 2) * -1) || (Math.abs(this.translateX) / this.timeTaken > this.velocity)){ // Did It Move To Left?
            this.onSwipeLeft();
          } else {
            this.backToMiddle();
          }
        } else if(this.translateX > 0) {
          if (this.translateX > (this.listElNodesWidth / 2) || (Math.abs(this.translateX) / this.timeTaken > this.velocity)){ // Did It Move To Right?
            this.onSwipeRight();
          } else {
            this.backToMiddle();
          }

        }
      }
    }
  }
}


window.customElements.define('oap-swipable-cards', OapSwipableCards);