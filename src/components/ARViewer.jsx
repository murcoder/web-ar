import React, { useEffect, useRef } from 'react';
import Experience from '../Experience';
import { useSceneStore } from '@/stores/sceneStore';

let experience = null;

/**
 * The Facade between React and 3D Canvas
 * @param t
 * @param targetImgPath
 * @param sceneClicked
 * @returns {JSX.Element}
 * @constructor
 */
const ARViewer = ({ t, targetImgPath, sceneClicked }) => {
  const containerRef = useRef(null);
  const { language } = useSceneStore();

  useEffect(() => {
    if (!containerRef.current) return;

    if (!experience) {
      experience = new Experience(containerRef.current, t, targetImgPath);
    }

    experience.updateLocale(t);
  }, [language, t]); // re-run when language changes

  useEffect(() => {
    if (!experience) return;

    // Handle scene clicks
    const onSceneClick = ({ index, sceneId }) => {
      console.log(`ARViewer: Scene ${sceneId} clicked`);
      sceneClicked(sceneId, 'scene'); // mark this as a scene click
    };

    experience.events.on('scene.click', onSceneClick);

    return () => {
      experience.events.off('scene.click', onSceneClick);
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default ARViewer;
