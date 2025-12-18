import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">
        Welcome to React Query Demo
      </h1>
      <p className="home-subtitle">
        Explore TanStack React Query with real product data
      </p>

      <div className="home-cards-grid">
        {/* Products Card */}
        <Link to="/products" className="home-card-link">
          <div className="home-card home-card-counter">
            <h2>Products</h2>
            <p>
              Browse products with search, filtering, pagination, and intelligent caching using React Query
            </p>
            <div className="home-card-badge home-card-badge-counter">
              <strong>Learn:</strong> Data fetching, caching & query keys
            </div>
          </div>
        </Link>

        {/* About Card */}
        <Link to="/about" className="home-card-link">
          <div className="home-card home-card-about">
            <h2>About</h2>
            <p>
              Learn about TanStack React Query, server state management, and the technologies used
            </p>
            <div className="home-card-badge home-card-badge-about">
              <strong>Discover:</strong> React Query concepts & features
            </div>
          </div>
        </Link>
      </div>

      <div className="home-getting-started">
        <h3>Getting Started</h3>
        <p>
          Click on the Products card to explore data fetching with React Query. 
          See intelligent caching, background updates, and optimistic UI patterns in action.
        </p>
      </div>
    </div>
  );
}

export default Home;