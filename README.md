<div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
  <img src="./public/icons/logo_black.svg" alt="logo_black" width="150" />
  <h1 style="margin: 0; font-size: 2rem; text-align: center;">Boilerplate for WebAR</h1>
</div>

A boilerplate to integrate Augmented Reality into a React application using [MindAR](https://github.com/hiukim/mind-ar-js-react).
This setup makes it easy to combine WebAR experiences with dynamic content powered by the headless CMS [Storyblok](https://www.storyblok.com/).

With this boilerplate, you can quickly build browser-based AR scenes — load 3D models, trigger animations, or manage dynamic text and images — all without leaving your React ecosystem.

## Tech Stack
| Dependency                                                               | Version | Description                                                            |
|--------------------------------------------------------------------------|---------|------------------------------------------------------------------------|
| [React](https://reactjs.org/)                                            | 18.2.0  | UI library for building reactive components                            |
| [ThreeJS](https://threejs.org/)                                          | 0.159   | 3D graphics library for WebGL                                          |
| [MindAR](https://www.npmjs.com/package/@zappar/zappar-react-three-fiber) | 1.2.5   | An open-source WebAR library supporting Image, Face and World tracking |
| [Vite](https://vitejs.dev/)                                              | 7.1.15  | Fast frontend build tool and development server                        |
| [Tailwind CSS](https://tailwindcss.com/)                                 | 4.1.11  | Utility-first CSS framework for styling                                |
| [Shadcn/UI](https://ui.shadcn.com/)                                      | 2.10.0  | Optional UI component library built on Tailwind                        |
| [@storyblok/react](https://www.storyblok.com/docs/guides/react)                                      | -       | Optional headless CMS for dynamic content                              |


# Quick Start
```
npm i
npm run dev
```

# Target Images
Generate your own multi-target images with the [MindAR Tool](https://hiukim.github.io/mind-ar-js-doc/tools/compile) and place them in the `public/img` directory.
Check out, [how to choose a good target image for tracking](https://www.mindar.org/how-to-choose-a-good-target-image-for-tracking-in-ar-part-3/).
<br><br>
Use this images to test the AR functionality. You can print them out or display them on another screen.
![Mindar_Logo](./public/img/mindar.png)
<br><br>
![Zappar Logo](./public/img/zappar.png)

# Architecture
| Component          | Responsibility                                            |
|--------------------|-----------------------------------------------------------|
| **App.jsx**        | Entry point, React UI                                     |
| **ARViewer.jsx**   | Mounts AR scene, initializes MindAR                       |
| **Experience.jsx** | MindAR setup, anchor binding, and Three.js Scene creation |
| **SceneManager**   | Scene lifecycle & cache                                   |
| **Scene**          | Base class for all scenes (fade-in/out, update hooks)     |
| **{CustomScene}**  | Custom 3D-Content attached to the target image            |

```plaintext
├── src/
│   ├── App.jsx (Entry Point - implements ARViewer and other components)
│   ├── Experience.jsx (Merges Three.js with MindAR)
│   ├── components/
│   │   ├── /ui/ (Several shadcn ui components)
│   │   ├── ARViewer.jsx (Combines React with Three.js Canvas)
│   │   └── NavBar.jsx (UI Component)
│   ├── controllers/
│   │   └── SceneManager.js
│   ├── scenes/
│   │   ├── Scene.js
│   │   ├── ExampleScene.js
│   ├── locales/
│   │   ├── de.json
│   │   └── en.json
│   └── utils/
│       └── loader.js
│       └── Resources.jsx (main resource manager)
│       └── [... additional helper functions ...]
├── package.json
├── README.md
└── .gitignore
