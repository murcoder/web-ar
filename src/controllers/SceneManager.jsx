import ExampleScene from '@/scenes/ExampleScene.jsx';

export default class SceneManager {
  constructor (t, resources) {
    this.t = t;
    this.resources = resources;
    this.sceneMap = {
      0: ExampleScene,
      // ... add more scenes here as needed ...
    };
    this.cache = {};
  }

  async getScene (index) {
    if (!this.cache[index]) {
      const SceneClass = this.sceneMap[index];
      const sceneObj = new SceneClass({
        index: index,
        t: this.t,
        resources: this.resources
      });
      await sceneObj.init();

      // Immediately apply correct translation
      if (sceneObj.updateTranslation) {
        sceneObj.updateTranslation(this.t);
      }

      this.cache[index] = sceneObj;
    }
    return this.cache[index];
  }

  updateLocale (t) {
    this.t = typeof t === 'function' ? t : t.t;
    Object.values(this.cache).forEach((sceneInstance) => {
      if (sceneInstance.updateTranslation) {
        sceneInstance.updateTranslation(t);
      }
    });
  }

  getSceneIndices () {
    return Object.keys(this.sceneMap);
  }

  onTargetFound (scene) {
    scene.onTargetFound();
  }

  onTargetLost (scene) {
    scene.onTargetLost();
  }
}
