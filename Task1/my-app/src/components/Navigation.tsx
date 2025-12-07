import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  const navStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ddd',
    marginBottom: '20px'
  };

  const linkStyle = (isActive: boolean) => ({
    textDecoration: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: isActive ? '#646cff' : 'transparent',
    color: isActive ? 'white' : '#646cff',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'all 0.3s ease',
    border: '2px solid #646cff'
  });

  return (
    <nav style={navStyle}>
      <Link 
        to="/" 
        style={linkStyle(location.pathname === '/')}
      >
        Home
      </Link>
      <Link 
        to="/counter" 
        style={linkStyle(location.pathname === '/counter')}
      >
        Counter
      </Link>
      <Link 
        to="/register" 
        style={linkStyle(location.pathname === '/register')}
      >
        Register
      </Link>
      <Link 
        to="/about" 
        style={linkStyle(location.pathname === '/about')}
      >
        About
      </Link>
    </nav>
  );
}

export default Navigation;