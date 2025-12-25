import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './i18n';
import { useThemeStore } from './stores/themeStore';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './index.css';

export function RootWrapper() {
  const { theme, primeTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    
    const link = document.createElement('link');
    link.id = 'theme-link';
    link.rel = 'stylesheet';
    link.href = `/node_modules/primereact/resources/themes/${primeTheme}/theme.css`;
    document.head.appendChild(link);

    return () => {
      const existingLink = document.getElementById('theme-link');
      if (existingLink) {
        existingLink.remove();
      }
    };
  }, [theme, primeTheme]);

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootWrapper />
  </StrictMode>
);
