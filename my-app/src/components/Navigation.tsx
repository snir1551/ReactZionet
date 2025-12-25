import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useCart } from '../hooks/useCart';
import { useThemeStore } from '../stores/themeStore';

export const Navigation = () => {
  const { t, i18n } = useTranslation('common');
  const { totalItems, toggleSidebar } = useCart();
  const { theme, toggleTheme } = useThemeStore();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'he' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="navigation">
      <NavLink to="/" className="nav-link">
        {t('home')}
      </NavLink>
      <NavLink to="/counter" className="nav-link">
        {t('counter')}
      </NavLink>
      <NavLink to="/register" className="nav-link">
        {t('register')}
      </NavLink>
      <NavLink to="/products" className="nav-link">
        {t('products')}
      </NavLink>
      <NavLink to="/about" className="nav-link">
        {t('about')}
      </NavLink>
      
      <div style={{ marginInlineStart: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        <button
          className="theme-toggle"
          onClick={toggleLanguage}
          aria-label="Toggle language"
          title={`Switch to ${i18n.language === 'en' ? 'Hebrew' : 'English'}`}
        >
          {i18n.language === 'en' ? '🇮🇱' : '🇺🇸'}
        </button>
        
        <button
          className="cart-button"
          onClick={toggleSidebar}
          aria-label={t('cart')}
        >
          🛒
          {totalItems > 0 && (
            <span className="cart-badge">{totalItems}</span>
          )}
        </button>
      </div>
    </nav>
  );
};