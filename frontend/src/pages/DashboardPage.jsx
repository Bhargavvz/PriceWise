import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingDown, ShoppingBag, List } from 'lucide-react';
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

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>
          Welcome back, {user?.first_name || 'User'}!
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Here's your shopping overview
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(22, 163, 74, 0.1)'
            }}>
              <DollarSign size={24} color="var(--primary)" />
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Estimated Savings
              </p>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                ${savings?.estimated_savings?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(14, 165, 233, 0.1)'
            }}>
              <List size={24} color="var(--secondary)" />
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Shopping Lists
              </p>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
                {stats?.lists?.total_lists || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(245, 158, 11, 0.1)'
            }}>
              <ShoppingBag size={24} color="var(--accent)" />
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Items Tracked
              </p>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
                {stats?.items?.total_items || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Top Categories</h3>
          {stats?.top_categories && stats.top_categories.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.top_categories}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="category" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)'
                  }}
                />
                <Bar dataKey="count" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
              No data available
            </p>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Price Trends</h3>
          {trends && trends.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trends.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date_recorded"
                  stroke="var(--text-secondary)"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)'
                  }}
                />
                <Line type="monotone" dataKey="avg_price" stroke="var(--primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
              No price trend data available
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Quick Actions</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <Link to="/lists" className="btn btn-primary">
            View Shopping Lists
          </Link>
          <Link to="/search" className="btn btn-secondary">
            Search Products
          </Link>
          <Link to="/stores" className="btn btn-secondary">
            Find Stores
          </Link>
          <Link to="/deals" className="btn btn-secondary">
            Browse Deals
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
