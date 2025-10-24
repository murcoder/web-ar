import { create } from 'zustand';

export const useSceneStore = create((set) => ({
  language: 'de',

  // --- actions ---
  setLanguage: (language) => set({ language }),
}));
