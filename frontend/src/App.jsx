import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import DashboardPage from './pages/DashboardPage';
import DealsPage from './pages/DealsPage';
import StoresPage from './pages/StoresPage';
import ShoppingListsPage from './pages/ShoppingListsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ShoppingListDetailPage from './pages/ShoppingListDetailPage';
import StoreDetailPage from './pages/StoreDetailPage';
import ProfilePage from './pages/ProfilePage';
import PriceAlertsPage from './pages/PriceAlertsPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// App Content (needs to be inside AuthProvider)
const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/stores/:id" element={<StoreDetailPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lists"
            element={
              <ProtectedRoute>
                <ShoppingListsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lists/:id"
            element={
              <ProtectedRoute>
                <ShoppingListDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <PriceAlertsPage />
              </ProtectedRoute>
            }
          />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* Footer */}
      <footer style={{
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--border)',
        padding: '2rem 0',
        marginTop: '4rem'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>PriceWise</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Compare grocery prices and save money on your shopping
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="/search" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Search</a>
                <a href="/stores" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Stores</a>
                <a href="/deals" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Deals</a>
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Account</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="/login" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Login</a>
                <a href="/register" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Register</a>
                <a href="/dashboard" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Dashboard</a>
              </div>
            </div>
          </div>
          <div style={{
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border)',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            <p>&copy; 2025 PriceWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
