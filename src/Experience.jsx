import * as THREE from 'three';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import SceneManager from './controllers/SceneManager';
import { useSceneStore } from '@/stores/sceneStore';
import { handleTabVisibility } from '@/utils/helper';
import Debug from '@/utils/Debug';
import Sizes from '@/utils/Sizes';
import Resources from '@/utils/Resources';
import sources from '@/constants/sources';
import EventEmitter from '@/utils/EventEmitter';

let instance = null;

/**
 * This is the AR Overlay for the Three.js Canvas
 */
export default class Experience {
  constructor(container, t, targetImgPath) {
    if (instance) return instance; // Singleton
    instance = this;
    window.MindARViewer = this;

    this.container = container;
    this.t = t;
    this.targetImgPath = targetImgPath;

    this.debug = new Debug();
    this.resources = new Resources(sources);
    this.sizes = new Sizes();
    this.events = new EventEmitter();

    this.mindarThree = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.anchors = [];
    this.time = Date.now();
    this.isInitialized = false;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this._clickProcessing = false;

    this._setupEventListeners();
    this._setupResources();
    this._setupResizeHandler();
    this._setupVisibilityHandler();
    this._setupLocaleHandler();
  }

  _setupEventListeners() {
    const clickHandler = (event) => this._handleClick(event);

    this.container.addEventListener('mousedown', clickHandler, false);
    this.container.addEventListener('touchstart', clickHandler, false);
  }

  _setupResources() {
    this.resources.on('ready', async () => {
      console.log('📦 Resources ready, initializing AR...');
      this.sceneManager = new SceneManager(this.t, this.resources);
      await this.init();
    });
  }

  _setupResizeHandler() {
    this.sizes.on('resize', () => this.resize());
  }

  _setupVisibilityHandler() {
    // Disable camera if browser tab is not active
    this.visibilityCleanup = handleTabVisibility(
      () => this.stopAR(),
      () => {
          this.resumeAR();
      }
    );
  }

  _setupLocaleHandler() {
    useSceneStore.subscribe(
      (state) => state.t,
      (t) => this.updateLocale(t)
    );
  }

  /**
   * Create MindAR-Canvas with camera, renderer, scene and start animation loop
   * @returns {Promise<void>}
   */
  async init() {
    if (this.isInitialized || document.hidden) return;

    // Initialize mind-ar | @see https://github.com/hiukim/mind-ar-js/blob/master/src/image-target/three.js#L14
    this.mindarThree = new MindARThree({
      container: this.container,
      imageTargetSrc: this.targetImgPath
    });

    const { renderer, scene, camera } = this.mindarThree;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;

    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xbbbbff, 5));

    if (!this.sceneManager) {
      console.error('SceneManager not ready!');
      return;
    }

    await this._setupAnchors();

    await this.mindarThree.start();
    this.startAnimationLoop();

    console.log('✅ AR initialized!');
    this.isInitialized = true;
  }

  async _setupAnchors() {
    const anchorCount = Object.keys(this.sceneManager.sceneMap).length;

    for (let i = 0; i < anchorCount; i++) {
      const anchor = this.mindarThree.addAnchor(i);
      this.anchors.push(anchor);

      const scene = await this.sceneManager.getScene(i);
      if (scene) anchor.group.add(scene.group);

      anchor.onTargetFound = () => this.sceneManager.onTargetFound(scene);
      anchor.onTargetLost = () => this.sceneManager.onTargetLost(scene);
    }
  }

  _handleClick(event) {
    if (this._clickProcessing) return;

    this._clickProcessing = true;
    setTimeout(() => (this._clickProcessing = false), 100);

    event.preventDefault();

    const rect = this.container.getBoundingClientRect();
    let clientX = event.clientX;
    let clientY = event.clientY;

    if (event.type === 'touchstart' && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    }

    this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Handle clicks on a 3D objects in the scene
    const intersects = this.raycaster
      .intersectObjects(this.scene.children, true)
      .filter(elem => elem.object.visible && elem.object.material?.opacity > 0.05);

    if (intersects.length === 0) return;

    // Grab first intersected object
    let object = intersects[0].object;

    // Find parent with a sceneIndex
    while (object && object.userData.sceneIndex == null) {
      object = object.parent;
    }

    if (!object || object.userData.sceneIndex == null) return;

    // Get the clicked scene
    const sceneIndex = object.userData.sceneIndex;
    const scene = this.sceneManager.cache[sceneIndex];
    if (!scene) return;

    this.events.trigger('scene.click', [
      {
        index: sceneIndex,
        sceneId: scene.sceneId
      }
    ]);
  }

  startAnimationLoop() {
    this.renderer.setAnimationLoop(() => {
      const deltaTime = (Date.now() - this.time) / 1000;
      this.time = Date.now();

      this.anchors.forEach((anchor, idx) => {
        const scene = this.sceneManager.cache[idx];
        scene?.update?.(deltaTime);
      });

      this.renderer.render(this.scene, this.camera);
    });
  }

  resize() {
    if (this.camera) {
      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();
    }
    if (this.renderer) {
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(this.sizes.pixelRatio);
    }
  }

  updateLocale(t) {
    this.t = t;
    this.sceneManager?.updateLocale(t);
  }

  stopAR() {
    if (!this.mindarThree) return;
    this.anchors.forEach((anchor) => {
      anchor.visible = false;
      if (anchor.onTargetLost) anchor.onTargetLost();
    });

    this.mindarThree.stop();
  }

  resumeAR() {
    if (!this.mindarThree) return;

    this.mindarThree.start();
  }

  dispose() {
    this.visibilityCleanup?.();

    this.mindarThree?.stop();
    this.renderer?.setAnimationLoop(null);
    this.renderer?.dispose();

    this.anchors.forEach((anchor) => {
      anchor.group?.traverse((obj) => {
        obj.geometry?.dispose();
        if (obj.material) {
          Array.isArray(obj.material)
            ? obj.material.forEach((mat) => mat.dispose())
            : obj.material.dispose();
        }
      });
      this.scene.remove(anchor.group);
    });

    this.anchors = [];
    this.container.innerHTML = '';
    console.log('MindARViewer disposed');
  }
}
