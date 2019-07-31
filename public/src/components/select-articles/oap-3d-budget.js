import { html } from 'lit-element';

import { OapBudgetStyles } from './oap-budget-styles';
import { OapShadowStyles } from '../oap-shadow-styles';
import { OapFlexLayout } from '../oap-flex-layout.js';

import { Scene,PerspectiveCamera,Group,Object3D,BufferGeometry,MeshPhongMaterial,WebGLRenderer,TextGeometry,Box3,FontLoader,DirectionalLight,AmbientLight,Vector2,Vector3,BoxGeometry,Mesh,MeshBasicMaterial} from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { LuminosityHighPassShader } from 'three/examples/jsm/shaders/LuminosityHighPassShader';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { Tween, Easing, update, removeAll } from 'es6-tween';
//import { MeshText2D, textAlign } from 'three-text2d';

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
      defaultCameraPos: Object,
      defaultCameraRot: Object,
      defaultGroupPos: Object,
      defaultGroupRot: Object,
      composer: Object,
      controls: Object,
      renderer: Object,
      directionalLight: Object,
      ambientLight: Object,
      itemsInScene: Object,
      tween: Object,
      font3d: Object,
      budgetGroup3d: Object,
      fontMesh: Object
    };
  }

  setupScene () {
    const width=this.votesWidth;
    const height=184;
    const xCamera = width*0.0230;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(30, width/height, 1, 10000);
    this.camera.position.set(xCamera, 0.1, 21);
    this.defaultCameraPos = JSON.parse(JSON.stringify(this.camera.position));
    this.defaultCameraRot = JSON.parse(JSON.stringify(this.camera.rotation));
    this.camera.layers.enable(1);
    this.renderer = new WebGLRenderer({antialias: true});
    this.renderer.setSize(width, height);
    this.renderer.setClearColor( 0x100000 );

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
    bloomPass.radius = 0.45;
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
    this.budgetGroup3d = new Object3D();
    this.scene.add(this.budgetGroup3d);
    this.defaultGroupPos = JSON.parse(JSON.stringify(this.budgetGroup3d.position));
    this.defaultGroupRot = JSON.parse(JSON.stringify(this.budgetGroup3d.rotation));

    var loader = new FontLoader();

    loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {

      this.font3d = font;
      this.rebuildChoicePoints(true);
    }.bind(this));

