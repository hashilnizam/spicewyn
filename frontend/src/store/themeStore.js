import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Available color themes
export const COLOR_THEMES = {
  nature: {
    name: 'Nature Green',
    description: 'Fresh & organic green inspired by nature',
    primary: 'primary', // Uses the green palette
    icon: '🌿',
  },
  ocean: {
    name: 'Ocean Blue',
    description: 'Calm & refreshing blue like the ocean',
    primary: 'accent-blue',
    icon: '🌊',
  },
  sunset: {
    name: 'Sunset Orange',
    description: 'Warm & energetic sunset colors',
    primary: 'secondary', // Amber/Golden
    icon: '🌅',
  },
  forest: {
    name: 'Forest Dark',
    description: 'Deep forest green for a premium feel',
    primary: 'nature-forest',
    icon: '🌲',
  },
  mint: {
    name: 'Fresh Mint',
    description: 'Cool & modern mint green',
    primary: 'accent-mint',
    icon: '🍃',
  },
};

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light', // 'light' or 'dark'
      colorTheme: 'nature', // Color theme key from COLOR_THEMES
      
      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }));
      },
      
      setTheme: (theme) => {
        set({ theme });
      },
      
      setColorTheme: (colorTheme) => {
        set({ colorTheme });
      },
      
      getCurrentColorTheme: () => {
        return COLOR_THEMES[useThemeStore.getState().colorTheme] || COLOR_THEMES.nature;
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);
