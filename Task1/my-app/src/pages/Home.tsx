import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">
        Welcome to React Hooks Demo
      </h1>
      <p className="home-subtitle">
        Explore interactive examples of React hooks and components
      </p>

      <div className="home-cards-grid">
        {/* Counter Card */}
        <Link to="/counter" className="home-card-link">
          <div className="home-card home-card-counter">
            <h2>Counter</h2>
            <p>
              Advanced counter demonstrating useState, useEffect, useCallback, and useMemo hooks
            </p>
            <div className="home-card-badge home-card-badge-counter">
              <strong>Learn:</strong> State management & performance optimization
            </div>
          </div>
        </Link>

        {/* Registration Card */}
        <Link to="/register" className="home-card-link">
          <div className="home-card home-card-register">
            <h2>Registration</h2>
            <p>
              User registration form with useReducer for complex state management and validation
            </p>
            <div className="home-card-badge home-card-badge-register">
              <strong>Learn:</strong> Complex state & form handling
            </div>
          </div>
        </Link>

        {/* About Card */}
        <Link to="/about" className="home-card-link">
          <div className="home-card home-card-about">
            <h2>About</h2>
            <p>
              Learn about this project, the technologies used, and the learning objectives
            </p>
            <div className="home-card-badge home-card-badge-about">
              <strong>Discover:</strong> Project details & tech stack
            </div>
          </div>
        </Link>
      </div>

      <div className="home-getting-started">
        <h3>Getting Started</h3>
        <p>
          Click on any card above to explore different React concepts and hooks in action. 
          Each page demonstrates practical implementations with detailed explanations.
        </p>
      </div>
    </div>
  );
}

export default Home;