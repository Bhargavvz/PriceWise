import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Plus, Trash2, Search, X, TrendingDown, AlertCircle, Sparkles, ArrowRight, LineChart as LineChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data with price history
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
          created_at: new Date().toISOString(),
          price_history: [
            { date: '2024-01-01', price: 6.49 },
            { date: '2024-01-08', price: 6.29 },
            { date: '2024-01-15', price: 6.19 },
            { date: '2024-01-22', price: 5.99 }
          ]
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
          created_at: new Date().toISOString(),
          price_history: [
            { date: '2024-01-01', price: 0.99 },
            { date: '2024-01-08', price: 0.89 },
            { date: '2024-01-15', price: 0.79 },
            { date: '2024-01-22', price: 0.59 }
          ]
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newAlert = {
        id: Date.now(),
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        product_image: selectedProduct.image_url,
        brand: selectedProduct.brand,
        category: selectedProduct.category,
        current_price: 0,
        target_price: parseFloat(targetPrice),
        is_active: true,
        triggered: false,
        created_at: new Date().toISOString(),
        price_history: []
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
      await new Promise(resolve => setTimeout(resolve, 300));
      setAlerts(alerts.filter(alert => alert.id !== alertId));
      toast.success('Alert deleted');
    } catch (error) {
      toast.error('Failed to delete alert');
    }
  };

  const handleToggleAlert = async (alertId) => {
    try {
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
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
            <Bell size={16} />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>Smart Alerts</span>
          </div>

          <h1 className="animate-fadeInUp" style={{
            fontSize: 'var(--text-6xl)',
            fontWeight: 'extrabold',
            color: 'white',
            marginBottom: 'var(--space-4)',
            letterSpacing: '-0.02em'
          }}>
            Price
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Alerts
            </span>
          </h1>

          <p className="animate-fadeInUp" style={{
            fontSize: 'var(--text-xl)',
            color: 'rgba(255, 255, 255, 0.95)',
            maxWidth: '600px',
            lineHeight: '1.6'
          }}>
            Get notified when your favorite products drop to your target price
          </p>

          {/* Stats Cards */}
          <div className="animate-fadeInUp" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-8)',
            animationDelay: '0.2s'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                fontSize: 'var(--text-5xl)',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: 'var(--space-2)',
                lineHeight: '1'
              }}>
                {activeAlerts.length}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255, 255, 255, 0.9)' }}>
                Active Alerts
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                fontSize: 'var(--text-5xl)',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: 'var(--space-2)',
                lineHeight: '1'
              }}>
                {triggeredAlerts.length}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255, 255, 255, 0.9)' }}>
                Price Drops
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
        {/* Create Alert Button */}
        <div className="animate-fadeInUp" style={{ marginBottom: 'var(--space-8)' }}>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary hover-lift"
            style={{
              height: '3.5rem',
              fontSize: 'var(--text-lg)',
              background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
              boxShadow: '0 8px 24px rgba(236, 72, 153, 0.3)'
            }}
          >
            <Plus size={24} />
            Create New Alert
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Triggered Alerts */}
        {triggeredAlerts.length > 0 && (
          <div className="animate-fadeInUp" style={{ marginBottom: 'var(--space-8)', animationDelay: '0.1s' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-6)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingDown size={24} color="white" />
              </div>
              <h2 style={{ fontSize: 'var(--text-3xl)', margin: 0 }}>
                Price Drops ({triggeredAlerts.length})
              </h2>
            </div>

            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
              {triggeredAlerts.map((alert, index) => (
                <div
                  key={alert.id}
                  className="card hover-lift animate-fadeInUp"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.1) 100%)',
                    border: '2px solid var(--success)',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Top success bar */}
                  <div style={{
                    height: '6px',
                    background: 'var(--gradient-primary)',
                    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                    marginBottom: 'var(--space-4)'
                  }} />

                  <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'start', flexWrap: 'wrap' }}>
                    <img
                      src={alert.product_image || 'https://via.placeholder.com/120'}
                      alt={alert.product_name}
                      style={{
                        width: '120px',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--bg-tertiary)',
                        boxShadow: 'var(--shadow-md)'
                      }}
                      onError={(e) => e.target.src = 'https://via.placeholder.com/120'}
                    />

                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: 'var(--space-2) var(--space-4)',
                        background: 'var(--gradient-primary)',
                        color: 'white',
                        borderRadius: 'var(--radius-full)',
                        marginBottom: 'var(--space-4)',
                        fontWeight: '600',
                        fontSize: 'var(--text-sm)'
                      }}>
                        <Sparkles size={16} />
                        PRICE DROP ALERT!
                      </div>

                      <h3 style={{
                        fontSize: 'var(--text-2xl)',
                        marginBottom: 'var(--space-2)'
                      }}>
                        {alert.product_name}
                      </h3>

                      <div style={{
                        display: 'flex',
                        gap: 'var(--space-2)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-secondary)',
                        marginBottom: 'var(--space-4)'
                      }}>
                        {alert.brand && <span>{alert.brand}</span>}
                        {alert.category && <span>• {alert.category}</span>}
                      </div>

                      {/* Price Chart */}
                      {alert.price_history && alert.price_history.length > 0 && (
                        <div style={{
                          background: 'var(--bg-secondary)',
                          borderRadius: 'var(--radius-lg)',
                          padding: 'var(--space-4)',
                          marginBottom: 'var(--space-4)'
                        }}>
                          <ResponsiveContainer width="100%" height={100}>
                            <LineChart data={alert.price_history}>
                              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                              <XAxis
                                dataKey="date"
                                tick={{ fontSize: 10 }}
                                stroke="var(--text-tertiary)"
                              />
                              <YAxis tick={{ fontSize: 10 }} stroke="var(--text-tertiary)" />
                              <Tooltip
                                contentStyle={{
                                  background: 'var(--bg-primary)',
                                  border: '1px solid var(--border)',
                                  borderRadius: 'var(--radius-md)'
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={{ fill: '#10b981', r: 3 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-secondary)',
                            marginBottom: 'var(--space-1)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Target Price
                          </div>
                          <div style={{
                            fontSize: 'var(--text-3xl)',
                            fontWeight: 'bold',
                            background: 'var(--gradient-primary)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                          }}>
                            ${alert.target_price.toFixed(2)}
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/product/${alert.product_id}`)}
                          className="btn btn-primary hover-lift"
                          style={{
                            background: 'var(--gradient-primary)'
                          }}
                        >
                          View Product
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="btn btn-secondary"
                      style={{ padding: 'var(--space-3)' }}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Alerts */}
        <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-6)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bell size={24} color="white" />
            </div>
            <h2 style={{ fontSize: 'var(--text-3xl)', margin: 0 }}>
              All Alerts ({alerts.length})
            </h2>
          </div>

          {alerts.length > 0 ? (
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
              {alerts.map((alert, index) => (
                <div
                  key={alert.id}
                  className="card hover-lift animate-fadeInUp"
                  style={{
                    opacity: alert.is_active ? 1 : 0.6,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'start', flexWrap: 'wrap' }}>
                    <img
                      src={alert.product_image || 'https://via.placeholder.com/100'}
                      alt={alert.product_name}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--bg-tertiary)'
                      }}
                      onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                    />

                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h3 style={{
                        fontSize: 'var(--text-xl)',
                        marginBottom: 'var(--space-2)'
                      }}>
                        {alert.product_name}
                      </h3>

                      <div style={{
                        display: 'flex',
                        gap: 'var(--space-2)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-secondary)',
                        marginBottom: 'var(--space-4)'
                      }}>
                        {alert.brand && <span>{alert.brand}</span>}
                        {alert.category && <span>• {alert.category}</span>}
                      </div>

                      <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-tertiary)',
                            marginBottom: 'var(--space-1)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Target Price
                          </div>
                          <div style={{
                            fontSize: 'var(--text-2xl)',
                            fontWeight: 'bold',
                            color: 'var(--primary)'
                          }}>
                            ${alert.target_price.toFixed(2)}
                          </div>
                        </div>

                        <div>
                          <div style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-tertiary)',
                            marginBottom: 'var(--space-1)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Status
                          </div>
                          <div style={{
                            display: 'inline-block',
                            padding: 'var(--space-1) var(--space-3)',
                            background: alert.is_active
                              ? 'rgba(16, 185, 129, 0.1)'
                              : 'rgba(156, 163, 175, 0.1)',
                            color: alert.is_active ? 'var(--primary)' : 'var(--text-tertiary)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: '600'
                          }}>
                            {alert.is_active ? 'Active' : 'Paused'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button
                        onClick={() => handleToggleAlert(alert.id)}
                        className="btn btn-secondary"
                        title={alert.is_active ? 'Pause alert' : 'Activate alert'}
                      >
                        {alert.is_active ? 'Pause' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="btn btn-secondary"
                        style={{ padding: 'var(--space-3)', color: 'var(--danger)' }}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{
              textAlign: 'center',
              padding: 'var(--space-16)',
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(190, 24, 93, 0.1) 100%)',
              border: '2px dashed var(--border)'
            }}>
              <div style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(190, 24, 93, 0.15) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-6)'
              }}>
                <Bell size={48} color="#ec4899" />
              </div>
              <h3 style={{
                fontSize: 'var(--text-2xl)',
                marginBottom: 'var(--space-3)'
              }}>
                No Price Alerts Yet
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-6)',
                maxWidth: '500px',
                margin: '0 auto var(--space-6)'
              }}>
                Create your first price alert to get notified when products reach your target price
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary hover-lift"
                style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)'
                }}
              >
                <Plus size={20} />
                Create Your First Alert
              </button>
            </div>
          )}
        </div>
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
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 'var(--space-4)',
            backdropFilter: 'blur(8px)'
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="card animate-fadeIn"
            style={{
              width: '100%',
              maxWidth: '600px',
              maxHeight: '85vh',
              overflow: 'auto',
              boxShadow: 'var(--shadow-2xl)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-6)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Bell size={24} color="white" />
                </div>
                <h2 style={{ margin: 0, fontSize: 'var(--text-3xl)' }}>
                  Create Price Alert
                </h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 'var(--space-2)',
                  color: 'var(--text-secondary)'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {!selectedProduct ? (
              <>
                <div style={{ position: 'relative', marginBottom: 'var(--space-6)' }}>
                  <Search
                    size={20}
                    style={{
                      position: 'absolute',
                      left: 'var(--space-4)',
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
                    style={{
                      paddingLeft: 'var(--space-12)',
                      height: '3.5rem',
                      fontSize: 'var(--text-lg)'
                    }}
                    autoFocus
                  />
                </div>

                {searching && <LoadingSpinner />}

                {!searching && searchResults.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {searchResults.map(product => (
                      <button
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="hover-lift"
                        style={{
                          padding: 'var(--space-4)',
                          border: '2px solid var(--border)',
                          borderRadius: 'var(--radius-lg)',
                          background: 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'var(--transition)',
                          display: 'flex',
                          gap: 'var(--space-4)',
                          alignItems: 'center'
                        }}
                        onMouseEnter={(e) => e.target.style.borderColor = '#ec4899'}
                        onMouseLeave={(e) => e.target.style.borderColor = 'var(--border)'}
                      >
                        <img
                          src={product.image_url || 'https://via.placeholder.com/80'}
                          alt={product.name}
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-lg)',
                            backgroundColor: 'var(--bg-tertiary)'
                          }}
                          onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                        />
                        <div style={{ flex: 1 }}>
                          <h4 style={{
                            marginBottom: 'var(--space-1)',
                            fontSize: 'var(--text-lg)'
                          }}>
                            {product.name}
                          </h4>
                          <p style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-secondary)',
                            margin: 0
                          }}>
                            {product.brand && `${product.brand} • `}
                            {product.category}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {!searching && searchQuery && searchResults.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: 'var(--space-12)',
                    color: 'var(--text-secondary)'
                  }}>
                    <AlertCircle size={64} style={{
                      margin: '0 auto var(--space-4)',
                      color: 'var(--text-tertiary)'
                    }} />
                    <p>No products found. Try a different search term.</p>
                  </div>
                )}

                {!searchQuery && (
                  <div style={{
                    textAlign: 'center',
                    padding: 'var(--space-12)',
                    color: 'var(--text-secondary)'
                  }}>
                    <Search size={64} style={{
                      margin: '0 auto var(--space-4)',
                      color: 'var(--text-tertiary)'
                    }} />
                    <p>Start typing to search for products</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{
                  padding: 'var(--space-6)',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-xl)',
                  marginBottom: 'var(--space-6)'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: 'var(--space-4)',
                    marginBottom: 'var(--space-4)'
                  }}>
                    <img
                      src={selectedProduct.image_url || 'https://via.placeholder.com/100'}
                      alt={selectedProduct.name}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--bg-tertiary)'
                      }}
                      onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                    />
                    <div>
                      <h3 style={{
                        marginBottom: 'var(--space-2)',
                        fontSize: 'var(--text-xl)'
                      }}>
                        {selectedProduct.name}
                      </h3>
                      <p style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-secondary)',
                        margin: 0
                      }}>
                        {selectedProduct.brand && `${selectedProduct.brand} • `}
                        {selectedProduct.category}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="btn btn-secondary"
                  >
                    Change Product
                  </button>
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
                    style={{
                      fontSize: 'var(--text-2xl)',
                      height: '4rem',
                      fontWeight: 'bold'
                    }}
                    autoFocus
                  />
                  <p style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    marginTop: 'var(--space-2)'
                  }}>
                    You'll be notified when the price drops to or below this amount
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <button
                    onClick={handleCreateAlert}
                    className="btn btn-primary hover-lift"
                    style={{
                      flex: 1,
                      height: '3.5rem',
                      background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)'
                    }}
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
                    style={{ height: '3.5rem' }}
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
