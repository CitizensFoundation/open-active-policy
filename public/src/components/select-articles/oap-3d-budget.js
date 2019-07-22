import { html } from 'lit-element';

import { OapBudgetStyles } from './oap-budget-styles';
import { OapShadowStyles } from '../oap-shadow-styles';
import { OapFlexLayout } from '../oap-flex-layout.js';

import { Scene,PerspectiveCamera,WebGLRenderer,Box3,DirectionalLight,AmbientLight,Vector2,Vector3,BoxGeometry,Mesh,MeshBasicMaterial} from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { LuminosityHighPassShader } from 'three/examples/jsm/shaders/LuminosityHighPassShader';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { Tween, Easing, update } from 'es6-tween';

import { OapBaseElement } from '../oap-base-element.js';

class Oap3dBudget extends OapBaseElement {
  static get properties() {
    return {
      selectedItems: {
        type: Array,
        value: [],
        notify: true
      },

      toastCounter: {
        type: Number,
        value: 0
      },

      noSelectedItems: {
        type: Boolean,
        value: true
      },

      areaName: {
        type: String,
        value: null
      },

      selectedBudget: {
        type: Number,
        value: 0
      },

      totalBudget: {
        type: Number
      },

      budgetLeft: {
        type: Number
      },

      selectedBudgetIsOne: {
        type: Boolean
      },

      votesWidth: {
        type: Number
      },

      wide: {
        type: Boolean
      },

      mediumWide: {
        type: Boolean
      },

      mini: {
        type: Boolean
      },

      orientationPortrait:  {
        type: Boolean
      },

      orientationLandscape:  {
        type: Boolean
      },

      currentBallot: Object,

      budgetHeaderImage: {
        type: String
      },

      showExit: Boolean,

      configFromServer: Object,

      scene: Object,
      camera: Object,
      composer: Object,
      controls: Object,
      renderer: Object,
      directionalLight: Object,
      ambientLight: Object,
      itemsInScene: Object,
      tween: Object
    };
  }

