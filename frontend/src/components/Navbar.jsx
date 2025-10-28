import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Sun, Moon, Search } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav style={{
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
    }}>
      <div className="container">
        <div className="flex items-center justify-between" style={{ height: '4.5rem' }}>
          {/* Logo */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem',
            borderRadius: 'var(--radius-lg)',
            transition: 'var(--transition)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              <ShoppingCart size={22} color="white" />
            </div>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              PriceWise
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex" style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Link to="/search" className="nav-link" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1rem',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-md)',
              transition: 'var(--transition)',
              fontWeight: '500'
            }}>
              <Search size={18} />
              <span>Search</span>
            </Link>
            <Link to="/stores" className="nav-link" style={{
              padding: '0.625rem 1rem',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-md)',
              transition: 'var(--transition)',
              fontWeight: '500'
            }}>Stores</Link>
            <Link to="/deals" className="nav-link" style={{
              padding: '0.625rem 1rem',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-md)',
              transition: 'var(--transition)',
              fontWeight: '500'
            }}>Deals</Link>
            {isAuthenticated && (
              <>
                <Link to="/lists" className="nav-link" style={{
                  padding: '0.625rem 1rem',
                  color: 'var(--text-secondary)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'var(--transition)',
                  fontWeight: '500'
                }}>My Lists</Link>
                <Link to="/alerts" className="nav-link" style={{
                  padding: '0.625rem 1rem',
                  color: 'var(--text-secondary)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'var(--transition)',
                  fontWeight: '500'
                }}>Alerts</Link>
                <Link to="/dashboard" className="nav-link" style={{
                  padding: '0.625rem 1rem',
                  color: 'var(--text-secondary)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'var(--transition)',
                  fontWeight: '500'
                }}>Dashboard</Link>
              </>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="flex items-center gap-3" style={{ display: 'flex' }}>
            <button
              onClick={toggleTheme}
              className="btn btn-secondary"
              style={{
                padding: '0.625rem',
                borderRadius: 'var(--radius-full)',
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {isAuthenticated ? (
              <div style={{ position: 'relative', display: 'flex', gap: '0.5rem' }}>
                <Link
                  to="/profile"
                  className="btn btn-secondary"
                  style={{
                    borderRadius: 'var(--radius-full)',
                    width: '42px',
                    height: '42px',
                    padding: 0,
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {user?.first_name?.charAt(0) || 'U'}
                </Link>
                <Link to="/dashboard" className="btn btn-primary" style={{ display: 'none' }}>
                  <User size={20} />
                  <span style={{ display: 'none' }}>Dashboard</span>
                </Link>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="btn btn-secondary"
              style={{ padding: '0.5rem', display: 'flex' }}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div style={{
            padding: '1rem 0',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <Link
              to="/search"
              onClick={() => setIsOpen(false)}
              style={{
                padding: '0.75rem',
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius-md)',
                transition: 'var(--transition)'
              }}
            >
              Search Products
            </Link>
            <Link
              to="/stores"
              onClick={() => setIsOpen(false)}
              style={{
                padding: '0.75rem',
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              Stores
            </Link>
            <Link
              to="/deals"
              onClick={() => setIsOpen(false)}
              style={{
                padding: '0.75rem',
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              Deals
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/lists"
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '0.75rem',
                    color: 'var(--text-secondary)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  My Lists
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '0.75rem',
                    color: 'var(--text-secondary)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="btn btn-secondary"
                  style={{ textAlign: 'left' }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
