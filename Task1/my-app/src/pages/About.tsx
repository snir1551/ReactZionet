import { useState, useEffect } from 'react';

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
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      lineHeight: '1.6'
    }}>
      <h1 style={{ color: '#646cff', textAlign: 'center' }}>About This React App</h1>
      
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <p><strong>Visit Time:</strong> {visitTime}</p>
        <p><strong>Page Views:</strong> {pageViews}</p>
      </div>

      <section style={{ marginBottom: '30px' }}>
        <h2>🚀 Project Overview</h2>
        <p>
          This React application was created as part of the <strong>Zionet React Course - Task 1</strong>. 
          It demonstrates fundamental React concepts including hooks, component composition, and routing.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>🎯 Features Implemented</h2>
        <ul>
          <li><strong>Advanced Counter Component</strong> - Demonstrates useState, useEffect, useCallback, and useMemo hooks</li>
          <li><strong>User Registration Form</strong> - Shows useReducer for complex state management and form validation</li>
          <li><strong>React Router Integration</strong> - Client-side navigation between pages</li>
          <li><strong>Local Storage Integration</strong> - Persistent page view tracking</li>
          <li><strong>TypeScript Support</strong> - Type-safe React development</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>🛠 Technologies Used</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ 
            padding: '15px', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#61dafb' }}>React 19</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Component-based UI library</p>
          </div>
          <div style={{ 
            padding: '15px', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#3178c6' }}>TypeScript</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Type-safe JavaScript</p>
          </div>
          <div style={{ 
            padding: '15px', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#646cff' }}>Vite</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Fast development server</p>
          </div>
          <div style={{ 
            padding: '15px', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ca4245' }}>React Router</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Client-side routing</p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>📚 Learning Objectives Achieved</h2>
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '15px', 
          borderRadius: '8px',
          borderLeft: '4px solid #4CAF50'
        }}>
          <ul style={{ margin: 0 }}>
            <li>✅ Understanding React hooks (useState, useEffect, useReducer, useMemo, useCallback)</li>
            <li>✅ Component composition and reusability</li>
            <li>✅ State management patterns</li>
            <li>✅ Side effects and lifecycle management</li>
            <li>✅ Performance optimization techniques</li>
            <li>✅ Form handling and validation</li>
            <li>✅ Client-side routing implementation</li>
            <li>✅ TypeScript integration with React</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>🔮 Next Steps</h2>
        <p>Future enhancements could include:</p>
        <ul>
          <li>Integration with external APIs</li>
          <li>Advanced state management with Context API or Redux</li>
          <li>Unit testing with Jest and React Testing Library</li>
          <li>Styling with CSS-in-JS libraries or Tailwind CSS</li>
          <li>Progressive Web App (PWA) features</li>
          <li>Server-side rendering with Next.js</li>
        </ul>
      </section>
    </div>
  );
}

export default About;