import { NavLink } from 'react-router';
import { useCart } from '../hooks/useCart';
import { useThemeStore } from '../stores/themeStore';

export const Navigation = () => {
  const { totalItems, toggleSidebar } = useCart();
  const { theme, toggleTheme } = useThemeStore();

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
      <NavLink to="/products" className="nav-link">
        Products
      </NavLink>
      <NavLink to="/about" className="nav-link">
        About
      </NavLink>
      
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      
      <button
        className="cart-button"
        onClick={toggleSidebar}
        aria-label="Open cart"
      >
        🛒
        {totalItems > 0 && (
          <span className="cart-badge">{totalItems}</span>
        )}
      </button>
    </nav>
  );
};