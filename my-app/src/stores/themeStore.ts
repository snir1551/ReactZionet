import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PrimeReactTheme = 'lara-light-indigo' | 'lara-dark-indigo' | 'lara-light-blue' | 'md-dark-indigo';

interface ThemeStore {
  theme: 'light' | 'dark';
  primeTheme: PrimeReactTheme;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setPrimeTheme: (theme: PrimeReactTheme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',
      primeTheme: 'lara-light-indigo',
      
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          const newPrimeTheme: PrimeReactTheme = newTheme === 'light' ? 'lara-light-indigo' : 'lara-dark-indigo';
          
          // Update the PrimeReact theme CSS dynamically
          updatePrimeThemeCSS(newPrimeTheme);
          
          return {
            theme: newTheme,
            primeTheme: newPrimeTheme,
          };
        });
      },
      
      setTheme: (theme) => {
        const primeTheme: PrimeReactTheme = theme === 'light' ? 'lara-light-indigo' : 'lara-dark-indigo';
        updatePrimeThemeCSS(primeTheme);
        set({ theme, primeTheme });
      },
      
      setPrimeTheme: (primeTheme) => {
        updatePrimeThemeCSS(primeTheme);
        set({ primeTheme });
      },
    }),
    {
      name: 'app_theme', // localStorage key
    }
  )
);

// Helper function to dynamically update PrimeReact theme CSS
function updatePrimeThemeCSS(theme: PrimeReactTheme) {
  const themeLink = document.getElementById('primereact-theme') as HTMLLinkElement;
  if (themeLink) {
    themeLink.href = `/node_modules/primereact/resources/themes/${theme}/theme.css`;
  }
}

// Initialize theme on load
if (typeof window !== 'undefined') {
  const storedTheme = localStorage.getItem('app_theme');
  if (storedTheme) {
    try {
      const parsed = JSON.parse(storedTheme);
      if (parsed.state?.primeTheme) {
        updatePrimeThemeCSS(parsed.state.primeTheme);
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }
}
