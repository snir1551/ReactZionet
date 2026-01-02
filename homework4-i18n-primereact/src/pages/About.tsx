import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './About.css';

export const About = () => {
  const { t } = useTranslation(['about', 'common']);
  const [visitTime] = useState<string>(new Date().toLocaleString());
  const [pageViews] = useState<number>(() => {
    const storedViews = localStorage.getItem('aboutPageViews');
    const currentViews = storedViews ? parseInt(storedViews) + 1 : 1;
    return currentViews;
  });

  useEffect(() => {
    // Update page views in localStorage after component mounts
    localStorage.setItem('aboutPageViews', pageViews.toString());
  }, [pageViews]);

  return (
    <div className="about-container">
      <h1 className="about-title">{t('about:title')}</h1>
      
      <div className="stats-card">
        <p><strong>{t('about:visitTime')}:</strong> {visitTime}</p>
        <p><strong>{t('about:pageViews')}:</strong> {pageViews}</p>
      </div>

      <section className="section">
        <h2>{t('about:projectOverviewTitle')}</h2>
        <p>{t('about:projectOverviewText')}</p>
      </section>

      <section className="section">
        <h2>{t('about:featuresTitle')}</h2>
        <ul className="features-list">
          <li>{t('about:feature1')}</li>
          <li>{t('about:feature2')}</li>
          <li>{t('about:feature3')}</li>
          <li>{t('about:feature4')}</li>
          <li>{t('about:feature5')}</li>
          <li>{t('about:feature6')}</li>
        </ul>
      </section>

      <section className="section">
        <h2>{t('about:technologiesTitle')}</h2>
        <div className="tech-grid">
          <div className="tech-card tech-react">
            <h3>{t('about:tech1Title')}</h3>
            <p>{t('about:tech1Desc')}</p>
          </div>
          <div className="tech-card tech-typescript">
            <h3>{t('about:tech2Title')}</h3>
            <p>{t('about:tech2Desc')}</p>
          </div>
          <div className="tech-card tech-vite">
            <h3>{t('about:tech3Title')}</h3>
            <p>{t('about:tech3Desc')}</p>
          </div>
          <div className="tech-card tech-router">
            <h3>{t('about:tech4Title')}</h3>
            <p>{t('about:tech4Desc')}</p>
          </div>
          <div className="tech-card tech-query">
            <h3>{t('about:tech5Title')}</h3>
            <p>{t('about:tech5Desc')}</p>
          </div>
          <div className="tech-card tech-primereact">
            <h3>{t('about:tech6Title')}</h3>
            <p>{t('about:tech6Desc')}</p>
          </div>
          <div className="tech-card tech-i18n">
            <h3>{t('about:tech7Title')}</h3>
            <p>{t('about:tech7Desc')}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>{t('about:learningTitle')}</h2>
        <div className="learning-objectives">
          <ul>
            <li>{t('about:learning1')}</li>
            <li>{t('about:learning2')}</li>
            <li>{t('about:learning3')}</li>
            <li>{t('about:learning4')}</li>
            <li>{t('about:learning5')}</li>
            <li>{t('about:learning6')}</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
