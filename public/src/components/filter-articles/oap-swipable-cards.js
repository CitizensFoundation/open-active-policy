// Code originally from https://www.outsystems.com/blog/posts/gestures_glamour_swipeable_stacked_cards/
/**
@license
Copyright (c) 2010-2019 Citizens Foundation. AGPL License. All rights reserved.
*/
import { html } from 'lit-element';
import { OapBaseElement } from '../oap-base-element';
import { OapSwipableCardsStyles } from './oap-swipable-cards-styles';

class OapSwipableCards extends OapBaseElement {

  static get properties() {
    return {
      stackedOptions: String,
      rotate: Boolean,
      items: Array,
      visibleItems: Array,
      elementsMargin: Number,
      useOverlays: Boolean,
      maxElements: Number,
      currentPosition: Number,
      currentItemsPosition: Number,
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
      disableUpSwipe: Boolean
    }
  }

  static get styles() {
    return [
      OapSwipableCardsStyles
    ];
  }

  render() {
    return html`
      <div class="stage">
        <div class="title">${this.localize("filterArticles")}</div>
          <div id="stacked-cards-block" class="stackedcards stackedcards--animatable init">
            <div class="stackedcards-container">
              ${this.visibleItems.map((item, index) =>
                html`
                  <div class="card">
                    <div class="card-content">
                      <div class="card-imagse"><img class="cardImage" src="${item.image_url}"/></div>
                      <div class="card-tistles">
                        <div class="name">${item.name}</div>
                      </div>
                      <p class="description">${item.description}</p>
                    </div>
                  </div>
                `
              )}
            </div>
            <div class="stackedcards--animatable stackedcards-overlay top"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png"  width="auto" height="auto"/></div>
            <div class="stackedcards--animatable stackedcards-overlay right"><img src="https://image.ibb.co/dCuESn/Path_3x.png" width="auto" height="auto"/></div>
            <div class="stackedcards--animatable stackedcards-overlay left"><img src="https://image.ibb.co/heTxf7/20_status_close_3x.png" width="auto" height="auto"/></div>
          </div>
          <div class="global-actions">
            <div class="left-action"><img src="https://image.ibb.co/heTxf7/20_status_close_3x.png" width="26" height="26"/></div>
            <div hidden>
             <div ?hidden="${this.disableUpSwipe}" class="top-action"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="18" height="16"/></div>
            </div>
            <div style="width: 100px;"></div>
            <div class="right-action"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="30" height="28"/></div>
        </div>
      </div>

      <div class="final-state hidden"><h2>${this.localize("filterArticlesDone")}</h2></div>
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

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('items')) {
      if (this.items && this.items.length>0) {
        this.visibleItems=this.items.slice(10);
        //TODO: Only show first 20 items and reload on demand
        this.requestUpdate();
        this.updateComplete.then(() => {
          this.activate();
        });
      }
    }
  }

  reset() {
    this.stackedOptions = 'Top';
    this.rotate = true;
    this.elementsMargin = 5;
    this.currentPosition = 0;
    this.currentItemsPosition = 0;
    this.velocity = 0.3;
    this.isFirstTime = true;
    this.touchingElement = false;
    this.visibleItems = [];
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

		} else {
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
    }.bind(this), 150);

   this.addEventListeners();
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
  }

  addEventListeners() {
     // JavaScript Document
		document.addEventListener('touchstart', this.gestureStart.bind(this), false);
		document.addEventListener('touchmove', this.gestureMove.bind(this), false);
		document.addEventListener('touchend', this.gestureEnd.bind(this), false);

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
    document.removeEventListener('touchstart', this.gestureStart.bind(this));
    document.removeEventListener('touchmove', this.gestureMove.bind(this));
    document.removeEventListener('touchend', this.gestureEnd.bind(this));

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
  onActionTop() {
    if(!(this.currentPosition >= this.maxElements)){
      if(this.useOverlays) {
        this.leftObj.classList.remove('no-transition');
        this.rightObj.classList.remove('no-transition');
        this.topObj.classList.remove('no-transition');
        this.topObj.style.zIndex = '8';
        this.transformUi(0, 0, 1, this.topObj);
      }

      setTimeout(function(){
        this.onSwipeTop();
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
    this.fire('item-discarded', this.items[this.currentItemPosition]);

    this.currentPosition = this.currentPosition + 1;
    this.currentItemPosition = this.currentItemPosition + 1;
    this.updateUi();
    this.setCurrentElement();
    this.changeBackground();
    this.changeStages();
    this.setActiveHidden();
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
    this.fire('item-selected', this.items[this.currentItemPosition]);
    this.currentPosition = this.currentPosition + 1;
    this.currentItemPosition = this.currentItemPosition + 1;
    this.updateUi();
    this.setCurrentElement();
    this.changeBackground();
    this.changeStages();
    this.setActiveHidden();
  }

  //Swipe active card to top.
  onSwipeTop() {
    if (!this.disableUpSwipe) {
      this.removeNoTransition();
      this.transformUi(0, -1000, 0, this.currentElementObj);
      if(this.useOverlays){
        this.transformUi(0, -1000, 0, this.leftObj); //Move leftOverlay
        this.transformUi(0, -1000, 0, this.rightObj); //Move rightOverlay
        this.transformUi(0, -1000, 0, this.topObj); //Move topOverlay
        this.resetOverlays();
      }

      this.fire('item-bookmarked', this.items[this.currentItemPosition]);
      this.currentPosition = this.currentPosition + 1;
      this.currentItemPosition = this.currentItemPosition + 1;
      this.updateUi();
      this.setCurrentElement();
      this.changeBackground();
      this.changeStages();
      this.setActiveHidden();
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
        this.elTrans = this.elementsMargin * (this.visibleItems.length - 1);
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
      evt.preventDefault();
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
          this.onSwipeTop();
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

          if (this.translateX > (this.listElNodesWidth / 2) && (Math.abs(this.translateX) / this.timeTaken > this.velocity)){ // Did It Move To Right?
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