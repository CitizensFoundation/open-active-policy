// Code originally from https://www.outsystems.com/blog/posts/gestures_glamour_swipeable_stacked_cards/
/**
@license
Copyright (c) 2010-2019 Citizens Foundation. AGPL License. All rights reserved.
*/

import { OapBaseElement } from '../oap-base-element';

export class OapSwipableCards extends OapBaseElement {

  static get properties() {
    return {
      stackedOptions: String,
      rotate: Boolean,
      items: Array,
      elementsMargin: Number,
      useOverlays: Boolean,
      maxElements: Number,
      currentPosition: Number,
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
      touchingElement: Boolean
    }
  }

  render() {
    return html`
      <div class="stage">
        <div class="title">What Kind of Traveler Are You?</div>
          <div id="stacked-cards-block" class="stackedcards stackedcards--animatable init">
            <div class="stackedcards-container">
              <div class="card">
                <div class="card-content">
                  <div class="card-image"><img src="https://image.ibb.co/gQsq07/Adventure_and_Outdoor.png" width="100%" height="100%"/></div>
                  <div class="card-titles">
                    <h1>Adventure <br/> and Outdoor</h1>
                    <h3>10 Destinations</h3>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="popular-destinations-text">Popular <br/> Destinations</div>
                  <div class="popular-destinations-images">
                    <div class="circle"><img src="https://image.ibb.co/jmEYL7/adventure_1.jpg" width="100%" height="100%"/></div>
                    <div class="circle"><img src="https://image.ibb.co/nsCynn/adventure_2.jpg" width="100%" height="100%"/></div>
                    <div class="circle"><img src="https://image.ibb.co/hmsL07/adventure_3.jpg" width="100%" height="100%"/></div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-content">
                  <div class="card-image"><img src="https://image.ibb.co/fXPg7n/Beach_and_Chill.png" width="100%" height="100%"/></div>
                  <div class="card-titles">
                    <h1>Beach <br/> and Chill</h1>
                    <h3>12 Destinations</h3>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="popular-destinations-text">Popular Destinations</div>
                  <div class="popular-destinations-images">
                    <div class="circle"><img src="https://image.ibb.co/muiA07/beach_chill_1.jpg" width="100%" height="100%"/></div>
                    <div class="circle"><img src="https://image.ibb.co/emAOL7/beach_chill_2.jpg" width="100%" height="100%"/></div>
                    <div class="circle"><img src="https://image.ibb.co/invq07/beach_chill_3.jpg" width="100%" height="100%"/></div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-content">
                  <div class="card-image"><img src="https://image.ibb.co/c9gTnn/Romantic_Gateways.png" width="100%" height="100%"/></div>
                  <div class="card-titles">
                    <h1>Romantic <br/> Gateways</h1>
                    <h3>15 Destinations</h3>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="popular-destinations-text">Popular Destinations</div>
                  <div class="popular-destinations-images">
                    <div class="circle"><img src="https://image.ibb.co/nQrkYS/romantic_1.jpg" width="100%" height="100%"/></div>
                    <div class="circle"><img src="https://image.ibb.co/ioqOL7/romantic_2.jpg" width="100%" height="100%"/></div>
                    <div class="circle"><img src="https://image.ibb.co/mXSESn/romantic_3.jpg" width="100%" height="100%"/></div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-content">
                  <div class="card-image"><img src="https://image.ibb.co/jY88nn/city_breaks.png" width="100%" height="100%"/></div>
                  <div class="card-titles">
                    <h1>City <br/> Breaks</h1>
                    <h3>32 Destinations</h3>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="popular-destinations-text">Popular Destinations</div>
                  <div class="popular-destinations-images">
                    <div class="circle"><img src="https://image.ibb.co/myaetS/city_break_1.jpg" width="100%" height="100%"/></div>
                    <div class="circle"><img src="https://image.ibb.co/ciocf7/city_break_2.jpg" width="100%" height="100%"/></div>
                    <div class="circle"><img src="https://image.ibb.co/i2e5YS/city_break_3.jpg" width="100%" height="100%"/></div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-content">
                  <div class="card-image"><img src="https://image.ibb.co/eBNZSn/Family_Vacation.png" width="100%" height="100%"/></div>
                  <div class="card-titles">
                    <h1>Family <br/> Vancation</h1>
                    <h3>20 Destinations</h3>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="popular-destinations-text">Popular Destinations</div>
                  <div class="popular-destinations-images">
                    <div class="circle"><img src="https://image.ibb.co/kEN3L7/family_vacation_1.jpg" width="100%" height="100%"/></div>
                    <div class="circle"><img src="https://image.ibb.co/iA8M7n/family_vacation_2.jpg" width="100%" height="100%"/></div>
                    <div class="circle"><img src="https://image.ibb.co/mXOcf7/family_vacation_3.jpg" width="100%" height="100%"/></div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-content">
                  <div class="card-image"><img src="https://image.ibb.co/epvM7n/Art_and_culture.png" width="100%" height="100%"/></div>
                  <div class="card-titles">
                    <h1>Art and <br/> Culture</h1>
                    <h3>18 Destinations</h3>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="popular-destinations-text">Popular Destinations</div>
                  <div class="popular-destinations-images">
                    <div class="circle"><img src="https://image.ibb.co/kVPYL7/art_culture_1.jpg" width="100%" height="100%"/></div>
                    <div class="circle"><img src="https://image.ibb.co/dp4Tnn/art_culture_2.jpg" width="100%" height="100%"/></div>
                    <div class="circle"><img src="https://image.ibb.co/bu6KtS/art_culture_3.jpg" width="100%" height="100%"/></div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-content">
                  <div class="card-image"><img src="https://image.ibb.co/bXTXV7/Far_and_Away_2x.png" width="100%" height="100%"/></div>
                  <div class="card-titles">
                    <h1>Far and <br/> Away</h1>
                    <h3>23 Destinations</h3>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="popular-destinations-text">Popular <br/> Destinations</div>
                  <div class="popular-destinations-images">
                    <div class="circle"><img src="https://image.ibb.co/fOYztS/far_away_1.jpg" width="100%" height="100%"/></div>
                    <div class="circle"><img src="https://image.ibb.co/izdXDS/far_away_2.jpg" width="100%" height="100%"/></div>
                    <div class="circle"><img src="https://image.ibb.co/mqwKtS/far_away_3.jpg" width="100%" height="100%"/></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="stackedcards--animatable stackedcards-overlay top"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png"  width="auto" height="auto"/></div>
            <div class="stackedcards--animatable stackedcards-overlay right"><img src="https://image.ibb.co/dCuESn/Path_3x.png" width="auto" height="auto"/></div>
            <div class="stackedcards--animatable stackedcards-overlay left"><img src="https://image.ibb.co/heTxf7/20_status_close_3x.png" width="auto" height="auto"/></div>
          </div>
          <div class="global-actions">
            <div class="left-action"><img src="https://image.ibb.co/heTxf7/20_status_close_3x.png" width="26" height="26"/></div>
            <div class="top-action"><img src="https://image.ibb.co/m1ykYS/rank_army_star_2_3x.png" width="18" height="16"/></div>
            <div class="right-action"><img src="https://image.ibb.co/dCuESn/Path_3x.png" width="30" height="28"/></div>
        </div>
      </div>

      <div class="final-state hidden"><h2>Got it! We received your preferences! <br/> To submit again, press F5.</h2></div>
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

  firstUpdated() {
    this.activate();
  }

  reset() {
    this.stackedOptions = 'Top';
    this.rotate = true;
    this.elementsMargin = 10;
    this.currentPosition = 0;
    this.velocity = 0.3;
    this.isFirstTime = true;
    this.touchingElement = false;
  }

  activate() {
    this.obj = document.getElementById('stacked-cards-block');
		this.stackedCardsObj = this.obj.querySelector('.stackedcards-container');
		this.listElNodesObj = this.stackedCardsObj.children;

		this.topObj = this.obj.querySelector('.stackedcards-overlay.top');
		this.rightObj = this.obj.querySelector('.stackedcards-overlay.right');
		this.leftObj = this.obj.querySelector('.stackedcards-overlay.left');

		this.countElements();
		this.currentElement();
    this.changeBackground();
		this.listElNodesWidth = this.stackedCardsObj.offsetWidth;
		this.currentElementObj = this.listElNodesObj[0];
		this.updateUi();

		//Prepare elements on DOM
		var addMargin = this.elementsMargin * (this.items.length -1) + 'px';

		if(this.stackedOptions === "Top"){

			for(i = this.items.length; i < this.maxElements; i++){
				this.listElNodesObj[i].classList.add('stackedcards-top', 'stackedcards--animatable', 'stackedcards-origin-top');
			}

			this.elTrans = this.elementsMargin * (this.items.length - 1);

			this.stackedCardsObj.style.marginBottom = addMargin;

		} else if(this.stackedOptions === "Bottom"){


			for(i = this.items.length; i < this.maxElements; i++){
				this.listElNodesObj[i].classList.add('stackedcards-bottom', 'stackedcards--animatable', 'stackedcards-origin-bottom');
			}

			this.elTrans = 0;

			this.stackedCardsObj.style.marginBottom = addMargin;

		} else if (this.stackedOptions === "None"){

			for(i = this.items.length; i < this.maxElements; i++){
				this.listElNodesObj[i].classList.add('stackedcards-none', 'stackedcards--animatable');
			}

			this.elTrans = 0;

		}

		for(i = this.items.length; i < this.maxElements; i++){
			this.listElNodesObj[i].style.zIndex = 0;
			this.listElNodesObj[i].style.opacity = 0;
			this.listElNodesObj[i].style.webkitTransform ='scale(' + (1 - (this.items.length * 0.04)) +') translateX(0) translateY(' + this.elTrans + 'px) translateZ(0)';
			this.listElNodesObj[i].style.transform ='scale(' + (1 - (this.items.length * 0.04)) +') translateX(0) translateY(' + this.elTrans + 'px) translateZ(0)';
		}

		if(this.listElNodesObj[this.currentPosition]){
			this.listElNodesObj[this.currentPosition].classList.add('stackedcards-active');
		}

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

  addEventListeners() {
     // JavaScript Document
		this.obj.addEventListener('touchstart', this.gestureStart.bind(this), false);
		this.obj.addEventListener('touchmove', this.gestureMove.bind(this), false);
		this.obj.addEventListener('touchend', this.gestureEnd.bind(this), false);

		//Add listeners to call global action for swipe cards
		var buttonLeft = document.querySelector('.left-action');
		var buttonTop = document.querySelector('.top-action');
		var buttonRight = document.querySelector('.right-action');

		buttonLeft.addEventListener('click', this.onActionLeft.bind(this), false);
		buttonTop.addEventListener('click', this.onActionTop.bind(this), false);
    buttonRight.addEventListener('click', this.onActionRight.bind(this), false);
  }

  removeEventListeners() {
    // JavaScript Document
   this.obj.removeEventListener('touchstart', this.gestureStart.bind(this));
   this.obj.removeEventListener('touchmove', this.gestureMove.bind(this));
   this.obj.removeEventListener('touchend', this.gestureEnd.bind(this));

   //Add listeners to call global action for swipe cards
   var buttonLeft = document.querySelector('.left-action');
   var buttonTop = document.querySelector('.top-action');
   var buttonRight = document.querySelector('.right-action');

   if (buttonLeft) {
    buttonLeft.removeEventListener('click', this.onActionLeft.bind(this), false);
    buttonTop.removeEventListener('click', this.onActionTop.bind(this), false);
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
    if(this.items.length > this.maxElements){
      this.items.length = this.maxElements;
    }
  }

  //Keep the active card.
  currentElement() {
    this.currentElementObj = this.listElNodesObj[this.currentPosition];
  }

  //Change background for each swipe.
  changeBackground() {
    document.body.classList.add("background-" + this.currentPosition + "");
  }

  //Change states
  changeStages() {
    if(this.currentPosition == this.maxElements){
        //Event listener created to know when transition ends and changes states
        this.listElNodesObj[this.maxElements - 1].addEventListener('transitionend', function(){
          document.body.classList.add("background-7");
          document.querySelector('.stage').classList.add('hidden');
          document.querySelector('.final-state').classList.remove('hidden');
          document.querySelector('.final-state').classList.add('active');
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
    this.currentPosition = this.currentPosition + 1;
    this.updateUi();
    this.currentElement();
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

    this.currentPosition = this.currentPosition + 1;
    this.updateUi();
    this.currentElement();
    this.changeBackground();
    this.changeStages();
    this.setActiveHidden();
  }

  //Swipe active card to top.
  onSwipeTop() {
    this.removeNoTransition();
    this.transformUi(0, -1000, 0, this.currentElementObj);
    if(this.useOverlays){
      this.transformUi(0, -1000, 0, this.leftObj); //Move leftOverlay
      this.transformUi(0, -1000, 0, this.rightObj); //Move rightOverlay
      this.transformUi(0, -1000, 0, this.topObj); //Move topOverlay
      this.resetOverlays();
    }

    this.currentPosition = this.currentPosition + 1;
    this.updateUi();
    this.currentElement();
    this.changeBackground();
    this.changeStages();
    this.setActiveHidden();
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

            this.elTrans = this.elementsMargin * (this.items.length - 1);

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

            this.elTrans = this.elementsMargin * (this.items.length - 1);

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

            this.elTrans = this.elementsMargin * (this.items.length - 1);

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

      if(this.rotate){
        rotateElement = RotateRegulator(moveX);
      } else {
        rotateElement = 0;
      }

      if(this.stackedOptions === "Top"){
        this.elTrans = this.elementsMargin * (this.items.length - 1);
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
      var elTransTop = this.items.length;
      var elTransInc = this.elementsMargin;

      for(i = this.currentPosition; i < (this.currentPosition + this.items.length); i++){
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
          elOpac = elOpac - (1 / this.items.length);
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
