import { useState, useEffect } from 'react';
import './About.css';

function About() {
  const [visitTime, setVisitTime] = useState<string>('');
  const [pageViews, setPageViews] = useState<number>(0);

  useEffect(() => {
    // Set the visit time when component mounts
    setVisitTime(new Date().toLocaleString());
    
    // Get page views from localStorage and increment
    const storedViews = localStorage.getItem('aboutPageViews');
    const currentViews = storedViews ? parseInt(storedViews) + 1 : 1;
    setPageViews(currentViews);
    localStorage.setItem('aboutPageViews', currentViews.toString());
  }, []);

  return (
    <div className="about-container">
      <h1 className="about-title">About This React App</h1>
      
      <div className="stats-card">
        <p><strong>Visit Time:</strong> {visitTime}</p>
        <p><strong>Page Views:</strong> {pageViews}</p>
      </div>

      <section className="section">
        <h2>Project Overview</h2>
        <p>
          This React application was created as part of the <strong>Zionet React Course - Task 2</strong>. 
          It demonstrates server state management with TanStack React Query, including data fetching, 
          caching strategies, and optimistic UI updates.
        </p>
      </section>

      <section className="section">
        <h2>Features Implemented</h2>
        <ul className="features-list">
          <li><strong>Product Catalog</strong> - Browse products with search, filtering, and pagination</li>
          <li><strong>Product Details</strong> - View individual product information with dependent queries</li>
          <li><strong>Intelligent Caching</strong> - Query keys with filter parameters for granular cache control</li>
          <li><strong>Global Loading Indicator</strong> - useIsFetching hook monitors all queries</li>
          <li><strong>React Query DevTools</strong> - Real-time query state inspection</li>
          <li><strong>TypeScript Support</strong> - Type-safe API integration</li>
        </ul>
      </section>

      <section className="section">
        <h2>Technologies Used</h2>
        <div className="tech-grid">
          <div className="tech-card tech-react">
            <h3>React 19</h3>
            <p>Component-based UI library</p>
          </div>
          <div className="tech-card tech-typescript">
            <h3>TypeScript</h3>
            <p>Type-safe JavaScript</p>
          </div>
          <div className="tech-card tech-vite">
            <h3>Vite</h3>
            <p>Fast development server</p>
          </div>
          <div className="tech-card tech-router">
            <h3>React Router</h3>
            <p>Client-side routing</p>
          </div>
          <div className="tech-card tech-react">
            <h3>TanStack Query</h3>
            <p>Server state management</p>
          </div>
          <div className="tech-card tech-vite">
            <h3>DummyJSON API</h3>
            <p>Product data source</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Learning Objectives Achieved</h2>
        <div className="learning-objectives">
          <ul>
            <li>Understanding TanStack React Query hooks (useQuery, useIsFetching)</li>
            <li>Server state management vs client state</li>
            <li>Query keys and cache strategies</li>
            <li>Dependent queries with enabled option</li>
            <li>Background refetching and stale time configuration</li>
            <li>Placeholder data for smooth UX</li>
            <li>Global loading state monitoring</li>
            <li>API integration with TypeScript</li>
            <li>React Query DevTools for debugging</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default About;