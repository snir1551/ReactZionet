import { useTranslation } from 'react-i18next';
import { availableLanguages } from './utils';

interface LanguageSwitcherProps {
  className?: string;
}

/**
 * Language switcher component
 * Renders a button/dropdown to switch between available languages
 */
export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={className}>
      {availableLanguages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          style={{
            fontWeight: i18n.language === lang.code ? 'bold' : 'normal',
            marginLeft: '8px',
            padding: '4px 8px',
            cursor: 'pointer',
          }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
