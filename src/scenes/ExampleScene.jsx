import * as THREE from 'three';
import { gsap } from 'gsap';
import Scene from './Scene';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { ANIMATION_DURATIONS, ANIMATION_EASE } from '@/constants/animation';
import { SCENE_IDS } from '@/constants/scenes';

export default class ExampleScene extends Scene {
  constructor({ t, resources, index }) {
    super({ t, resources, sceneId: SCENE_IDS.EXAMPLE, index });

    this.startSvgAnimation = false;
    this.animationGroup = new THREE.Group();
    this.cogsMeshes = [];
  }

  /**
   * Build 3D Elements from svg
   * @returns {Promise<void>}
   */
  async createSVGElements() {
    const data = this.resources.items['exampleElements'];
    if (!data) {
      console.error('ExampleElements: SVG not found in resources');
      return;
    }

    this.animationGroup.scale.set(0.0018, 0.0018, 0.0018);
    this.animationGroup.rotation.set(0, Math.PI, Math.PI - 0.48);
    this.animationGroup.position.set(-0.6, 0.1, 0.2);

    data.paths.forEach((path, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        depthWrite: false,
        transparent: true
      });

      const shapes = SVGLoader.createShapes(path);
      shapes.forEach((shape) => {
        const geometry = new THREE.ShapeGeometry(shape);
        geometry.computeBoundingBox();

        const center = geometry.boundingBox.getCenter(new THREE.Vector3());
        geometry.translate(-center.x, -center.y, -center.z);

        const mesh = new THREE.Mesh(geometry, material);

        const pivot = new THREE.Object3D();
        pivot.position.copy(center);
        pivot.add(mesh);

        mesh.userData = {
          speed: index % 2 === 0 ? 0.01 + index * 0.005 : -0.01 - index * 0.005
        };
        mesh.renderOrder = 1;

        this.cogsMeshes.push(mesh);
        this.animationGroup.add(pivot);
      });
    });

    this.group.add(this.animationGroup);
  }

  onTargetFound() {
    this.startAnimation();
  }

  onTargetLost() {
    this.resetAnimation();
  }

  /**
   * Intro Animations - fade in and animating svg elements
   */
  startAnimation() {
    const tl = gsap.timeline({
      onComplete: () => {
        this.startSvgAnimation = true;
      }
    });

    tl.fromTo(
      this.headline.material,
      { opacity: 0 },
      {
        opacity: 1,
        duration: ANIMATION_DURATIONS.fadeIn,
        ease: ANIMATION_EASE.default,
        onUpdate: () => this.headline.sync()
      }
    );

    if (this.backgroundPlane) {
      tl.fromTo(
        this.backgroundPlane.material,
        { opacity: 0 },
        { opacity: 1, duration: ANIMATION_DURATIONS.fadeIn, ease: ANIMATION_EASE.default },
        0
      );
    }

    this.cogsMeshes.forEach((mesh) => {
      tl.fromTo(
        mesh.material,
        { opacity: 0 },
        { opacity: 1, duration: ANIMATION_DURATIONS.fadeIn, ease: ANIMATION_EASE.default },
        0
      );
    });
  }

  resetAnimation() {
    this.startSvgAnimation = false;
    this.cogsMeshes.forEach((mesh) => {
      mesh.material.opacity = 0;
    });
    if (this.headline) this.headline.material.opacity = 0;
    if (this.backgroundPlane) this.backgroundPlane.material.opacity = 0;
  }

  update(deltaTime) {
    if (this.startSvgAnimation && this.animationGroup) {
      this.animationGroup.children.forEach((pivot) => {
        pivot.rotation.z += pivot.children[0].userData.speed * deltaTime * 60;
      });
    }
  }
}
