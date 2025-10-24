import React, { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar.jsx';
import ARViewer from '@/components/ARViewer';
import { useTranslation } from 'react-i18next';
import { getStoryblokApi } from '@storyblok/react';
import { SCENE_IDS } from './constants/scenes';
import { useSceneStore } from './stores/sceneStore';
import { StoryblokExample } from '@/storyblok/StoryblokExample.jsx';

const STORYBLOK_VERSION =
  import.meta.env.VITE_STORYBLOK_VERSION ||
  (import.meta.env.MODE === 'production' ? 'published' : 'draft');

function App() {
  const { t } = useTranslation();
  const [stories, setStories] = useState({});
  const [sceneId, setSceneId] = useState('');
  const { language } = useSceneStore();

  useEffect(() => {

    // Fetch storyblok content
    const loadScenes = async () => {
      const api = getStoryblokApi();
      const result = {};

      // Preload storyblok content for specific scenes
      for (const key of Object.values(SCENE_IDS)) {
        try {
          console.log(`Fetching ${key} from Storyblok for language ${language}`);
          const { data } = await api.get(`cdn/stories/${key}`, {
            version: STORYBLOK_VERSION,
            language
          });
          result[key] = data.story;
          setStories(result);
        } catch (err) {
          console.warn(`Scene ${key} not found in Storyblok for ${language}`);
        }
      }
    };
    loadScenes();
  }, [language]); // Refresh when language changes

  const handleSceneClick = (sceneId) => {
    setSceneId(sceneId);
    // ... interact with the UI here, when 3D Scene gets clicked ...

    // Pause AR when modal opens
    window.MindARViewer?.stopAR();
  };

  const closeUIComponent = () => {
    window.MindARViewer?.resumeAR();
    setSceneId(null)
  };

  return (
    <>
      <NavBar />
      <ARViewer t={t} targetImgPath="/targets/targets.mind" sceneClicked={handleSceneClick} />
      {sceneId && (
        <StoryblokExample
          story={stories[sceneId]}
          onClose={closeUIComponent}
        />
      )}
    </>
  );
}

export default App;
