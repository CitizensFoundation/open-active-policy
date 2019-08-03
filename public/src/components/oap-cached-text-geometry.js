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
      size: window.innerWidth>600 ? 10 : 5,
      height: window.innerWidth>600 ? 1.5 : 1.0,
      curveSegments: window.innerWidth>600 ? 12 : 10,
      bevelEnabled: true,
      bevelThickness: window.innerWidth>600 ? 0.7 : 0.5,
      bevelSize:  window.innerWidth>600 ? 0.8 : 0.5,
      bevelOffset: 0,
      bevelSegments:  window.innerWidth>600 ? 7 : 7
    }
  } else {
    geoOptions = {
      font: font,
      size: window.innerWidth>600 ? 5.5 : 4.5,
      height: window.innerWidth>600 ? 1.5 : 1.2,
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
    return delay*2;
  } else {
    return delay;
  }
}

async function PerformDelayedFontCaching(font3d, options) {
  GetTextGeometry("cp", font3d, { large: true, isCaching: true });
  await new Promise(resolve => setTimeout(resolve, isSlow(options) ? getDelay(1200) : getDelay(300)));

  GetTextGeometry("cp", font3d, { large: false, isCaching: true });
  GetTextGeometry("+", font3d, { large: false, isCaching: true });
  GetTextGeometry("-", font3d, { large: false, isCaching: true });

  for (var i = 125; i >= 75; i--) {
    await new Promise(resolve => setTimeout(resolve, isSlow(options) ? getDelay(1200) : getDelay(300)));
    GetTextGeometry(i, font3d, { large: true, isCaching: true });
  }

  for (var i = 30; i >=0; i--) {
    await new Promise(resolve => setTimeout(resolve, isSlow(options) ? getDelay(1200) : getDelay(300) ));
    GetTextGeometry(i, font3d, { large: false, isCaching: true });
  }

  for (var i = 162; i >= 124; i--) {
    await new Promise(resolve => setTimeout(resolve, isSlow(options) ? getDelay(1500) : getDelay(500) ));
    GetTextGeometry(i, font3d, { large: true, isCaching: true });
  }

  for (var i = 74; i >= 0; i--) {
    await new Promise(resolve => setTimeout(resolve, isSlow(options) ? getDelay(1500) : getDelay(500) ));
    GetTextGeometry(i, font3d, { large: true, isCaching: true });
  }

}

export const SetForceSlowOnFontCaching = () => {
  forceSlow = true;
}

export const StartDelayedFontCaching = (font3d, options) => {
//  PerformDelayedFontCaching(font3d, options);
}

export const GetTextMesh = (value, font, options) => {
  if (fontMeshCache[value+options.large]) {
    console.error("Got mesh from cache"+value);
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
    console.error("Have saved mesh "+value);
    return fontMeshCache[value+options.large];
  }
}

export const GetTextGeometry = (value, font, options) => {
  if (fontGeometryCache[value+options.large]) {
    console.error("Got geometry from cache"+value);
    return fontGeometryCache[value+options.large];
  } else {
    let geometry;
    if (options && options.isCaching) {
      geometry = _getTextGeometrySync(value, font, options);
    } else {
      geometry = _getTextGeometrySync(value, font, options);
    }

    fontGeometryCache[value+options.large] = geometry;
    console.error("Have saved geometry "+value);
    return fontGeometryCache[value+options.large];
  }
}

