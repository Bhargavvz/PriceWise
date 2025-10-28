import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Plus, Trash2, Search, X, TrendingDown, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { productService } from '../services';
import { useToast } from '../contexts/ToastContext';

const PriceAlertsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [targetPrice, setTargetPrice] = useState('');

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && showCreateModal) {
        searchProducts();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, showCreateModal]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      // Simulate loading alerts - in real app, fetch from backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      setAlerts([
        {
          id: 1,
          product_id: 1,
          product_name: 'Organic Whole Milk',
          product_image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
          brand: 'Horizon Organic',
          category: 'Dairy & Eggs',
          current_price: 5.99,
          target_price: 4.99,
          is_active: true,
          triggered: false,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          product_id: 5,
          product_name: 'Organic Bananas',
          product_image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300',
          brand: 'Organic',
          category: 'Produce',
          current_price: 0.79,
          target_price: 0.59,
          is_active: true,
          triggered: true,
          created_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast.error('Failed to load price alerts');
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async () => {
    try {
      setSearching(true);
      const response = await productService.search({ q: searchQuery, limit: 10 });
      if (response.success) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleCreateAlert = async () => {
    if (!selectedProduct || !targetPrice) {
      toast.error('Please select a product and enter a target price');
      return;
    }

    try {
      // Simulate creating alert - in real app, call backend API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newAlert = {
        id: Date.now(),
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        product_image: selectedProduct.image_url,
        brand: selectedProduct.brand,
        category: selectedProduct.category,
        current_price: 0, // Would come from backend
        target_price: parseFloat(targetPrice),
        is_active: true,
        triggered: false,
        created_at: new Date().toISOString()
      };

      setAlerts([newAlert, ...alerts]);
      setShowCreateModal(false);
      setSelectedProduct(null);
      setTargetPrice('');
      setSearchQuery('');
      toast.success('Price alert created!');
    } catch (error) {
      toast.error('Failed to create alert');
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (!confirm('Delete this price alert?')) return;

    try {
      // Simulate deletion - in real app, call backend API
      await new Promise(resolve => setTimeout(resolve, 300));
      setAlerts(alerts.filter(alert => alert.id !== alertId));
      toast.success('Alert deleted');
    } catch (error) {
      toast.error('Failed to delete alert');
    }
  };

  const handleToggleAlert = async (alertId) => {
    try {
      // Simulate toggle - in real app, call backend API
      await new Promise(resolve => setTimeout(resolve, 300));
      setAlerts(alerts.map(alert =>
        alert.id === alertId ? { ...alert, is_active: !alert.is_active } : alert
      ));
      toast.success('Alert updated');
    } catch (error) {
      toast.error('Failed to update alert');
    }
  };

  const activeAlerts = alerts.filter(a => a.is_active);
  const triggeredAlerts = alerts.filter(a => a.triggered && a.is_active);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '3rem 2rem',
        marginBottom: '3rem',
        color: 'white',
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
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Bell size={40} />
            <h1 style={{ color: 'white', margin: 0 }}>Price Alerts</h1>
          </div>
          <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '2rem' }}>
            Get notified when your favorite products drop to your target price
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem'
          }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {activeAlerts.length}
              </div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Active Alerts</div>
            </div>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {triggeredAlerts.length}
              </div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Price Drops</div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Alert Button */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
          style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}
        >
          <Plus size={24} />
          Create New Alert
        </button>
      </div>

      {/* Triggered Alerts */}
      {triggeredAlerts.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <TrendingDown size={28} color="var(--success)" />
            <h2 style={{ margin: 0 }}>Price Drops ({triggeredAlerts.length})</h2>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {triggeredAlerts.map(alert => (
              <div
                key={alert.id}
                className="card"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                  border: '2px solid var(--success)',
                  padding: '1.5rem'
                }}
              >
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
                  <img
                    src={alert.product_image || 'https://via.placeholder.com/100'}
                    alt={alert.product_name}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-tertiary)'
                    }}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: 'var(--success)',
                      color: 'white',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1rem',
                      fontWeight: 'bold'
                    }}>
                      <TrendingDown size={18} />
                      Price Drop Alert!
                    </div>

                    <h3 style={{ marginBottom: '0.5rem' }}>{alert.product_name}</h3>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      {alert.brand && <span>{alert.brand}</span>}
                      {alert.category && <span>• {alert.category}</span>}
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                          Target Price
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>
                          ${alert.target_price.toFixed(2)}
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/product/${alert.product_id}`)}
                        className="btn btn-primary"
                      >
                        View Product
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="btn btn-sm btn-secondary"
                    style={{ padding: '0.5rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Alerts */}
      <div>
        <h2 style={{ marginBottom: '1.5rem' }}>
          All Alerts ({alerts.length})
        </h2>

        {alerts.length > 0 ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {alerts.map(alert => (
              <div
                key={alert.id}
                className="card"
                style={{
                  padding: '1.5rem',
                  opacity: alert.is_active ? 1 : 0.6
                }}
              >
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'start', flexWrap: 'wrap' }}>
                  <img
                    src={alert.product_image || 'https://via.placeholder.com/80'}
                    alt={alert.product_name}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-tertiary)'
                    }}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                  />

                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>{alert.product_name}</h3>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      {alert.brand && <span>{alert.brand}</span>}
                      {alert.category && <span>• {alert.category}</span>}
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>
                          Target Price
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                          ${alert.target_price.toFixed(2)}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>
                          Status
                        </div>
                        <div style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          backgroundColor: alert.is_active ? 'rgba(22, 163, 74, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                          color: alert.is_active ? 'var(--primary)' : 'var(--text-tertiary)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          {alert.is_active ? 'Active' : 'Paused'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleToggleAlert(alert.id)}
                      className="btn btn-sm btn-secondary"
                      title={alert.is_active ? 'Pause alert' : 'Activate alert'}
                    >
                      {alert.is_active ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="btn btn-sm btn-secondary"
                      style={{ padding: '0.5rem', color: 'var(--danger)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(249, 115, 22, 0.1) 100%)'
          }}>
            <Bell size={64} color="var(--text-tertiary)" style={{ margin: '0 auto 1.5rem' }} />
            <h3 style={{ marginBottom: '0.75rem' }}>No Price Alerts Yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Create your first price alert to get notified when products reach your target price
            </p>
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
              <Plus size={20} />
              Create Your First Alert
            </button>
          </div>
        )}
      </div>

      {/* Create Alert Modal */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Create Price Alert</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {!selectedProduct ? (
              <>
                {/* Search Products */}
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  <Search
                    size={20}
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-tertiary)'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search for a product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input"
                    style={{ paddingLeft: '3rem' }}
                    autoFocus
                  />
                </div>

                {/* Search Results */}
                {searching && <LoadingSpinner />}

                {!searching && searchResults.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {searchResults.map(product => (
                      <button
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        style={{
                          padding: '1rem',
                          border: '2px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'var(--transition)',
                          display: 'flex',
                          gap: '1rem',
                          alignItems: 'center'
                        }}
                        onMouseEnter={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onMouseLeave={(e) => e.target.style.borderColor = 'var(--border)'}
                      >
                        <img
                          src={product.image_url || 'https://via.placeholder.com/60'}
                          alt={product.name}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--bg-tertiary)'
                          }}
                          onError={(e) => e.target.src = 'https://via.placeholder.com/60'}
                        />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ marginBottom: '0.25rem' }}>{product.name}</h4>
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                            {product.brand && `${product.brand} • `}
                            {product.category}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {!searching && searchQuery && searchResults.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    <AlertCircle size={48} style={{ margin: '0 auto 1rem' }} />
                    <p>No products found. Try a different search term.</p>
                  </div>
                )}

                {!searchQuery && (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    <Search size={48} style={{ margin: '0 auto 1rem' }} />
                    <p>Start typing to search for products</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Selected Product */}
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <img
                      src={selectedProduct.image_url || 'https://via.placeholder.com/80'}
                      alt={selectedProduct.name}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-tertiary)'
                      }}
                      onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                    />
                    <div>
                      <h3 style={{ marginBottom: '0.5rem' }}>{selectedProduct.name}</h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {selectedProduct.brand && `${selectedProduct.brand} • `}
                        {selectedProduct.category}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="btn btn-sm btn-secondary"
                  >
                    Change Product
                  </button>
                </div>

                {/* Target Price */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Target Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="input"
                    placeholder="Enter your target price (e.g., 4.99)"
                    style={{ fontSize: '1.25rem' }}
                    autoFocus
                  />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    You'll be notified when the price drops to or below this amount
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={handleCreateAlert}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    <Bell size={20} />
                    Create Alert
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setSelectedProduct(null);
                      setTargetPrice('');
                      setSearchQuery('');
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceAlertsPage;
