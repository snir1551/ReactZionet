import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  primeTheme: string;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      primeTheme: 'lara-light-indigo',
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          const newPrimeTheme = newTheme === 'light' ? 'lara-light-indigo' : 'lara-dark-indigo';
          
          document.documentElement.setAttribute('data-theme', newTheme);
          
          const existingLink = document.getElementById('theme-link') as HTMLLinkElement;
          if (existingLink) {
            existingLink.href = `/node_modules/primereact/resources/themes/${newPrimeTheme}/theme.css`;
          }
          
          return { theme: newTheme, primeTheme: newPrimeTheme };
        }),
    }),
    {
      name: 'app_theme',
    }
  )
);
