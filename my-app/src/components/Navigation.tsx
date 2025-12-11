import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <Link 
        to="/" 
        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
      >
        Home
      </Link>
      <Link 
        to="/counter" 
        className={`nav-link ${location.pathname === '/counter' ? 'active' : ''}`}
      >
        Counter
      </Link>
      <Link 
        to="/register" 
        className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
      >
        Register
      </Link>
      <Link 
        to="/about" 
        className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
      >
        About
      </Link>
    </nav>
  );
}

export default Navigation;