import * as THREE from 'three';
import { Text } from 'troika-three-text';
import { FONT_PATHS } from '@/utils/loader.js';

/**
 * Abstract scene class
 * Create individual 3D Scenes, placed on each target image
 */
export default class Scene {
  constructor ({ t, resources, sceneId, index }) {
    this.t = t; // i18n translator
    this.resources = resources; // preloaded resources (SVGs, models, etc.)
    this.sceneId = sceneId || ''; // i18n base key
    this.index = index; // anchor index (optional)

    // Root 3D group tagged with scene index for click detection
    this.group = new THREE.Group();
    this.group.userData.sceneIndex = this.index;
  }

  /**
   * Build all 3D elements and UI components for this scene.
   */
  async init () {
    await this.createHeadline();
    await this.createBackgroundPlane();
    await this.createSVGElements();

    if (this.updateTranslation && this.t) {
      this.updateTranslation(this.t);
    }
  }

  /**
   * Reload translations for scene elements.
   * @param {Function} t - Translation function
   */
  updateTranslation (t) {
    this.t = t;
    if (this.headline) {
      this.headline.text = this.getTranslatedString();
      this.headline.sync();
    }
  }

  /**
   * Get translated string for a given key.
   * @param {string} key
   * @returns {string}
   */
  getTranslatedString (key = 'title') {
    return this.t ? this.t(`scenes.${this.sceneId}.${key}`) : `scenes.${this.sceneId}.${key}`;
  }

  async createHeadline () {
    const headlineText = this.getTranslatedString();

    const headline = new Text();
    headline.text = headlineText;
    headline.fontSize = 0.15;
    headline.lineHeight = 1.2;
    headline.color = 0x000000;
    headline.anchorX = 'center';
    headline.anchorY = 'middle';
    headline.textAlign = 'center';
    headline.position.set(0, 0.6, 0);
    headline.font = FONT_PATHS.default;
    headline.renderOrder = 1;
    headline.sync();

    this.headline = headline;
    this.group.add(this.headline);
  }

  /**
   * Create a default background overlay.
   * TODO - autogenerate the plane by dimension of the given svg file
   */
  async createBackgroundPlane () {
    const geometry = new THREE.PlaneGeometry(1.5, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.position.z = 0.01;
    plane.renderOrder = -1; // Render behind other objects

    this.backgroundPlane = plane;
    this.group.add(this.backgroundPlane);
  }

  /**
   * Create SVG elements — to be implemented in derived scenes.
   */
  async createSVGElements () {
  }

  async createButtons () {
  }

  startAnimation () {
  }

  resetAnimation () {
  }

  update (deltaTime) {
  }
}
