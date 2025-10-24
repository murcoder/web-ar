import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n';
import { storyblokInit, apiPlugin } from '@storyblok/react';
import Page from './storyblok/Page';
import { StoryblokExample } from './storyblok/StoryblokExample.jsx';

storyblokInit({
  // TODO - change token and components depending on your use case
  accessToken: import.meta.env.VITE_STORYBLOK_DELIVERY_API_TOKEN,
  use: [apiPlugin],
  components: {
    page: Page,
    card: StoryblokExample,
  },
  apiOptions: {
    region: 'eu',
  },
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
