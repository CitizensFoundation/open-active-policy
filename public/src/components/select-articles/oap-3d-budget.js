import { html } from 'lit-element';

import { Oap3DBudgetStyles } from './oap-3d-budget-styles';
import { OapShadowStyles } from '../oap-shadow-styles';
import { OapFlexLayout } from '../oap-flex-layout.js';

import { Scene,PerspectiveCamera,Group,DoubleSide,Object3D,SpotLight,MeshStandardMaterial, BufferGeometry,MeshPhongMaterial,WebGLRenderer,TextGeometry,Box3,FontLoader,DirectionalLight,AmbientLight,Vector2,Vector3,BoxGeometry,Mesh,MeshBasicMaterial} from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Tween, Easing, update as UpdateTween, removeAll } from 'es6-tween';
import { Get2DEmoji } from '../3d-utils/oap-2d-emojis';
import { GetTextGeometry, GetTextMesh } from  '../3d-utils/oap-cached-text-geometry';

import { OapBaseElement } from '../oap-base-element.js';

class Oap3dBudget extends OapBaseElement {
  static get properties() {
    return {
      selectedItems: {
        type: Array
      },

      noSelectedItems: {
        type: Boolean
      },

      areaName: {
        type: String
      },

      usedChoicePoints: {
        type: Number
      },

      totalChoicePoints: {
        type: Number
      },

      choicePointsLeft: {
        type: Number
      },

      usedChoicePointsIsOne: {
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
    };
  }

  setupScene () {
    const width=this.votesWidth;
    const height=200;
    const xCamera = width*0.0230;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(30, width/height, 1, 10000);
    this.camera.position.set(xCamera, -0.7, 22);
    this.defaultCameraPos = JSON.parse(JSON.stringify(this.camera.position));
    this.defaultCameraRot = JSON.parse(JSON.stringify(this.camera.rotation));
    this.camera.layers.enable(1);
    this.renderer = new WebGLRenderer({antialias: true});
    this.renderer.setSize(width, height);
    this.renderer.setClearColor( 0x000000 );
    this.renderer.setPixelRatio( window.devicePixelRatio );

   // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.directionalLight = new DirectionalLight(0xffffff, 0.65);
    this.directionalLight.position.setScalar(100);
    this.scene.add(this.directionalLight);
    this.ambientLight = new AmbientLight(0xffffff, 0.27);
    this.scene.add(this.ambientLight);

    const renderScene = new RenderPass( this.scene, this.camera );
    const effectFXAA = new ShaderPass( FXAAShader );
    effectFXAA.uniforms.resolution.value.set( 1 / width, 1 / height );

    const bloomPass = new UnrealBloomPass( new Vector2( width, height ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = 0.22;
    bloomPass.strength = 1.3;
    bloomPass.radius = 0.50;
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

    if (this.font3d) {
      this.rebuildChoicePoints(true);
    } else {
      loader.load( 'https://open-active-policy-public.s3-eu-west-1.amazonaws.com/helvetiker_regular.typeface.json', function ( font ) {
        this.font3d = font;
        this.rebuildChoicePoints(true);
      }.bind(this));
    }

//    scene.add( new AxesHelper( 1 ) );
    this.renderScene();
  }

  getLeftOfCamera() {
    let fudgetFactor;
    if (window.innerWidth<450) {
      fudgetFactor = 8;
    } else if (window.innerWidth<950) {
      fudgetFactor = -8;
    } else {
      fudgetFactor = -16;
    }
    var fov = this.camera.fov / 180 * Math.PI / 2;
    var adjacent = this.camera.position.distanceTo( this.scene.position );
    return -((Math.tan( fov ) * adjacent  * this.camera.aspect)+fudgetFactor);
  }

  rebuild3dEmoji(emoji,xText,startFudge) {
    let fudgetFactor;
    if (window.innerWidth<450) {
      fudgetFactor = -13;
    } else if (window.innerWidth<950) {
      fudgetFactor = -15;
    } else {
      fudgetFactor = -17;
    }

    this.bonusPenaltyEmoji2D = Get2DEmoji(emoji, '120px Arial');
    this.bonusPenaltyEmoji2D.position.x = fudgetFactor;
    this.bonusPenaltyEmoji2D.position.y = 1;
    this.bonusPenaltyEmoji2D.position.z = 0;
  }

  bonusPenalty3dText(value, emoji) {
    if (value!=0) {
      this.rotateAllItemsGroup();
      if (this.font3d) {
        let textValue;
        let isMinus = false;
        let isPlus = false;
        if (value>0) {
          isPlus = true;
        } else if (value<0) {
          isMinus = true;
        }
        textValue = Math.abs(value).toString();

        let geometry = GetTextGeometry(textValue, this.font3d, { large: false });

        const xText = this.votesWidth*0.070;

        let color;
        if (value>0) {
          color=0x00FF00;
        } else {
          color=0xFF0000;
        }

        let startFudge = 100;
        let endFudge = 10;
        if (window.innerWidth<600) {
          startFudge = 36;
          endFudge = 20;
        }

        let roughness = Math.random();
        let metalness = Math.random();

        roughness=0.7;
        metalness=0.9;

        this.bonusMaterial = new MeshStandardMaterial( {
          color: color,
          roughness: roughness,
          metalness:metalness,

          side: DoubleSide
        } );

        if (this.bonusPenaltyFontTween) {
          this.bonusPenaltyFontTween.stop();
          this.bonusPenaltyGroup.position.x=this.getLeftOfCamera();
        }

        if (this.bonusPenaltyGroup==null) {
          this.bonusPenaltyFontMesh = new Mesh( geometry, this.bonusMaterial );
          this.bonusPenaltyFontMesh.position.x = 0;
          this.bonusPenaltyFontMesh.position.y = -1.5;
          this.bonusPenaltyFontMesh.position.z = 0;
          //this.bonusPenaltyFontMesh.castShadow = true;

          this.bonusPenaltyFontMesh.remove(this.bonusPenaltyEmoji2D);
          this.rebuild3dEmoji(emoji, xText, startFudge);
          this.bonusPenaltyFontMesh.add(this.bonusPenaltyEmoji2D);
          this.bonusPenaltyGroup = new Group();
          //this.bonusPenaltyGroup.castShadow = true;
          this.bonusPenaltyGroup.add(this.bonusPenaltyFontMesh);
          this.bonusPenaltyGroup.position.x=this.getLeftOfCamera();
          this.bonusPenaltyGroup.position.y=1;
          this.bonusPenaltyGroup.position.z=-10;
          this.scene.add(this.bonusPenaltyGroup);
        } else {
          this.bonusPenaltyFontMesh.material.color.set(color);
          this.bonusPenaltyFontMesh.geometry=geometry;
          this.bonusPenaltyFontMesh.remove(this.bonusPenaltyEmoji2D);
          this.rebuild3dEmoji(emoji, xText, startFudge);
          this.bonusPenaltyFontMesh.add(this.bonusPenaltyEmoji2D);
          this.bonusPenaltyFontMesh.material = this.bonusMaterial;
        }

        let smallScreenMultiplier = window.innerWidth>600 ? 1.0 : 0.63;
        if (isMinus) {
          if (!this.minusMesh) {
            this.minusMesh = new Mesh( GetTextGeometry("-", this.font3d, { large: false }), this.bonusMaterial );
            this.minusMesh.position.x = 0;
            this.minusMesh.position.y = -1.5;
            this.minusMesh.position.z = 0;
            this.bonusPenaltyGroup.add(this.minusMesh);
          }
          if (value>9) {
            this.minusMesh.position.x = -9.5*smallScreenMultiplier;
          } else {
            this.minusMesh.position.x = -5.5*smallScreenMultiplier;
          }
          this.minusMesh.visible = true;
          this.minusMesh.material.color.set(0xFF0000);
        } else {
          if (this.minusMesh) {
            this.minusMesh.visible = false;
            this.minusMesh.material.color.set(0xFF0000);
          }
        }

        if (isPlus) {
          if (!this.plusMesh) {
            this.plusMesh = new Mesh( GetTextGeometry("+", this.font3d, { large: false }), this.bonusMaterial );
            this.plusMesh.position.y = -1.5;
            this.plusMesh.position.z = 0;
            this.bonusPenaltyGroup.add(this.plusMesh);
          }
          if (value>9) {
            this.plusMesh.position.x = -9.5*smallScreenMultiplier;
          } else {
            this.plusMesh.position.x = -6.5*smallScreenMultiplier;
          }
          this.plusMesh.visible = true;
          this.plusMesh.material.color.set(0x00FF00);
        } else {
          if (this.plusMesh) {
            this.plusMesh.visible = false;
            this.plusMesh.material.color.set(0x00FF00);
          }
        }

        this.bonusPenaltyGroup.visible=true;

        if (!this.cameraSpotLight) {
          this.cameraSpotLight = new SpotLight( 0xffffff, 0.5 );
          this.cameraSpotLight.position.copy(this.camera.position);
          this.cameraSpotLight.target=this.bonusPenaltyGroup;
          //this.cameraSpotLight.castShadow = true;
          this.cameraSpotLight.angle = 0.55;
          this.cameraSpotLight.penumbra = 0.52;
          this.cameraSpotLight.distance = 260;
          this.scene.add(this.cameraSpotLight);
        } else {
          this.cameraSpotLight.visible=true;
        }

        if (this.bonusPenaltyFontRotation) {
          this.bonusPenaltyFontRotation.stop();
          this.bonusPenaltyFontMesh.rotation.y = 0;
        }

        this.fontMesh.material.color.set(color);

        setTimeout(()=>{
          this.bonusPenaltyFontTween = new Tween(this.bonusPenaltyGroup.position)
          .to({ x: xText+endFudge, y: this.bonusPenaltyGroup.position.y, z: this.bonusPenaltyGroup.position.z}, 2500) // relative animation
          .delay(0)
          .on('complete', () => {
            this.bonusPenaltyGroup.position.x=this.getLeftOfCamera();
            this.bonusPenaltyGroup.position.z=-10;
            this.bonusPenaltyFontTween=null;
            this.fontMesh.material.color.set(this.defaultChoicePointsColor);
            this.scene.remove(this.cameraSpotLight);
            this.cameraSpotLight.visible=false;
            this.bonusPenaltyGroup.visible=false;
            if (this.plusMesh)
              this.plusMesh.visible=false;
            if (this.minusMesh)
              this.minusMesh.visible=false;
          })
          .start();
        });

        if (false) {
          setTimeout(()=> {
            this.bonusPenaltyFontRotation = new Tween(this.bonusPenaltyFontMesh.rotation)
            .to({ y: "-" + this.bonusPenaltyFontMesh.rotation.y+(Math.PI*2)}, 300)
            .delay(0)
            .on('complete', () => {
              this.bonusPenaltyFontMesh.rotation.y = 0;
              this.bonusPenaltyFontRotation = null;
            })
            .start();
          }, 1500);
        }
      }
      }
  }

  rebuildChoicePoints(firstTime) {
    if (this.choicePointsLeft!=null && this.font3d) {
      let roughness = Math.random();
      let metalness = Math.random();
      if (roughness>0.8 && metalness>0.8) {
        roughness = Math.random();
        metalness = Math.random();
      }

      roughness=0.7;
      metalness=0.7;

      this.choicePointsMaterial = new MeshStandardMaterial( {
        color: this.defaultChoicePointsColor,
        roughness: roughness,
        metalness:metalness,

        side: DoubleSide
      } );

      if (this.fontMesh==null) {

        this.fontMesh = new Mesh(GetTextGeometry(this.choicePointsLeft.toString(), this.font3d, { large: true }),  this.choicePointsMaterial );

        const xText = this.votesWidth*0.076;

        this.fontMesh.position.y = 0;
        this.fontMesh.position.z = -33;
        if (window.innerWidth<600) {
          this.fontMesh.position.x = xText-2.0;
          this.fontMesh.position.z = -50;
        } else  if (window.innerWidth<1000) {
          this.fontMesh.position.x = xText-4.8;
        } else {
          this.fontMesh.position.x = xText;
        }

        this.fontMesh.rotation.x = 0;
        this.fontMesh.rotation.y = Math.PI * 2;
 //       this.cpMesh = new Mesh(GetTextGeometry(this.localize('cp'), this.font3d, { large: true }),  this.choicePointsMaterial );
        this.fontMesh.add(this.cpMesh);
        this.scene.add(this.fontMesh);
      } else {
        this.fontMesh.material = this.choicePointsMaterial;
 //       this.cpMesh.material = this.choicePointsMaterial;
        this.fontMesh.geometry=GetTextGeometry(this.choicePointsLeft.toString(), this.font3d, { large: true });
      }

      let smallScreenMultiplier = window.innerWidth>600 ? 1.0 : this.choicePointsLeft<100 ? 0.75 : 0.8;

      if (this.choicePointsLeft>99) {
//        this.cpMesh.position.x = 19.5*smallScreenMultiplier;
      } else if (this.choicePointsLeft>9) {
//        this.cpMesh.position.x = 17*smallScreenMultiplier;
      } else {
 //       this.cpMesh.position.x = 14*smallScreenMultiplier;
      }
 //     this.cpMesh.position.y = -3*smallScreenMultiplier;

      if (this.choicePointsLeft<75 || firstTime) {

        let duration=750;
        if (this.choicePointsLeft<40) {
          duration=600;
        }

        if (this.choicePointsLeft<20) {
          duration=300;
        }

        if (this.fontMeshTweenRotation) {
          this.fontMeshTweenRotation.stop();
          this.fontMeshTweenRotation = null;
          this.fontMesh.rotation.y=0;
        }
        //this.fontMesh.receiveShadow = true;

        this.fontMeshTweenRotation = new Tween(this.fontMesh.rotation)
        .to({ y: "-" + this.fontMesh.rotation.y+(Math.PI*2)}, duration) // relative animation
        .delay(0)
        .on('complete', () => {
            this.fontMesh.rotation.y=0;
        })
        .start();
      } else {

      }
    }
  }

  renderScene() {
    UpdateTween();

    this.renderer.autoClear = false;
    this.renderer.clear();

    this.camera.layers.set(1);
    this.composer.render();

    this.renderer.clearDepth();
    this.camera.layers.set(0);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renderScene.bind(this));

    if (this.cameraSpotLight && this.bonusPenaltyGroup) {
      this.cameraSpotLight.target =  this.bonusPenaltyGroup;
    }
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
    if (changedProps.has('usedChoicePoints')) {
      this.usedChoicePointsIsOne = (this.usedChoicePoints && this.usedChoicePoints===1.0);
      this.fire('oap-selected-budget-updated', this.usedChoicePoints);
    }

    if (changedProps.has('selectedItems')) {
      this._selectedItemsChanged();
      this.fire('oap-selected-items-changed', this.selectedItems);
    }

    if (changedProps.has('choicePointsLeft')) {
      this.rebuildChoicePoints();
      if (this.choicePointsLeft==0) {
        this.currentBallot.choicePointsAtZero();
      }
    }

    if (changedProps.has('totalChoicePoints')) {
      this.fire('oap-total-choice-points-changed', this.totalChoicePoints);
      if (this.itemsInScene.length>0 && this.totalChoicePoints!=changedProps.get("totalChoicePoints")) {
        console.error(this.totalChoicePoints+" "+ changedProps.get("totalChoicePoints"));
        this.resetItemsWidth();
        const oldtotalChoicePoints = changedProps.get("totalChoicePoints");
        if (oldtotalChoicePoints<this.totalChoicePoints) {
          //this.rotateTimeShift();
//          this.rotateAllItems();
          this.fire('oap-play-sound-effect', 'oap_short_win_1');
        }
      }
    }

    if (changedProps.has('usedChoicePoints')) {
      this.fire('oap-used-choice-points-changed', this.usedChoicePoints);
    }

    if (changedProps.has('usedChoicePoints') || changedProps.has('totalChoicePoints')) {
      console.error("Used "+this.usedChoicePoints+" of "+this.totalChoicePoints);
      var choicePointsLeft = this.totalChoicePoints-this.usedChoicePoints;
      if (choicePointsLeft>0) {
        this.choicePointsLeft = choicePointsLeft;
      } else {
        this.choicePointsLeft = 0;
      }
      if (this.currentBallot && this.currentBallot.currentBudget) {
        this.currentBallot.setStateOfRemainingItems();
      } else {
        setTimeout(()=> {
          if (this.currentBallot) {
            this.currentBallot.setStateOfRemainingItems();
          } else {
            setTimeout(()=> {
              this.currentBallot.setStateOfRemainingItems();
            }, 100);
          }
        }, 10);
      }
    }
    super.updated(changedProps);
  }

  static get styles() {
    return [
      Oap3DBudgetStyles,
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
    this.resetWidth();
    this.setupScene();
    this.resetWidthAnd3DItems();
    this.rebuildChoicePoints();
  installMediaQueryWatcher(`(min-width: 1024px)`,
      (matches) => {
        if (matches)
          this.wide = true;
        else
          this.wide = false;
        this.resetWidthAnd3DItems();
      });

    installMediaQueryWatcher(`(orientation: portrait)`,
      (matches) => {
        if (matches)
          this.orientationPortrait = true;
        else
          this.orientationPortrait = false;
        this.resetWidthAnd3DItems();
      });

    installMediaQueryWatcher(`(orientation: landscape)`,
      (matches) => {
        if (matches)
          this.orientationLandscape = true;
        else
          this.orientationLandscape = false;
        this.resetWidthAnd3DItems();
      });

    installMediaQueryWatcher(`(min-width: 640px)`,
      (matches) => {
        if (matches)
          this.mediumWide = true;
        else
          this.mediumWide = false;
        this.resetWidthAnd3DItems();
      });

    installMediaQueryWatcher(`(max-width: 340px)`,
      (matches) => {
        if (matches)
          this.mini = true;
        else
          this.mini = false;
        this.resetWidthAnd3DItems();
      });

  }

  constructor() {
    super();
    this.defaultChoicePointsColor = 0xeaeaea;
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

  resetWidth() {
    if (this.wide) {
      this.votesWidth = 940;
    } else {
      this.votesWidth = window.innerWidth;
    }
  }

  resetWidthAnd3DItems() {
    console.error("resetWidthAnd3DItems");
    this.resetWidth();
    if (this.itemsInScene && this.itemsInScene.length>0) {
      this.itemsInScene.forEach((item)=>{
        this.scene.remove(item.object);
      });
    }
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
    if (!this.selectedItems)
      this.selectedItems = [];
    this.fontGeometryCache = {};
    this.itemsInScene=[];
    this.cameraSpotLight = null;
    this.budgetGroup3d = null;
    this.choicePointsLeft = this.totalChoicePoints-this.usedChoicePoints;
    this.budgetHeaderImage = this.configFromServer.client_config.ballotBudgetLogo;
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
    var itemWidth = parseInt(this.votesWidth * (item.price / this.totalChoicePoints));

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

    let fudgetFactorPx;
    if (window.innerWidth>=600) {
      fudgetFactorPx = 0.039;
    } else {
      fudgetFactorPx = 0.0315;
    }
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
      let itemWidth = parseInt(this.votesWidth * (dItem.item.price / this.totalChoicePoints));
      let fudgetFactorPx;
      if (window.innerWidth>=600) {
        fudgetFactorPx = 0.039;
      } else {
        fudgetFactorPx = 0.0315;
      }
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

      if (item.positionTween) {
        item.positionTween.stop();
        item.positionTween=null;
      }

      item.positionTween = new Tween(item.object.position)
        .to(target, 500)
        .easing(Easing.Quadratic.InOut)
        .on('complete', ()=> {
          item.positionTween=null;
        }).start();

      rightEdgeAndSpace=(setX+currentWidth/2);
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
    }, 1900);
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
    const newZ = -15;
    if (this.budgetGroup3d.runningMoveX) {
      this.budgetGroup3d.runningMoveX.stop();
      this.budgetGroup3d.runningMoveX=null;
    }

    if (this.budgetGroup3d.runningMoveXTwo) {
      this.budgetGroup3d.runningMoveXTwo.stop();
      this.budgetGroup3d.runningMoveXTwo=null;
    }

    this.budgetGroup3d.runningMoveX = new Tween(this.budgetGroup3d.position)
    .to({ x: this.budgetGroup3d.position.x, y: this.budgetGroup3d.position.y, z: newZ }, 350)
    .delay(0)
    .easing(Easing.Quadratic.InOut)
    .on('complete', () => {
      this.budgetGroup3d.runningMoveX=null;
      this.budgetGroup3d.runningMoveXTwo = new Tween(this.budgetGroup3d.position)
      .to({ x: this.defaultGroupPos.x, y: this.defaultGroupPos.y, z: this.defaultGroupPos.z }, 1150) // relative animation
      .delay(1200)
      .easing(Easing.Quadratic.InOut)
      .on('complete', () => {
        this.budgetGroup3d.runningMoveX=null;
        this.budgetGroup3d.runningMoveXTwo=null;
      })
      .start();
    })
    .start();
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
      this.selectedItems = this.selectedItems.sort((itemA, itemB)=> {
        return itemA.module_type_index-itemB.module_type_index;
      });
      this.selectedItems = [
        ...this.selectedItems
      ];

      this.usedChoicePoints = this.usedChoicePoints - item.price;
      this.currentBallot.fire('oav-item-de-selected-from-budget', { itemId: item.id });
    } else {
      if (this.usedChoicePoints+item.price<=this.totalChoicePoints) {
        this.activity('add', 'vote');
        this.selectedItems.push(item);
        this.selectedItems = this.selectedItems.sort((itemA, itemB)=> {
          return itemA.module_type_index-itemB.module_type_index;
        });
        this.selectedItems = [
          ...this.selectedItems
        ];
        this._addItemToDiv(item);
        this.usedChoicePoints = this.usedChoicePoints + item.price;
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
