import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../stores/themeStore';

export function Navigation() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'he' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav style={{
      padding: '1rem 2rem',
      backgroundColor: 'var(--nav-bg)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    }}>
      <Link to="/" style={{ 
        textDecoration: 'none', 
        color: 'var(--text-color)',
        fontWeight: 'bold',
      }}>
        {t('common:products')}
      </Link>

      <div style={{
        marginInlineStart: 'auto',
        display: 'flex',
        gap: '0.5rem',
      }}>
        <button
          onClick={toggleTheme}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1.2rem',
            cursor: 'pointer',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            backgroundColor: 'var(--button-bg)',
            color: 'var(--text-color)',
          }}
          title={t('common:themeSwitch')}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <button
          onClick={toggleLanguage}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1.2rem',
            cursor: 'pointer',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            backgroundColor: 'var(--button-bg)',
            color: 'var(--text-color)',
          }}
          title={t('common:languageSwitch')}
        >
          {i18n.language === 'en' ? '🇮🇱' : '🇺🇸'}
        </button>
      </div>
    </nav>
  );
}
