import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ 
      padding: '40px 20px',
      maxWidth: '900px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <h1 style={{ 
        color: '#646cff', 
        fontSize: '3rem',
        marginBottom: '20px'
      }}>
        Welcome to React Hooks Demo
      </h1>
      <p style={{ 
        fontSize: '1.3rem', 
        color: '#666',
        marginBottom: '50px'
      }}>
        Explore interactive examples of React hooks and components
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
        marginTop: '40px'
      }}>
        {/* Counter Card */}
        <Link to="/counter" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ 
            padding: '30px',
            border: '2px solid #646cff',
            borderRadius: '12px',
            backgroundColor: '#fff',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            height: '100%'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(100, 108, 255, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <h2 style={{ color: '#646cff', marginTop: 0 }}>Counter</h2>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Advanced counter demonstrating useState, useEffect, useCallback, and useMemo hooks
            </p>
            <div style={{ 
              marginTop: '20px',
              padding: '10px',
              backgroundColor: '#f0f0ff',
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              <strong>Learn:</strong> State management & performance optimization
            </div>
          </div>
        </Link>

        {/* Registration Card */}
        <Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ 
            padding: '30px',
            border: '2px solid #61dafb',
            borderRadius: '12px',
            backgroundColor: '#fff',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            height: '100%'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(97, 218, 251, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <h2 style={{ color: '#61dafb', marginTop: 0 }}>Registration</h2>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              User registration form with useReducer for complex state management and validation
            </p>
            <div style={{ 
              marginTop: '20px',
              padding: '10px',
              backgroundColor: '#f0fcff',
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              <strong>Learn:</strong> Complex state & form handling
            </div>
          </div>
        </Link>

        {/* About Card */}
        <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ 
            padding: '30px',
            border: '2px solid #4CAF50',
            borderRadius: '12px',
            backgroundColor: '#fff',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            height: '100%'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(76, 175, 80, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <h2 style={{ color: '#4CAF50', marginTop: 0 }}>About</h2>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Learn about this project, the technologies used, and the learning objectives
            </p>
            <div style={{ 
              marginTop: '20px',
              padding: '10px',
              backgroundColor: '#f0fff0',
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              <strong>Discover:</strong> Project details & tech stack
            </div>
          </div>
        </Link>
      </div>

      <div style={{ 
        marginTop: '60px',
        padding: '25px',
        backgroundColor: '#f9f9f9',
        borderRadius: '12px',
        borderLeft: '4px solid #646cff'
      }}>
        <h3 style={{ marginTop: 0, color: '#333' }}>🚀 Getting Started</h3>
        <p style={{ color: '#666', lineHeight: '1.8' }}>
          Click on any card above to explore different React concepts and hooks in action. 
          Each page demonstrates practical implementations with detailed explanations.
        </p>
      </div>
    </div>
  );
}

export default Home;