//    scene.add( new AxesHelper( 1 ) );
    this.renderScene();
  }

  bonusPenalty3dText(value, emoji) {
    console.error("bonusPenalty3dText: "+value);
    if (value!=0) {
      this.rotateAllItemsGroup();

      if (this.font3d) {
        var geometry = new TextGeometry( value+'cp', {
          font: this.font3d,
          size: window.innerWidth>600 ? 4 : 3,
          height: window.innerWidth>600 ? 1.5 : 1.2,
          curveSegments: window.innerWidth>600 ? 10 : 8,
          bevelEnabled: true,
          bevelThickness: window.innerWidth>600 ? 0.5 : 0.4,
          bevelSize:  window.innerWidth>600 ? 0.5 : 0.3,
          bevelOffset: 0,
          bevelSegments:  window.innerWidth>600 ? 7 :7
        });


        //var text2 = new MeshText2D("❤️", { align: textAlign.right, font: '30px Arial', fillStyle: '#000000', antialias: true })
        //this.scene.add(text2d);

        geometry.computeBoundingBox();
        geometry.computeVertexNormals();
        geometry.center();

        geometry = new BufferGeometry().fromGeometry( geometry );
        const xText = this.votesWidth*0.070;

        let color;
        if (value>0) {
          color=0x00FF00;
        } else {
          color=0xFF0000;
        }

        let startFudge = 90;
        let endFudge = 18;
        if (window.innerWidth<600) {
          startFudge = 35;
          endFudge = 7;
        }

        if (this.bonusPenaltyFontMesh==null) {
          var materials = [
            new MeshPhongMaterial( { color: color, flatShading: true } ), // front
            new MeshPhongMaterial( { color: color} ) // side
          ];

          this.bonusPenaltyFontMesh = new Mesh( geometry, materials );
          this.bonusPenaltyFontMesh.position.x = xText-startFudge;
          this.bonusPenaltyFontMesh.position.y = -1;
          this.bonusPenaltyFontMesh.position.z = 0;

          this.bonusPenaltyFontMesh.rotation.x = 0;
          this.bonusPenaltyFontMesh.rotation.y = Math.PI * 2;
          this.scene.add(this.bonusPenaltyFontMesh);
        } else {
          this.bonusPenaltyFontMesh.material[0].color.set(color);
          this.bonusPenaltyFontMesh.material[1].color.set(color);
          this.bonusPenaltyFontMesh.geometry=geometry;
          this.scene.add(this.bonusPenaltyFontMesh);
        }

        if (this.bonusPenaltyFontTween) {
          this.bonusPenaltyFontTween.stop();
          this.bonusPenaltyFontMesh.position.x = xText-startFudge;
          this.bonusPenaltyFontMesh.position.z = 0;
        }

        if (this.bonusPenaltyFontRotation) {
          this.bonusPenaltyFontRotation.stop();
          this.bonusPenaltyFontMesh.rotation.y = 0;
        }

        this.fontMesh.material[0].color.set(color);
        this.fontMesh.material[1].color.set(color);

        setTimeout(()=>{
          this.bonusPenaltyFontTween = new Tween(this.bonusPenaltyFontMesh.position)
          .to({ x: xText-endFudge, y: this.bonusPenaltyFontMesh.position.y, z: this.bonusPenaltyFontMesh.position.z-7}, 1200) // relative animation
          .delay(0)
          .on('complete', () => {
            this.scene.remove(this.bonusPenaltyFontMesh);
            this.bonusPenaltyFontMesh.position.x = xText-startFudge;
            this.bonusPenaltyFontMesh.position.z = 0;
            this.bonusPenaltyFontTween=null;
            this.fontMesh.material[0].color.set(0xFF5722);
            this.fontMesh.material[1].color.set(0xFF5722);
          })
          .start();
        });

        setTimeout(()=> {
          this.bonusPenaltyFontRotation = new Tween(this.bonusPenaltyFontMesh.rotation)
          .to({ y: "-" + this.bonusPenaltyFontMesh.rotation.y+(Math.PI*2)}, 300)
          .delay(0)
          .on('complete', () => {
            this.bonusPenaltyFontMesh.rotation.y = 0;
            this.bonusPenaltyFontRotation = null;
          })
          .start();
        }, 800);
      } 
      }
  }

  rebuildChoicePoints(firstTime) {
    if (this.budgetLeft!=null && this.font3d) {
      var geometry = new TextGeometry( this.budgetLeft+'cp', {
        font: this.font3d,
        size: window.innerWidth>600 ? 10 : 5,
        height: window.innerWidth>600 ? 2 : 1.2,
        curveSegments: window.innerWidth>600 ? 15 : 12,
        bevelEnabled: true,
        bevelThickness: window.innerWidth>600 ? 1 : 0.7,
        bevelSize:  window.innerWidth>600 ? 0.9 : 0.5,
        bevelOffset: 0,
        bevelSegments:  window.innerWidth>600 ? 7 :7
      });

      geometry.computeBoundingBox();
      geometry.computeVertexNormals();
      geometry.center();

      geometry = new BufferGeometry().fromGeometry( geometry );

      if (this.fontMesh==null) {
        var materials = [
          new MeshPhongMaterial( { color: 0xFF5722, flatShading: true } ), // front
          new MeshPhongMaterial( { color: 0xFF5722 } ) // side
        ];

        this.fontMesh = new Mesh( geometry, materials );

        const xText = this.votesWidth*0.070;

        this.fontMesh.position.x = xText;
        this.fontMesh.position.y = -1;
        this.fontMesh.position.z = -33;

        this.fontMesh.rotation.x = 0;
        this.fontMesh.rotation.y = Math.PI * 2;
        this.scene.add(this.fontMesh);
      } else {
        this.fontMesh.geometry=geometry;
      }

      if (this.budgetLeft<75 || firstTime) {

        let duration=750;
        if (this.budgetLeft<40) {
          duration=600;
        }

        if (this.budgetLeft<20) {
          duration=300;
        }

        new Tween(this.fontMesh.rotation)
        .to({ y: "-" + this.fontMesh.rotation.y+(Math.PI*2)}, duration) // relative animation
        .delay(0)
        .on('complete', () => {
            // Check that the full 360 degrees of rotation,
            // and calculate the remainder of the division to avoid overflow.
            //console.log("Rotate test reset");
            this.fontMesh.rotation.y=0;
        })
        .start();
      } else {

      }
    }
  }

  renderScene() {
    requestAnimationFrame(this.renderScene.bind(this));

    // This is Tween.update
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
      this.selectedBudgetIsOne = (this.selectedBudget && this.selectedBudget===1.0);
    }

    if (changedProps.has('selectedItems')) {
      this._selectedItemsChanged();
    }


    if (changedProps.has('budgetLeft')) {
      this.rebuildChoicePoints();
    }

    if (changedProps.has('totalBudget')) {
      this.resetItemsWidth();
      if (this.itemsInScene.length>0) {
        const oldTotalBudget = changedProps.get("totalBudget");
        if (oldTotalBudget<this.totalBudget) {
          //this.rotateTimeShift();
//          this.rotateAllItems();
          this.fire('oap-play-sound-effect', 'oap_short_win_1');
        }
      }
    }

    if (changedProps.has('selectedBudget') || changedProps.has('totalBudget')) {
      console.error(this.selectedBudget+" : "+this.totalBudget);
      var budgetLeft = this.totalBudget-this.selectedBudget;
      if (budgetLeft>0) {
        this.budgetLeft = budgetLeft;
      } else {
        this.budgetLeft = 0;
      }
      this.currentBallot.setStateOfRemainingItems();
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
    this.fire("oap-open-help");
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
      if (this.$$("#votingButton"))
        this.$$("#votingButton").disabled = false;
    } else {
      this.noSelectedItems = true;
      if (this.$$("#votingButton"))
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

    const color = this.configFromServer.client_config.moduleTypeColorLookup[item.module_content_type];

    var fudgetFactorPx = 0.033;
    itemWidth = itemWidth*fudgetFactorPx;

    var object = new Mesh(new BoxGeometry(itemWidth, 5, 5), new MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 1,
      wireframe: false
    }));

    //console.error("Item "+item.id+": x="+itemWidth);
    object.layers.enable(1);
    object.position.x=50.0;
    object.position.z=-40.0;

    if (true) {
      setTimeout(()=>{
        this.budgetGroup3d.add(object);
        this.itemsInScene.push({id: item.id, object: object, width: itemWidth, item: item});
        this.positionItems();
      }, 30);
    } else {
      this.budgetGroup3d.add(object);
      this.itemsInScene.push({id: item.id, object: object, width: itemWidth, item: item});
      this.positionItems();
    }

    if (this.itemsInScene.length>10) {
      setTimeout(()=>{
        //this.rotateAllItems();
      }, 300);
    }
  }

  resetItemsWidth() {
    this.itemsInScene.forEach((dItem)=> {
      let itemWidth = parseInt(this.votesWidth * (dItem.item.price / this.totalBudget));
      var fudgetFactorPx = 0.033;
      itemWidth = itemWidth*fudgetFactorPx;
      if (dItem.width!=itemWidth) {
        var box = new BoxGeometry(itemWidth, 5, 5);
        dItem.object.geometry.dispose();
        dItem.object.geometry = box;
      }
      dItem.width = itemWidth;
    });
    this.positionItems();
  }

  positionItems() {
    let rightEdgeAndSpace=0.0;
    const sortedItems = this.itemsInScene.sort((item3dA, item3dB)=> {
      return item3dA.item.module_type_index-item3dB.item.module_type_index;
    });
    sortedItems.forEach((item, index)=> {
      let currentWidth;
      const currentSize = new Vector3();
      new Box3().setFromObject(item.object).getSize(currentSize);
      currentWidth = currentSize.x;
      //console.error(index+": bounding box x="+currentWidth);
      const setX = rightEdgeAndSpace+(currentWidth/2);
      //console.error(index+": set x="+setX);
      const target = new Vector3(setX, 0.0, 0.0);
      let random = Math.floor(Math.random() * 100);

      this.animateVector3(item.object.position, target, {
        duration: 650,
        easing : Easing.Quadratic.InOut,
        update: function(d) {
        },
        callback : function(){
        }
      });
      rightEdgeAndSpace=(setX+currentWidth/2);
      //console.error(index+": after x="+rightEdgeAndSpace);
      if (false) {
        setTimeout(()=>{
          const target = new Vector3(item.object.position.x, (index*0.4), item.object.position.z);
          let random = Math.floor(Math.random() * 50);

          this.animateVector3(item.object.position, target, {
            duration: 300,
            easing : Easing.Quadratic.InOut,
            update: function(d) {
            },
            callback : function(){
            }
          });
        },10000+(Math.floor(Math.random() * 100)));
      }
    });
  }

  rotateAllItems() {
    this.moveBudgetGroupBack();
    this.itemsInScene.forEach((item, index)=> {
      //console.log("Rotate:"+item.id);
      const oldX = item.object.rotation.x;
      const newX = oldX+Math.PI;
       item.tween = new Tween(item.object.rotation)
      .to({ x: "-" + newX }, 650) // relative animation
      .delay(0)
      .on('complete', () => {
          // Check that the full 360 degrees of rotation,
          // and calculate the remainder of the division to avoid overflow.
          //console.log("Rotate reset");
          if (Math.abs(item.object.rotation.y)>=2*Math.PI) {
            item.object.rotation.y = item.object.rotation.y % (2*Math.PI);
          }
          item.object.rotation.y=0;
          item.tween.stop();
          item.tween=null;
      })
      .start();
    });
  }

  rotateAllItemsGroup() {
 //   this.budgetGroup3d.updateMatrix();
    this.moveBudgetGroupBack();
//    this.rotateBudgetGroupBack();
    setTimeout(()=>{
      if (!this.budgetGroup3d.runningRotateX) {
        const oldX = this.budgetGroup3d.rotation.x;
        const newX = oldX+Math.PI;
        this.budgetGroup3d.runningRotateX = new Tween(this.budgetGroup3d.rotation)
        .to({ x: "-" + newX }, 650) // relative animation
        .delay(0)
        .on('complete', () => {
            this.budgetGroup3d.rotation.x=0;
            this.budgetGroup3d.runningRotateX = null;
          })
        .start();
      }
    }, 1000);
  }


  rotateTimeShift() {
    // Tween remove all
   // removeAll();
    this.itemsInScene.forEach((item, index)=> {
      //console.log("Rotate timeshift:"+item.id);
      let random;
      if (this.itemsInScene.length>30) {
        random = Math.floor((Math.random() * 5));
      } else if (this.itemsInScene.length>20) {
        random = Math.floor((Math.random() * 4));
      } else if (this.itemsInScene.length>10) {
        random = Math.floor((Math.random() * 3));
      } else {
        random = Math.floor((Math.random() * 2));
      }
      if (!item.tween && random==0) {
        const oldX = item.object.rotation.x;
        const newX = oldX+Math.PI;
        item.tween =  new Tween(item.object.rotation)
        .to({ x: "-" + newX}, 900) // relative animation
        .delay(0)
        .on('complete', () => {
            // Check that the full 360 degrees of rotation,
            // and calculate the remainder of the division to avoid overflow.
            //console.log("Rotate reset");
            item.object.rotation.x=0;
            if (Math.abs(item.object.rotation.y)>=2*Math.PI) {
              item.object.rotation.y = item.object.rotation.y % (2*Math.PI);
            }
            item.tween.stop();
            item.tween=null;
        })
        .start();
      }
    });
  }

  moveBudgetGroupBack() {
    const newX = this.itemsInScene.length>10 ?  (this.defaultGroupPos.x-(this.defaultGroupPos.x*0.1)) : (this.defaultGroupPos.x-(this.defaultGroupPos.x*0.2));
    const newZ = -7;
    if (!this.budgetGroup3d.runningMoveX) {
      this.budgetGroup3d.runningMoveX=true;
      new Tween(this.budgetGroup3d.position)
      .to({ x: this.budgetGroup3d.position.x, y: this.budgetGroup3d.position.y, z: newZ }, 350)
      .delay(0)
      .easing(Easing.Quadratic.InOut)
      .on('complete', () => {
        new Tween(this.budgetGroup3d.position)
        .to({ x: this.defaultGroupPos.x, y: this.defaultGroupPos.y, z: this.defaultGroupPos.z }, 650) // relative animation
        .delay(1100)
        .easing(Easing.Quadratic.InOut)
        .on('complete', () => {
          this.budgetGroup3d.runningMoveX=false;
        })
        .start();
      })
      .start();
    }
  }

  rotateBudgetGroupBack() {
    const oldZ = this.budgetGroup3d.rotation.z;
    const newZ = oldZ+Math.PI;
    if (!this.budgetGroup3d.runningRotY) {
      this.budgetGroup3d.runningRotY = new Tween(this.budgetGroup3d.rotation)
      .to({y: "-" + newZ}, 420)
      .delay(0)
      .easing(Easing.Quadratic.InOut)
      .on('complete', () => {
        this.budgetGroup3d.rotation.y=0;
        this.budgetGroup3d.runningRotY=null;
      })
      .start();
    }
  }

  moveCameraCloseAndBack() {
    const newX = this.itemsInScene.length>10 ?  (this.defaultCameraPos.x-(this.defaultCameraPos.x*0.1)) : (this.defaultCameraPos.x-(this.defaultCameraPos.x*0.2));
    const newZ = 18;
    new Tween(this.camera.position)
    .to({ x: newX, y: this.camera.position.y, z: newZ }, 350)
    .delay(0)
    .easing(Easing.Quadratic.InOut)
    .on('complete', () => {
      new Tween(this.camera.position)
      .to({ x: this.defaultCameraPos.x, y: this.defaultCameraPos.y, z: this.defaultCameraPos.z }, 650) // relative animation
      .delay(1100)
      .easing(Easing.Quadratic.InOut)
      .on('complete', () => {

      })
      .start();
    })
    .start();
  }

  _removeItemFromDiv(item) {
    this.itemsInScene.forEach((sceneItem, index) => {
      if (sceneItem.id==item.id) {
        this.itemsInScene.splice(index, 1);
        this.budgetGroup3d.remove(sceneItem.object);
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
