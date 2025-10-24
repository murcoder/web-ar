import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

/** Load a GLTF model */
export const loadGLTF = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => resolve(gltf), undefined, reject);
  });
};

/** Load an audio file */
export const loadAudio = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new THREE.AudioLoader();
    loader.load(path, (buffer) => resolve(buffer), undefined, reject);
  });
};

/** Load a video element */
export const loadVideo = (path) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.addEventListener('loadedmetadata', () => {
      video.setAttribute('playsinline', '');
      resolve(video);
    });
    video.src = path;
    video.load();
  });
};

/** Load a single texture */
export const loadTexture = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(path, (texture) => resolve(texture), undefined, reject);
  });
};

/** Load multiple textures */
export const loadTextures = (paths) => {
  const loader = new THREE.TextureLoader();
  return Promise.all(
    paths.map(
      (path) =>
        new Promise((resolve, reject) => {
          loader.load(path, (texture) => resolve(texture), undefined, reject);
        })
    )
  );
};

/** Load an SVG file */
export const loadSVG = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new SVGLoader();
    loader.load(path, resolve, undefined, reject);
  });
};

/** Predefined font paths for global use */
export const FONT_PATHS = {
  default: '/fonts/NotoSans-Regular.subset.ttf',
  bold: '/fonts/NotoSans-Bold.subset.ttf',
  semibold: '/fonts/NotoSans-SemiBold.subset.ttf',
  italic: '/fonts/NotoSans-Italic.subset.ttf'
};
