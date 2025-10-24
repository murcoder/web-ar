import React, {useEffect, useRef} from "react";
import "aframe";
import "mind-ar/dist/mindar-image-aframe.prod.js";
import 'aframe-extras';

/**
 * A-Frame component that sets up a MindAR image tracking scene with multiple targets.
 * @returns {Element}
 * @constructor
 */
export default function MindARaFrameViewer () {
  const sceneRef = useRef(null);

  useEffect(() => {
    const sceneEl = sceneRef.current;

    const startAR = () => {
      const arSystem = sceneEl.systems["mindar-image-system"];
      if (arSystem) {
        arSystem.start();
      }
    };

    sceneEl.addEventListener("renderstart", startAR);

    return () => {
      sceneEl.removeEventListener("renderstart", startAR);

      const arSystem = sceneEl.systems?.["mindar-image-system"];
      try {
        if (arSystem) {
          arSystem.stop();

          // Release webcam if video stream exists
          const video = arSystem.controller?.video;
          if (video && video.srcObject) {
            video.srcObject.getTracks().forEach((track) => track.stop());
            video.srcObject = null;
          }
        }
      } catch (e) {
        console.warn("Error stopping AR system:", e);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full m-0 p-0 overflow-hidden">
      <a-scene
        ref={sceneRef}
        mindar-image="imageTargetSrc: /targets/multiple_targets.mind; autoStart: false; uiLoading: yes; uiError: no; uiScanning: yes;"
        color-space="sRGB"
        embedded
        renderer="colorManagement: true, physicallyCorrectLights"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        class="mindar-scene"
      >
        <a-assets>
          <a-asset-item id="bearModel" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/band-example/bear/scene.gltf"></a-asset-item>
          <a-asset-item id="raccoonModel" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/band-example/raccoon/scene.gltf"></a-asset-item>
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        <a-entity mindar-image-target="targetIndex: 0">
          <a-gltf-model rotation="0 0 0 " position="0 -0.25 0" scale="0.05 0.05 0.05" src="#raccoonModel" animation-mixer></a-gltf-model>
        </a-entity>
        <a-entity mindar-image-target="targetIndex: 1">
          <a-gltf-model rotation="0 0 0 " position="0 -0.25 0" scale="0.05 0.05 0.05" src="#bearModel" animation-mixer></a-gltf-model>
        </a-entity>
      </a-scene>
    </div>
  );
}