  setupScene () {
    const width=this.votesWidth;
    const height=184;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(35, width/height, 1, 10000);
    this.camera.position.set(36, 1, 20);
    this.camera.layers.enable(1);
    this.renderer = new WebGLRenderer({antialias: true});
    this.renderer.setSize(width, height);
    this.renderer.setClearColor( 0x101000 );

    this.controls = new FlyControls(this.camera, this.renderer.domElement);

    this.directionalLight = new DirectionalLight(0xffffff, 0.75);
    this.directionalLight.position.setScalar(100);
    this.scene.add(this.directionalLight);
    this.ambientLight = new AmbientLight(0xffffff, 0.25);
    this.scene.add(this.ambientLight);

    const renderScene = new RenderPass( this.scene, this.camera );
    const effectFXAA = new ShaderPass( FXAAShader );
    effectFXAA.uniforms.resolution.value.set( 1 / width, 1 / height );

    const bloomPass = new UnrealBloomPass( new Vector2( width, height ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = 0.22;
    bloomPass.strength = 1.2;
    bloomPass.radius = 0.55;
    bloomPass.renderToScreen = true;

    this.composer = new EffectComposer( this.renderer );
    this.composer.setSize( width, height);

    this.composer.addPass( renderScene );
    this.composer.addPass( effectFXAA );
    this.composer.addPass( bloomPass );

    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.toneMappingExposure = Math.pow( 0.9, 4.0 );
    var mainMaterial = this.$$("#mainMaterial");
    mainMaterial.appendChild(this.renderer.domElement);

//    scene.add( new AxesHelper( 1 ) );
    this.renderScene();
  }

  renderScene() {
    requestAnimationFrame(this.renderScene.bind(this));
    update();

    this.renderer.autoClear = false;
    this.renderer.clear();

    this.camera.layers.set(1);
    this.composer.render();

    this.renderer.clearDepth();
    this.camera.layers.set(0);
    this.renderer.render(this.scene, this.camera);
    //console.log(this.camera.position);
  }

  animateVector3(vectorToAnimate, target, options) {
    options = options || {};
    // get targets from options or set to defaults
    var to = target || Vector3(),
        easing = options.easing || Easing.Quadratic.In,
        duration = options.duration || 2000;
    // create the tween
    var tweenVector3 = new Tween(vectorToAnimate)
        .to({ x: to.x, y: to.y, z: to.z, }, duration)
        .easing(easing)
        .on('complete', ()=> {
          if(options.callback) options.callback();
        }).start();
    // start the tween
    return tweenVector3;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fire('oav-set-budget-element', this);
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('selectedBudget')) {
      this.selectedBudgetIsOne = this.selectedBudget && this.selectedBudget===1.0;
    }

    if (changedProps.has('selectedItems')) {
      this._selectedItemsChanged();
    }

    if (changedProps.has('selectedBudget') || changedProps.has('totalBudget')) {
      var budgetLeft = this.totalBudget-this.selectedBudget;
      if (budgetLeft>0) {
        this.budgetLeft = budgetLeft;
      } else {
        this.budgetLeft = 0;
      }
    }
  }

  static get styles() {
    return [
      OapBudgetStyles,
      OapShadowStyles,
      OapFlexLayout
    ];
  }

  render() {
    return html`
      <div class="budgetContainer center-center" ?wide="${this.wide}">
        <div id="mainMaterial" class="budgetMaterial shadow-elevation-24dp" ?wide="${this.wide}">
        </div>
      </div>
    `;
  }

  firstUpdated() {
    this.reset();
    this._resetWidth();
    this.setupScene();
    installMediaQueryWatcher(`(min-width: 1024px)`,
      (matches) => {
        if (matches)
          this.wide = true;
        else
          this.wide = false;
        this._resetWidth();
      });

    installMediaQueryWatcher(`(orientation: portrait)`,
      (matches) => {
        if (matches)
          this.orientationPortrait = true;
        else
          this.orientationPortrait = false;
        this._resetWidth();
      });

    installMediaQueryWatcher(`(orientation: landscape)`,
      (matches) => {
        if (matches)
          this.orientationLandscape = true;
        else
          this.orientationLandscape = false;
        this._resetWidth();
      });

    installMediaQueryWatcher(`(min-width: 640px)`,
      (matches) => {
        if (matches)
          this.mediumWide = true;
        else
          this.mediumWide = false;
        this._resetWidth();
      });

    installMediaQueryWatcher(`(max-width: 340px)`,
      (matches) => {
        if (matches)
          this.mini = true;
        else
          this.mini = false;
        this._resetWidth();
      });

  }

  constructor() {
    super();
  }


  _exit () {
    this.fire("oav-exit");
  }

  _help() {
    this.fire("oav-open-help");
  }

  _closeToast() {
    this.$$("#toast").active= false;
  }

  _resetWidth() {
    if (this.wide) {
      this.votesWidth = 940;
    } else {
      this.votesWidth = window.innerWidth;
    }
    this._resetBudgetDiv();
    this.selectedItems.forEach(function (item) {
      this._addItemToDiv(item);
    }.bind(this));
  }

  _millionWord() {
    // var localizeMethod = this.__computeLocalize(this.language, this.resources, this.formats);
    if (this.wide) {
      return this.localize('million');
    } else {
      return this.localize('million_short');
    }
  }

  _submitVote() {
    this.activity('click', 'submitVote');
    this.currentBallot.fire('oav-submit-vote');
  }

  _selectedItemsChanged() {
    if (this.selectedItems && this.selectedItems.length>0) {
      this.noSelectedItems = false;
      this.$$("#votingButton").disabled = false;
    } else {
      this.noSelectedItems = true;
      this.$$("#votingButton").disabled = true;
    }
  }

  reset() {
    this._resetBudgetDiv();
    this.selectedItems = [];
    this.itemsInScene=[];
    this.selectedBudget = 0;
    this.budgetHeaderImage = this.configFromServer.client_config.ballotBudgetLogo;
  }

  _resetBudgetDiv() {
    let votes = this.$$("#votes");
    if (votes) {
      while (votes.lastChild && votes.lastChild.id!='noItems' && votes.lastChild.id!='budgetLeftInfo') {
        votes.removeChild(votes.lastChild);
      }
    }
  }

  _removeItemFromArray(item) {
    var newArray = [];
    this.selectedItems.forEach(function (i) {
      if (i.id!=item.id) {
        newArray.push(i);
      }
    });
    this.selectedItems = newArray;
  }

  _addItemToDiv(item) {
    var itemWidth = parseInt(this.votesWidth * (item.price / this.totalBudget));

    if (!this.wide) {
      itemWidth -= 1;
    }

    var itemHeight;
    if (this.wide) {
      itemHeight = '100';
    } else {
      itemHeight = '81';
    }

    let random = Math.floor(Math.random() * 4);
    let color;
    if (random==0) {
      color = "#FF1744";
    } else if (random==1) {
      color = "#2979FF";
    } else if (random==2) {
      color = "#FF3D00";
    } else if (random==3) {
      color = "#76FF03";
    }

    var fudgetFactorPx = 0.05;
    itemWidth = itemWidth*fudgetFactorPx;

    var object = new Mesh(new BoxGeometry(itemWidth, 5, 5), new MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.95,
      wireframe: false
    }));

