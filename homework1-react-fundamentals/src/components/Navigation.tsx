import { NavLink } from 'react-router';

function Navigation() {
  return (
    <nav className="navigation">
      <NavLink to="/" className="nav-link">
        Home
      </NavLink>
      <NavLink to="/counter" className="nav-link">
        Counter
      </NavLink>
      <NavLink to="/register" className="nav-link">
        Register
      </NavLink>
      <NavLink to="/about" className="nav-link">
        About
      </NavLink>
    </nav>
  );
}

export default Navigation;