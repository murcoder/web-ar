// utils/Resources.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { loadSVG } from '@/utils/loader.js';
import EventEmitter from './EventEmitter.js';

export default class Resources extends EventEmitter {
  constructor (sources) {
    super();

    this.sources = sources;
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders () {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.svgLoader = new SVGLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
  }

  startLoading () {
    for (const source of this.sources) {
      console.log(`Loading ${source}`);
      switch (source.type) {
        case 'gltfModel':
          this.loaders.gltfLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;

        case 'texture':
          this.loaders.textureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;

        case 'cubeTexture':
          this.loaders.cubeTextureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;

        case 'svg':
          loadSVG(source.path)
            .then((data) => this.sourceLoaded(source, data))
            .catch((err) => console.error(`Failed to load ${source.path}`, err));
          break;

        default:
          console.warn(`Unknown resource type: ${source.type}`);
          this.sourceLoaded(source, null);
          break;
      }
    }
  }

  sourceLoaded (source, file) {
    this.items[source.name] = file;
    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger('ready');
    }
  }
}