    console.error("Item "+item.id+": x="+itemWidth);
    object.layers.enable(1);
    object.position.x=70.0;
    this.scene.add(object);
    this.itemsInScene.push({id: item.id, object: object, width: itemWidth});
    this.positionItems();
  }

  positionItems() {
    let rightEdgeAndSpace=0.0;
    this.itemsInScene.forEach((item, index)=> {
      let currentWidth;
      currentWidth = new Box3().setFromObject(item.object).getSize(currentWidth).x;
      console.error(index+": bounding box x="+currentWidth);
      const setX = rightEdgeAndSpace+(currentWidth/2);
      console.error(index+": set x="+setX);
      const target = new Vector3(setX, item.object.position.y, item.object.position.y);
      let random = Math.floor(Math.random() * 150);

      this.animateVector3(item.object.position, target, {
        duration: 375+random,
        easing : Easing.Quadratic.InOut,
        update: function(d) {
        },
        callback : function(){
            console.log("Completed");
        }
      });
      rightEdgeAndSpace=(setX+currentWidth/2)+1.0;
      console.error(index+": after x="+rightEdgeAndSpace);
    });
  }

  _removeItemFromDiv(item) {
    this.itemsInScene.forEach((sceneItem, index) => {
      if (sceneItem.id==item.id) {
        this.itemsInScene.splice(index, 1);
        this.scene.remove(sceneItem.object);
        this.positionItems();
      }
    });
  }

  getItemLeftTop(item) {
    var selectedItemDiv = this.$$("#item_id_"+item.id);
    if (selectedItemDiv) {
      var buttonRect = selectedItemDiv.getBoundingClientRect();
      var left = ((buttonRect.right-buttonRect.left)/2)+buttonRect.left;
      var top = ((buttonRect.bottom-buttonRect.top)/2)+buttonRect.top;
      if (this.wide) {
        left = left - 24;
        top = top - 24;
      } else {
        left = left - 18;
        top = top - 18;
      }
      return { left: left, top: top }
    } else {
      console.error("Trying to get item that is not in the budget");
    }
  }

  toggleBudgetItem(item) {
    this.activity('toggle', 'vote');
    if (this.selectedItems.indexOf(item) > -1) {
      this.activity('remove', 'vote');
      this._removeItemFromArray(item);
      this._removeItemFromDiv(item);
      this.selectedItems = [
        ...this.selectedItems
      ];
      this.selectedBudget = this.selectedBudget - item.price;
      this.currentBallot.fire('oav-item-de-selected-from-budget', { itemId: item.id });
    } else {
      if (this.selectedBudget+item.price<=this.totalBudget) {
        this.activity('add', 'vote');
        this.selectedItems.push(item);
        this.selectedItems = [
          ...this.selectedItems
        ];
        this._addItemToDiv(item);
        this.selectedBudget = this.selectedBudget + item.price;
        this.currentBallot.fire('oav-item-selected-in-budget', { itemId: item.id });
      } else {
        this.currentBallot.fire('oav-error', this.localize('error_does_not_fit_in_budget'));
      }
    }
  }

  toggleFavoriteItem(item) {
    this.activity('toggle', 'favorite');
    if (this.favoriteItem != item) {
      if (item) {
        this.activity('add', 'favorite');
      } else {
        this.activity('remove', 'favorite');
      }
      this.favoriteItem = item;
    }
  }

  _removeItem(itemId) {
    this.selectedItems.forEach(function (item) {
      if (item.id==itemId) {
        this.toggleBudgetItem(item);
      }
    }.bind(this));
  }

  convertDots(num) {
    return num.replace(".", ",");
  }
}

window.customElements.define('oap-3d-budget', Oap3dBudget);
