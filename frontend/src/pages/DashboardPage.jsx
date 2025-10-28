import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, TrendingDown, TrendingUp, ShoppingBag, List, Target, Award, Calendar, ArrowRight, Sparkles, Package } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyticsService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [savings, setSavings] = useState(null);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, savingsRes, trendsRes] = await Promise.all([
        analyticsService.getStats(),
        analyticsService.getSavings(30),
        analyticsService.getPriceTrends(null, 30)
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (savingsRes.success) setSavings(savingsRes.data);
      if (trendsRes.success) setTrends(trendsRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        padding: 'var(--space-12) 0 var(--space-16)',
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

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="animate-fadeInDown" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-full)',
            marginBottom: 'var(--space-4)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <Target size={16} />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>Dashboard</span>
          </div>

          <h1 className="animate-fadeInUp" style={{
            fontSize: 'var(--text-6xl)',
            fontWeight: 'extrabold',
            color: 'white',
            marginBottom: 'var(--space-4)',
            letterSpacing: '-0.02em'
          }}>
            Welcome back,
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {user?.first_name || 'User'}!
            </span>
          </h1>

          <p className="animate-fadeInUp" style={{
            fontSize: 'var(--text-xl)',
            color: 'rgba(255, 255, 255, 0.95)',
            maxWidth: '600px',
            lineHeight: '1.6'
          }}>
            Track your savings, analyze trends, and make smarter shopping decisions.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-8)'
        }}>
          {/* Savings Card */}
          <div className="card animate-fadeInUp hover-lift" style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.1) 100%)',
            border: '2px solid rgba(16, 185, 129, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.2) 100%)',
              borderRadius: '50%',
              transform: 'translate(40px, -40px)'
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-4)',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
              }}>
                <DollarSign size={32} color="white" />
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', fontWeight: '600', textTransform: 'uppercase' }}>
                Estimated Savings
              </p>
              <p style={{
                fontSize: 'var(--text-5xl)',
                fontWeight: 'bold',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 'var(--space-2)',
                lineHeight: '1'
              }}>
                ${savings?.estimated_savings?.toFixed(2) || '0.00'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <TrendingUp size={16} color="var(--primary)" />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)', fontWeight: '500' }}>
                  Last 30 days
                </span>
              </div>
            </div>
          </div>

          {/* Lists Card */}
          <div className="card animate-fadeInUp hover-lift" style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.1) 100%)',
            border: '2px solid rgba(59, 130, 246, 0.3)',
            animationDelay: '0.1s'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--gradient-ocean)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-4)',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
            }}>
              <List size={32} color="white" />
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', fontWeight: '600', textTransform: 'uppercase' }}>
              Shopping Lists
            </p>
            <p style={{ fontSize: 'var(--text-5xl)', fontWeight: 'bold', color: 'var(--info)', marginBottom: 'var(--space-2)', lineHeight: '1' }}>
              {stats?.lists?.total_lists || 0}
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
              Active lists
            </p>
          </div>

          {/* Items Card */}
          <div className="card animate-fadeInUp hover-lift" style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.1) 100%)',
            border: '2px solid rgba(245, 158, 11, 0.3)',
            animationDelay: '0.2s'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-4)',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)'
            }}>
              <ShoppingBag size={32} color="white" />
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', fontWeight: '600', textTransform: 'uppercase' }}>
              Items Tracked
            </p>
            <p style={{ fontSize: 'var(--text-5xl)', fontWeight: 'bold', color: 'var(--warning)', marginBottom: 'var(--space-2)', lineHeight: '1' }}>
              {stats?.items?.total_items || 0}
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
              Products monitored
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-8)'
        }}>
          {/* Top Categories */}
          <div className="card animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Package size={24} color="white" />
              </div>
              <h3 style={{ fontSize: 'var(--text-2xl)' }}>Top Categories</h3>
            </div>
            {stats?.top_categories && stats.top_categories.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.top_categories}>
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="category" stroke="var(--text-secondary)" fontSize="12px" />
                  <YAxis stroke="var(--text-secondary)" fontSize="12px" />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-primary)',
                      border: '2px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-xl)'
                    }}
                  />
                  <Bar dataKey="count" fill="url(#colorBar)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                <Package size={48} color="var(--text-tertiary)" style={{ margin: '0 auto var(--space-4)' }} />
                <p style={{ color: 'var(--text-secondary)' }}>No category data available</p>
              </div>
            )}
          </div>

          {/* Price Trends */}
          <div className="card animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp size={24} color="white" />
              </div>
              <h3 style={{ fontSize: 'var(--text-2xl)' }}>Price Trends</h3>
            </div>
            {trends && trends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends.slice(0, 10)}>
                  <defs>
                    <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="date_recorded"
                    stroke="var(--text-secondary)"
                    fontSize="12px"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="var(--text-secondary)" fontSize="12px" />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-primary)',
                      border: '2px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-xl)'
                    }}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Line type="monotone" dataKey="avg_price" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                <TrendingUp size={48} color="var(--text-tertiary)\" style={{ margin: '0 auto var(--space-4)' }} />
                <p style={{ color: 'var(--text-secondary)' }}>No price trend data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={24} color="white" />
            </div>
            <h3 style={{ fontSize: 'var(--text-2xl)' }}>Quick Actions</h3>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-4)'
          }}>
            <Link to="/lists" className="btn btn-primary hover-lift" style={{
              height: '3.5rem',
              fontSize: 'var(--text-base)',
              background: 'var(--gradient-primary)'
            }}>
              <List size={20} />
              View Shopping Lists
              <ArrowRight size={18} />
            </Link>
            <Link to="/search" className="btn btn-secondary hover-lift" style={{
              height: '3.5rem',
              fontSize: 'var(--text-base)'
            }}>
              <Package size={20} />
              Search Products
            </Link>
            <Link to="/stores" className="btn btn-secondary hover-lift" style={{
              height: '3.5rem',
              fontSize: 'var(--text-base)'
            }}>
              <Target size={20} />
              Find Stores
            </Link>
            <Link to="/deals" className="btn btn-secondary hover-lift" style={{
              height: '3.5rem',
              fontSize: 'var(--text-base)'
            }}>
              <Award size={20} />
              Browse Deals
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
