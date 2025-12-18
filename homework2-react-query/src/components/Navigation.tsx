import { NavLink } from 'react-router';

function Navigation() {
  return (
    <nav className="navigation">
      <NavLink to="/" className="nav-link">
        Home
      </NavLink>
      <NavLink to="/products" className="nav-link">
        Products
      </NavLink>
      <NavLink to="/about" className="nav-link">
        About
      </NavLink>
    </nav>
  );
}

export default Navigation;