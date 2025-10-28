import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, User, Menu, X, Sun, Moon, Search, 
  List, Bell, BarChart3, Store, Tag, LogOut, Settings, ChevronDown
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/search', label: 'Search', icon: Search, public: true },
    { path: '/stores', label: 'Stores', icon: Store, public: true },
    { path: '/deals', label: 'Deals', icon: Tag, public: true },
    { path: '/lists', label: 'My Lists', icon: List, auth: true },
    { path: '/alerts', label: 'Alerts', icon: Bell, auth: true },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3, auth: true }
  ];

  return (
    <nav style={{
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(5, 150, 105, 0.02) 100%)',
      backdropFilter: 'blur(10px)',
      borderBottom: '2px solid rgba(16, 185, 129, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: scrolled 
        ? '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(16, 185, 129, 0.1)' 
        : '0 2px 10px rgba(0, 0, 0, 0.04)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <div className="container">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          height: '4.5rem',
          padding: '0.5rem 0'
        }}>
          {/* Logo */}
          <Link 
            to="/" 
            className="hover-lift"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-xl)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Shimmer effect */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                animation: 'shimmer 3s infinite'
              }} />
              <ShoppingCart size={22} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
                lineHeight: 1
              }}>
                PriceWise
              </div>
              <div style={{
                fontSize: '0.625rem',
                color: 'var(--text-tertiary)',
                fontWeight: '600',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: '0.125rem'
              }}>
                Smart Shopping
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'var(--bg-primary)',
            padding: '0.375rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}
          className="md:flex"
          >
            {navLinks.map(link => {
              const Icon = link.icon;
              const shouldShow = link.public || (link.auth && isAuthenticated);
              
              if (!shouldShow) return null;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 1rem',
                    color: isActive(link.path) ? 'white' : 'var(--text-secondary)',
                    background: isActive(link.path) 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'transparent',
                    borderRadius: 'var(--radius-full)',
                    transition: 'all 0.3s ease',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    position: 'relative',
                    boxShadow: isActive(link.path) ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(link.path)) {
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(link.path)) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <Icon size={16} strokeWidth={2.5} />
                  <span>{link.label}</span>
                  {isActive(link.path) && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-0.5rem',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: 'var(--primary)'
                    }} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem' 
          }}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="hover-scale"
              style={{
                padding: '0.625rem',
                borderRadius: 'var(--radius-full)',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-primary)',
                border: '2px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
              aria-label="Toggle theme"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
              }}
            >
              {theme === 'light' ? (
                <Moon size={18} color="var(--text-primary)" strokeWidth={2.5} />
              ) : (
                <Sun size={18} color="var(--text-primary)" strokeWidth={2.5} />
              )}
            </button>

            {isAuthenticated ? (
              /* User Menu */
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="hover-scale"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 12px rgba(16, 185, 129, 0.3)',
                    fontSize: '0.875rem'
                  }}
                  aria-label="User menu"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(16, 185, 129, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}>
                    {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ display: 'none' }} className="md:block">
                    {user?.first_name || 'Account'}
                  </span>
                  <ChevronDown size={14} strokeWidth={3} />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 0.75rem)',
                      right: 0,
                      width: '280px',
                      background: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-2xl)',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                      border: '1px solid var(--border)',
                      overflow: 'hidden',
                      animation: 'fadeInDown 0.2s ease-out'
                    }}
                  >
                    {/* User Info */}
                    <div style={{
                      padding: '1.25rem',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.05) 100%)',
                      borderBottom: '2px solid rgba(16, 185, 129, 0.1)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}>
                        <div style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: 'var(--radius-full)',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.25rem',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                          border: '3px solid white'
                        }}>
                          {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{
                            fontWeight: '700',
                            fontSize: '1rem',
                            color: 'var(--text-primary)',
                            marginBottom: '0.25rem'
                          }}>
                            {user?.first_name && user?.last_name 
                              ? `${user.first_name} ${user.last_name}`
                              : 'User'}
                          </p>
                          <p style={{
                            fontSize: '0.8125rem',
                            color: 'var(--text-secondary)',
                            fontWeight: '500'
                          }}>
                            {user?.email || 'user@email.com'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div style={{ padding: '0.75rem' }}>
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.875rem',
                          padding: '0.75rem 1rem',
                          color: 'var(--text-primary)',
                          textDecoration: 'none',
                          borderRadius: 'var(--radius-lg)',
                          transition: 'all 0.2s ease',
                          fontSize: '0.9375rem',
                          fontWeight: '500'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.05) 100%)';
                          e.currentTarget.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <BarChart3 size={18} strokeWidth={2} />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.875rem',
                          padding: '0.75rem 1rem',
                          color: 'var(--text-primary)',
                          textDecoration: 'none',
                          borderRadius: 'var(--radius-lg)',
                          transition: 'all 0.2s ease',
                          fontSize: '0.9375rem',
                          fontWeight: '500'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.05) 100%)';
                          e.currentTarget.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <Settings size={18} strokeWidth={2} />
                        <span>Settings</span>
                      </Link>

                      <div style={{
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
                        margin: '0.75rem 0'
                      }} />

                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.875rem',
                          padding: '0.75rem 1rem',
                          color: 'var(--danger)',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: 'var(--radius-lg)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: '0.9375rem',
                          fontWeight: '500',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                          e.currentTarget.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <LogOut size={18} strokeWidth={2} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Login Button */
              <Link 
                to="/login" 
                className="hover-scale"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.5rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  border: 'none',
                  boxShadow: '0 2px 12px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(16, 185, 129, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <User size={16} strokeWidth={2.5} />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hover-scale"
              style={{ 
                padding: '0.625rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                background: 'var(--bg-primary)',
                border: '2px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
              aria-label="Toggle mobile menu"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
              }}
            >
              {isOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div style={{
            padding: '1.5rem 0',
            borderTop: '2px solid rgba(16, 185, 129, 0.1)',
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.02) 0%, transparent 100%)',
            animation: 'fadeInDown 0.2s ease-out'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.375rem'
            }}>
              {navLinks.map(link => {
                const Icon = link.icon;
                const shouldShow = link.public || (link.auth && isAuthenticated);
                
                if (!shouldShow) return null;

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem 1.25rem',
                      color: isActive(link.path) ? 'white' : 'var(--text-secondary)',
                      background: isActive(link.path) 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'transparent',
                      borderRadius: 'var(--radius-xl)',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '1rem',
                      boxShadow: isActive(link.path) ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(link.path)) {
                        e.currentTarget.style.background = 'var(--bg-secondary)';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(link.path)) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }
                    }}
                  >
                    <Icon size={20} strokeWidth={2.5} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {isAuthenticated && (
                <>
                  <div style={{
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
                    margin: '0.75rem 0'
                  }} />
                  
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem 1.25rem',
                      color: 'var(--text-secondary)',
                      background: 'transparent',
                      borderRadius: 'var(--radius-xl)',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '1rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <Settings size={20} strokeWidth={2.5} />
                    <span>Settings</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem 1.25rem',
                      color: 'var(--danger)',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius-xl)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '1rem',
                      fontWeight: '600',
                      textAlign: 'left',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <LogOut size={20} strokeWidth={2.5} />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
