import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, ShoppingBag, TrendingDown, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
    }}>
      {/* Left Side - Branding */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        padding: 'var(--space-16)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="animate-fadeInLeft" style={{
            marginBottom: 'var(--space-8)'
          }}>
            <h1 style={{
              fontSize: 'var(--text-6xl)',
              fontWeight: 'extrabold',
              color: 'white',
              marginBottom: 'var(--space-4)',
              lineHeight: '1'
            }}>
              Price<span style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Wise</span>
            </h1>
            <p style={{
              fontSize: 'var(--text-2xl)',
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: 'var(--space-2)'
            }}>
              Save Money on Every Purchase
            </p>
            <p style={{
              fontSize: 'var(--text-lg)',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              Compare prices, track deals, and shop smarter.
            </p>
          </div>

          <div className="animate-fadeInLeft" style={{
            display: 'grid',
            gap: 'var(--space-4)',
            animationDelay: '0.1s'
          }}>
            {[
              { icon: ShoppingBag, text: 'Compare prices across multiple stores' },
              { icon: TrendingDown, text: 'Track price history and trends' },
              { icon: Sparkles, text: 'Get personalized savings recommendations' }
            ].map((feature, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-4)',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <feature.icon size={24} color="white" />
                </div>
                <p style={{ color: 'white', fontSize: 'var(--text-base)' }}>
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        padding: 'var(--space-8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)'
      }}>
        <div style={{ width: '100%', maxWidth: '450px' }}>
          <div className="animate-fadeInRight" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto var(--space-4)',
              borderRadius: 'var(--radius-2xl)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
            }}>
              <LogIn size={40} color="white" />
            </div>
            <h2 style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'bold',
              marginBottom: 'var(--space-2)'
            }}>
              Welcome Back!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
              Sign in to continue saving
            </p>
          </div>

          <form onSubmit={handleSubmit} className="animate-fadeInRight" style={{ animationDelay: '0.1s' }}>
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-2)',
                fontWeight: '600',
                fontSize: 'var(--text-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-secondary)'
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="you@example.com"
                required
                style={{
                  height: '3.5rem',
                  fontSize: 'var(--text-lg)'
                }}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-2)',
                fontWeight: '600',
                fontSize: 'var(--text-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-secondary)'
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
                required
                style={{
                  height: '3.5rem',
                  fontSize: 'var(--text-lg)'
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                height: '3.5rem',
                fontSize: 'var(--text-lg)',
                background: 'var(--gradient-primary)',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                marginBottom: 'var(--space-6)'
              }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <p style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-base)'
            }}>
              Don't have an account?{' '}
              <Link to="/register" style={{
                color: 'var(--primary)',
                fontWeight: '600',
                textDecoration: 'none'
              }}>
                Sign up for free
              </Link>
            </p>
          </form>

          <div className="animate-fadeInRight" style={{
            marginTop: 'var(--space-8)',
            padding: 'var(--space-6)',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.1) 100%)',
            border: '2px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--radius-xl)',
            animationDelay: '0.2s'
          }}>
            <p style={{
              fontWeight: '600',
              marginBottom: 'var(--space-3)',
              color: 'var(--primary)'
            }}>
              🎯 Demo Credentials:
            </p>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              <p style={{ marginBottom: 'var(--space-1)' }}>
                <strong>Email:</strong> john@example.com
              </p>
              <p>
                <strong>Password:</strong> password123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
