import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ShoppingCart, Award, Bell, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
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
      {/* Left Side - Registration Form */}
      <div style={{
        padding: 'var(--space-8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)'
      }}>
        <div style={{ width: '100%', maxWidth: '500px' }}>
          <div className="animate-fadeInLeft" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto var(--space-4)',
              borderRadius: 'var(--radius-2xl)',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)'
            }}>
              <UserPlus size={40} color="white" />
            </div>
            <h2 style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'bold',
              marginBottom: 'var(--space-2)'
            }}>
              Join PriceWise
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
              Start saving on every purchase today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="animate-fadeInLeft" style={{ animationDelay: '0.1s' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-5)'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                  fontWeight: '600',
                  fontSize: 'var(--text-sm)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-secondary)'
                }}>
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="input"
                  placeholder="John"
                  required
                  style={{ height: '3rem' }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                  fontWeight: '600',
                  fontSize: 'var(--text-sm)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-secondary)'
                }}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Doe"
                  required
                  style={{ height: '3rem' }}
                />
              </div>
            </div>

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
                style={{ height: '3.5rem', fontSize: 'var(--text-lg)' }}
              />
            </div>

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
                minLength={6}
                style={{ height: '3.5rem', fontSize: 'var(--text-lg)' }}
              />
              <p style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
                marginTop: 'var(--space-1)'
              }}>
                Must be at least 6 characters
              </p>
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
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
                required
                minLength={6}
                style={{ height: '3.5rem', fontSize: 'var(--text-lg)' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                height: '3.5rem',
                fontSize: 'var(--text-lg)',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
                marginBottom: 'var(--space-6)'
              }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : (
                <>
                  Create Account
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <p style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-base)'
            }}>
              Already have an account?{' '}
              <Link to="/login" style={{
                color: '#8b5cf6',
                fontWeight: '600',
                textDecoration: 'none'
              }}>
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div style={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
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
          <div className="animate-fadeInRight" style={{
            marginBottom: 'var(--space-8)'
          }}>
            <h2 style={{
              fontSize: 'var(--text-5xl)',
              fontWeight: 'extrabold',
              color: 'white',
              marginBottom: 'var(--space-4)',
              lineHeight: '1.1'
            }}>
              Unlock Amazing
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Savings
              </span>
            </h2>
            <p style={{
              fontSize: 'var(--text-xl)',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.6'
            }}>
              Join thousands of smart shoppers who save money every day with PriceWise.
            </p>
          </div>

          <div className="animate-fadeInRight" style={{
            display: 'grid',
            gap: 'var(--space-5)',
            animationDelay: '0.1s'
          }}>
            {[
              {
                icon: ShoppingCart,
                title: 'Smart Shopping Lists',
                description: 'Create and optimize lists to find the best deals across all stores'
              },
              {
                icon: Award,
                title: 'Price Tracking',
                description: 'Get alerts when prices drop on your favorite products'
              },
              {
                icon: Bell,
                title: 'Personalized Alerts',
                description: 'Never miss a deal with custom notifications tailored to you'
              }
            ].map((benefit, i) => (
              <div key={i} style={{
                padding: 'var(--space-5)',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              className="hover-lift">
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-3)'
                }}>
                  <benefit.icon size={28} color="white" />
                </div>
                <h3 style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: 'var(--space-2)'
                }}>
                  {benefit.title}
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: '1.6'
                }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          <div className="animate-fadeInRight" style={{
            marginTop: 'var(--space-8)',
            padding: 'var(--space-6)',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            animationDelay: '0.2s'
          }}>
            <p style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 'var(--space-2)'
            }}>
              $2,450+
            </p>
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: 'var(--text-base)'
            }}>
              Average savings per year for PriceWise users
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
