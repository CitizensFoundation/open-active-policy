import { TextGeometry, BufferGeometry, Mesh, MeshPhongMaterial} from 'three';

const fontMeshCache = {};
const fontGeometryCache = {};

const _getTextGeometry = (value, font, options) => {
  let geoOptions;
  if (options.large) {
    geoOptions = {
      font: font,
      size: window.innerWidth>600 ? 10 : 5,
      height: window.innerWidth>600 ? 2 : 1.2,
      curveSegments: window.innerWidth>600 ? 15 : 12,
      bevelEnabled: true,
      bevelThickness: window.innerWidth>600 ? 1 : 0.7,
      bevelSize:  window.innerWidth>600 ? 0.9 : 0.5,
      bevelOffset: 0,
      bevelSegments:  window.innerWidth>600 ? 7 :7
    }
  } else {
    geoOptions = {
      font: font,
      size: window.innerWidth>600 ? 5.5 : 4.5,
      height: window.innerWidth>600 ? 1.5 : 1.2,
      curveSegments: window.innerWidth>600 ? 10 : 8,
      bevelEnabled: true,
      bevelThickness: window.innerWidth>600 ? 0.3 : 0.2,
      bevelSize:  window.innerWidth>600 ? 0.5 : 0.3,
      bevelOffset: 0,
      bevelSegments:  window.innerWidth>600 ? 7 :7
    }
  }

  let geometry = new TextGeometry( value, geoOptions);

  geometry.computeBoundingBox();
  geometry.computeVertexNormals();
  geometry.center();
  geometry = new BufferGeometry().fromGeometry( geometry );
  return geometry;
}

async function PerformDelayedFontCaching(font3d) {
  for (var i = 130; i >= 75; i--) {
    await new Promise(resolve => setTimeout(resolve, 300 ));
    GetTextGeometry(i+"cp", font3d, { large: true });
  }

  for (var i = 12; i > -15; i--) {
    await new Promise(resolve => setTimeout(resolve, 300 ));
    GetTextGeometry(i+"cp", font3d, { large: false });
  }

  for (var i = 162; i >= 129; i--) {
    await new Promise(resolve => setTimeout(resolve, 500 ));
    GetTextGeometry(i+"cp", font3d, { large: true });
  }

  for (var i = 30; i > -30; i--) {
    await new Promise(resolve => setTimeout(resolve, 600 ));
    GetTextGeometry(i+"cp", font3d, { large: false });
  }

  for (var i = 74; i >= 0; i--) {
    await new Promise(resolve => setTimeout(resolve, 600 ));
    GetTextGeometry(i+"cp", font3d, { large: true });
  }

}

export const StartDelayedFontCaching = (font3d) => {
  PerformDelayedFontCaching(font3d);
}

export const GetTextMesh = (value, font, options) => {
  if (fontMeshCache[value+options.large]) {
    console.error("Got mesh from cache"+value);
    return fontMeshCache[value+options.large];
  } else {
    const geometry = _getTextGeometry(value, font, options);
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
    fontGeometryCache[value+options.large] = _getTextGeometry(value, font, options);
    console.error("Have saved geometry "+value);
    return fontGeometryCache[value+options.large];
  }
}

