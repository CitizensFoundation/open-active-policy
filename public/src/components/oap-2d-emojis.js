import { Object3D, Math as ThreeMath, Vector2, LinearMipMapLinearFilter, DoubleSide, Sprite, SpriteMaterial, Texture, NearestFilter} from 'three';

const textAlign = {
  center: new Vector2(0, 0),
  left: new Vector2(1, 0),
  top: new Vector2(0, -1),
  topLeft: new Vector2(1, -1),
  topRight: new Vector2(-1, -1),
  right: new Vector2(-1, 0),
  bottom: new Vector2(0, 1),
  bottomLeft: new Vector2(1, 1),
  bottomRight: new Vector2(-1, 1),
}

const fontHeightCache = {};
const emojiSpriteCache = {};

const getFontHeight = (fontStyle) => {
  var result = fontHeightCache[fontStyle];

  if (!result)
  {
    var body = document.getElementsByTagName('body')[0];
    var dummy = document.createElement('div');

    var dummyText = document.createTextNode('MÉq');
    dummy.appendChild(dummyText);
    dummy.setAttribute('style', `font:${ fontStyle };position:absolute;top:0;left:0`);
    body.appendChild(dummy);
    result = dummy.offsetHeight;

    fontHeightCache[fontStyle] = result;
    body.removeChild(dummy);
  }

  return result;
}

class CanvasText {

  constructor () {
    this.textWidth = null;
    this.textHeight = null;

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  get width () { return this.canvas.width }
  get height () { return this.canvas.height }

  drawText (text, ctxOptions) {
    this.ctx.font = ctxOptions.font

    const lineHeight = getFontHeight(ctxOptions.font);
    const lines = (text || "").toString().split("\n");
    this.textWidth = Math.max.apply(null, lines.map(line => Math.ceil(this.ctx.measureText(line).width)));
    this.textHeight = lineHeight + lineHeight * ctxOptions.lineHeight * (lines.length - 1);

    // 2 = prevent canvas being 0 size when using empty / null text
    this.canvas.width = Math.max(2, ThreeMath.ceilPowerOfTwo(this.textWidth));
    this.canvas.height = Math.max(2, ThreeMath.ceilPowerOfTwo(this.textHeight));

    this.ctx.font = ctxOptions.font

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = ctxOptions.fillStyle
    if (ctxOptions.align.x === 1) this.ctx.textAlign = 'left';
    else if (ctxOptions.align.x === 0) this.ctx.textAlign = 'center';
    else this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'top';
    this.ctx.shadowColor = ctxOptions.shadowColor;
    this.ctx.shadowBlur = ctxOptions.shadowBlur;
    this.ctx.shadowOffsetX = ctxOptions.shadowOffsetX;
    this.ctx.shadowOffsetY = ctxOptions.shadowOffsetY;

    const x = this.textWidth * (0.5 - ctxOptions.align.x * 0.5);
    for (let i = 0; i < lines.length; i++) {
      this.ctx.fillText(lines[i], x, lineHeight * ctxOptions.lineHeight * i);
    }
    return this.canvas
  }
}

class Text2D extends Object3D {
  constructor(text, options) {
    super();

    this._align = new Vector2();
    this._font = options.font || '164px Arial';
    this._fillStyle = options.fillStyle || '#FFFFFF';

    this._shadowColor = options.shadowColor || 'rgba(0, 0, 0, 0)';
    this._shadowBlur = options.shadowBlur || 0;
    this._shadowOffsetX = options.shadowOffsetX || 0;
    this._shadowOffsetY = options.shadowOffsetY || 0;
    this._lineHeight = options.lineHeight || 1.2;

    this.canvas = new CanvasText()

    this.align = options.align || textAlign.center
    this.side = options.side || DoubleSide

    // this.anchor = Label.fontAlignAnchor[ this._textAlign ]
    this.antialias = (typeof options.antialias === "undefined") ? true : options.antialias
    this.text = text;
  }

  get width () { return this.canvas.textWidth }
  get height () { return this.canvas.textHeight }

  get text() { return this._text; }
  set text(value) {
    if (this._text !== value) {
      this._text = value;
      this.updateText();
    }
  }

  get font() { return this._font; }
  set font(value) {
    if (this._font !== value) {
      this._font = value;
      this.updateText();
    }
  }

  get fillStyle() {
    return this._fillStyle;
  }

  set fillStyle(value) {
    if (this._fillStyle !== value) {
      this._fillStyle = value;
      this.updateText();
    }
  }

  get align() {
    return this._align;
  }

  set align(value) {
    this._align.copy(value);
  }

  cleanUp () {
    if (this.texture) {
      this.texture.dispose()
    }
  }

  applyAntiAlias () {
    if (this.antialias === false) {
      this.texture.magFilter = NearestFilter
      this.texture.minFilter = LinearMipMapLinearFilter
    }
  }
}

class SpriteText2D extends Text2D {

  raycast () {
    return this.sprite.raycast.apply(this.sprite, arguments)
  }

  updateText() {
    this.canvas.drawText(this._text, {
      font: this._font,
      fillStyle: this._fillStyle,
      shadowBlur: this._shadowBlur,
      shadowColor: this._shadowColor,
      shadowOffsetX: this._shadowOffsetX,
      shadowOffsetY: this._shadowOffsetY,
      lineHeight: this._lineHeight,
      align: this.align
    })

    // cleanup previous texture
    this.cleanUp()

    this.texture = new Texture(this.canvas.canvas);
    this.texture.needsUpdate = true;
    this.applyAntiAlias()

    if (!this.material) {
      this.material = new SpriteMaterial({ map: this.texture });

    } else {
      this.material.map = this.texture
    }

    if (!this.sprite) {
      this.sprite = new Sprite( this.material )
      this.add(this.sprite)
    }

    this.sprite.scale.set(this.canvas.width, this.canvas.height, 1)

    this.updateAlign();
  }

  updateAlign() {
    if (this.sprite) {
      this.sprite.center.x = (0.5 - this._align.x * 0.5) * this.canvas.textWidth / this.canvas.width;
      this.sprite.center.y = 1 - (this._align.y * 0.5 + 0.5) * this.canvas.textHeight / this.canvas.height;
    }
  }

  get align() {
    return this._align;
  }

  set align(value) {
    this._align.copy(value);
    this.updateAlign();
  }
}

export const Get2DEmoji = (emoji, font) => {
  if (emojiSpriteCache[emoji]) {
    return emojiSpriteCache[emoji];
  } else {
    emojiSpriteCache[emoji] = new SpriteText2D(emoji, { align: textAlign.center, font: font ? font : '64px Arial', fillStyle: '#000000'});
    return emojiSpriteCache[emoji];
  }
}

