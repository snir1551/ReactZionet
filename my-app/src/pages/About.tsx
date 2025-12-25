import { useState, useEffect } from 'react';
import './About.css';

export const About = () => {
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
          This React application was created as part of the <strong>Zionet React Course - Task 1</strong>. 
          It demonstrates fundamental React concepts including hooks, component composition, and routing.
        </p>
      </section>

      <section className="section">
        <h2>Features Implemented</h2>
        <ul className="features-list">
          <li><strong>Advanced Counter Component</strong> - Demonstrates useState, useEffect, useCallback, and useMemo hooks</li>
          <li><strong>User Registration Form</strong> - Shows useReducer for complex state management and form validation</li>
          <li><strong>React Router Integration</strong> - Client-side navigation between pages</li>
          <li><strong>Local Storage Integration</strong> - Persistent page view tracking</li>
          <li><strong>TypeScript Support</strong> - Type-safe React development</li>
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
        </div>
      </section>

      <section className="section">
        <h2>Learning Objectives Achieved</h2>
        <div className="learning-objectives">
          <ul>
            <li>Understanding React hooks (useState, useEffect, useReducer, useMemo, useCallback)</li>
            <li>Component composition and reusability</li>
            <li>State management patterns</li>
            <li>Side effects and lifecycle management</li>
            <li>Performance optimization techniques</li>
            <li>Form handling and validation</li>
            <li>Client-side routing implementation</li>
            <li>TypeScript integration with React</li>
          </ul>
        </div>
      </section>
    </div>
  );
};