import { TextGeometry, BufferGeometry, Mesh, MeshPhongMaterial} from 'three';

const fontMeshCache = {};
const fontGeometryCache = {};
let forceSlow = false;
let isAndroid = null;

function  _getTextGeometryCore(value, font, options) {
  let geoOptions;
  if (options.large) {
    geoOptions = {
      font: font,
      size: window.innerWidth>600 ? 10 : 8,
      height: window.innerWidth>600 ? 1.2 : 0.6,
      curveSegments: window.innerWidth>600 ? 12 : 10,
      bevelEnabled: true,
      bevelThickness: window.innerWidth>600 ? 0.15 : 0.2,
      bevelSize:  window.innerWidth>600 ? 0.15 : 0.1,
      bevelOffset:  window.innerWidth>600 ? 0.25 : 0.2,
      bevelSegments:  window.innerWidth>600 ? 5 : 5
    }
  } else {
    geoOptions = {
      font: font,
      size: window.innerWidth>600 ? 5.5 : 4.5,
      height: window.innerWidth>600 ? 1.5 : 0.5,
      curveSegments: window.innerWidth>600 ? 8 : 6,
      bevelEnabled: true,
      bevelThickness: window.innerWidth>600 ? 0.2 : 0.1,
      bevelSize:  window.innerWidth>600 ? 0.4 : 0.3,
      bevelOffset: 0,
      bevelSegments:  window.innerWidth>600 ? 6 : 6
    }
  }

  let geometry = new TextGeometry( value, geoOptions);

  geometry.computeBoundingBox();
  geometry.computeVertexNormals();
  geometry.center();
  return geometry;
}

async function  _getTextGeometry(value, font, options) {
  let geometry = _getTextGeometryCore(value, font, options);
  geometry = BufferGeometry().fromGeometry(geometry);
  return geometry;
}

function  _getTextGeometrySync(value, font, options) {
  return new BufferGeometry().fromGeometry( _getTextGeometryCore(value, font, options) );
}

const isSlow = (options) => {
  return forceSlow || (options && options.slow);
}

const getDelay = (delay) => {
  if (isAndroid===null) {
    var ua = navigator.userAgent.toLowerCase();
    isAndroid = ua.indexOf("android") > -1;
  }

  if (isAndroid) {
    return delay*1.2;
  } else {
    return delay;
  }
}

async function PerformEarlyDelayedFontCaching(font3d, options) {
  for (var i = 15; i >= 0; i--) {
    await new Promise(resolve => setTimeout(resolve, isSlow(options) ? getDelay(1000) : getDelay(1000)));
    GetTextGeometry(i, font3d, { large: true, isCaching: true });
  }
}

async function PerformCacheWelcomeTexts(texts, font3d) {
  for (var i = 0; i<texts.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 500));
    GetTextGeometry(texts[i].title, font3d, { large: true, isCaching: true });
  }
}

async function PerformDelayedFontCaching(font3d, options) {
  GetTextGeometry("cp", font3d, { large: true, isCaching: true });
  await new Promise(resolve => setTimeout(resolve, isSlow(options) ? getDelay(900) : getDelay(300)));
  //GetTextGeometry("cp", font3d, { large: false, isCaching: true });
  //await new Promise(resolve => setTimeout(resolve, isSlow(options) ? getDelay(900) : getDelay(300)));
  GetTextGeometry("+", font3d, { large: false, isCaching: true });
  await new Promise(resolve => setTimeout(resolve, isSlow(options) ? getDelay(900) : getDelay(300)));
  GetTextGeometry("-", font3d, { large: false, isCaching: true });
  await new Promise(resolve => setTimeout(resolve, isSlow(options) ? getDelay(900) : getDelay(300)));

  for (var i = 130; i >= 75; i--) {
    await new Promise(resolve => setTimeout(resolve, isSlow(options) ? getDelay(900) : getDelay(300)));
    GetTextGeometry(i, font3d, { large: true, isCaching: true });
  }

  for (var i = 32; i >=0; i--) {
    await new Promise(resolve => setTimeout(resolve, isSlow(options) ? getDelay(900) : getDelay(300) ));
    GetTextGeometry(i, font3d, { large: false, isCaching: true });
  }

  for (var i = 74; i >= 0; i--) {
    await new Promise(resolve => setTimeout(resolve, isSlow(options) ? getDelay(900) : getDelay(300) ));
    GetTextGeometry(i, font3d, { large: true, isCaching: true });
  }

  for (var i = 165; i >= 129; i--) {
    await new Promise(resolve => setTimeout(resolve, isSlow(options) ? getDelay(900) : getDelay(300) ));
    GetTextGeometry(i, font3d, { large: true, isCaching: true });
  }
}

export const StartEarlyDelayedFontCaching = (font3d) => {
  PerformEarlyDelayedFontCaching(font3d, { large: true, isCaching: true});
}

export const StartPerformCacheWelcomeTexts = (texts, font3d) => {
  PerformCacheWelcomeTexts(texts, font3d);
}

export const SetForceSlowOnFontCaching = () => {
  forceSlow = true;
}

export const StartDelayedFontCaching = (font3d, options) => {
  PerformDelayedFontCaching(font3d, options);
}

export const GetTextMesh = (value, font, options) => {
  if (fontMeshCache[value+options.large]) {
    return fontMeshCache[value+options.large];
  } else {
    let geometry;
    if (options && options.isCaching) {
      geometry = _getTextGeometrySync(value, font, options);
    } else {
      geometry = _getTextGeometrySync(value, font, options);
    }
    var materials = [
      new MeshPhongMaterial( { color: 0xFF5722, flatShading: true } ), // front
      new MeshPhongMaterial( { color: 0xFF5722 } ) // side
    ];

    fontMeshCache[value+options.large] = new Mesh( geometry, materials );
    return fontMeshCache[value+options.large];
  }
}

export const GetTextGeometry = (value, font, options) => {
  if (fontGeometryCache[value+options.large]) {
    return fontGeometryCache[value+options.large];
  } else {
    let geometry;
    if (options && options.isCaching) {
      geometry = _getTextGeometrySync(value, font, options);
    } else {
      geometry = _getTextGeometrySync(value, font, options);
    }

    fontGeometryCache[value+options.large] = geometry;
    return fontGeometryCache[value+options.large];
  }
}

