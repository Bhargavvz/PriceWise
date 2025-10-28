import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Trash2, Check, X, Search, Zap, MapPin,
  ShoppingBag, DollarSign, TrendingUp, Store, Sparkles, 
  Package, AlertCircle, CheckCircle2
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { listService, productService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const ShoppingListDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [list, setList] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [optimization, setOptimization] = useState(null);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    loadListData();
  }, [id]);

  const loadListData = async () => {
    try {
      setLoading(true);
      const response = await listService.getList(id);
      if (response.success) {
        setList(response.data);
        setItems(response.data.items || []);
      }
    } catch (error) {
      console.error('Error loading list:', error);
      toast.error('Failed to load shopping list');
      navigate('/lists');
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchProducts();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddProduct = async (product) => {
    try {
      await listService.addItem(id, product.id, 1);
      toast.success(`Added ${product.name} to list`);
      loadListData();
      setShowAddProduct(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      toast.error('Failed to add item to list');
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await listService.updateItem(itemId, { quantity: newQuantity });
      setItems(items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
      toast.success('Quantity updated');
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleToggleChecked = async (itemId, checked) => {
    try {
      await listService.updateItem(itemId, { checked: !checked });
      setItems(items.map(item => 
        item.id === itemId ? { ...item, checked: !checked } : item
      ));
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!confirm('Remove this item from the list?')) return;

    try {
      await listService.removeItem(itemId);
      setItems(items.filter(item => item.id !== itemId));
      toast.success('Item removed');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleOptimize = async () => {
    if (items.length === 0) {
      toast.warning('Add items to your list first');
      return;
    }

    try {
      setOptimizing(true);
      
      const lat = user?.location_lat || 40.7128;
      const lng = user?.location_lng || -74.0060;

      const response = await listService.optimizeList(id, lat, lng, 10);
      
      if (response.success) {
        setOptimization(response.data);
        toast.success('List optimized! See recommendations below.');
      }
    } catch (error) {
      console.error('Optimization error:', error);
      toast.error('Failed to optimize list');
    } finally {
      setOptimizing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!list) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-6)',
            boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)'
          }}>
            <AlertCircle size={48} color="white" />
          </div>
          <h2 style={{ 
            fontSize: 'var(--text-2xl)', 
            marginBottom: 'var(--space-3)',
            fontWeight: 'var(--font-bold)'
          }}>
            List Not Found
          </h2>
          <p style={{ 
            color: 'var(--text-secondary)', 
            marginBottom: 'var(--space-6)',
            fontSize: 'var(--text-lg)'
          }}>
            The shopping list you're looking for doesn't exist or has been removed.
          </p>
          <button 
            onClick={() => navigate('/lists')} 
            className="btn btn-primary hover-lift"
            style={{
              background: 'var(--gradient-primary)',
              color: 'white',
              height: '3rem'
            }}
          >
            <ArrowLeft size={20} />
            Back to Lists
          </button>
        </div>
      </div>
    );
  }

  const totalItems = items.length;
  const checkedItems = items.filter(item => item.checked).length;
  const progressPercent = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  // Get list color (from ShoppingListsPage color system)
  const colors = ['#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
  const listColor = colors[list.id % colors.length];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 'var(--space-12)' }}>
      {/* Hero Header with Gradient */}
      <div style={{
        background: `linear-gradient(135deg, ${listColor} 0%, ${listColor}dd 100%)`,
        padding: 'var(--space-12) 0 var(--space-16)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Pattern Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'fadeIn 1s ease-out'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Back Button */}
          <button
            onClick={() => navigate('/lists')}
            className="btn hover-lift"
            style={{
              marginBottom: 'var(--space-6)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              animation: 'fadeInDown 0.6s ease-out'
            }}
          >
            <ArrowLeft size={20} />
            Back to Lists
          </button>

          {/* List Info */}
          <div style={{ 
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-6)',
            flexWrap: 'wrap',
            animation: 'fadeInUp 0.6s ease-out 0.1s backwards'
          }}>
            {/* List Icon */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: 'var(--radius-2xl)',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
            }}>
              <ShoppingBag size={56} color={listColor} />
            </div>

            {/* List Details */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h1 style={{
                color: 'white',
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--text-5xl)',
                fontWeight: 'var(--font-extrabold)',
                letterSpacing: '-0.02em'
              }}>
                {list.name}
              </h1>
              
              {list.description && (
                <p style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: 'var(--text-lg)',
                  marginBottom: 'var(--space-4)',
                  lineHeight: '1.6'
                }}>
                  {list.description}
                </p>
              )}

              {/* Quick Stats */}
              <div style={{
                display: 'flex',
                gap: 'var(--space-4)',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-4)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <Package size={18} color="white" />
                  <span style={{ color: 'white', fontWeight: 'var(--font-semibold)' }}>
                    {totalItems} items
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-4)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <CheckCircle2 size={18} color="white" />
                  <span style={{ color: 'white', fontWeight: 'var(--font-semibold)' }}>
                    {checkedItems} completed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-3rem', position: 'relative', zIndex: 10 }}>
        {/* Progress Card */}
        {totalItems > 0 && (
          <div className="card hover-lift" style={{
            marginBottom: 'var(--space-8)',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.1) 100%)',
            border: '2px solid rgba(16, 185, 129, 0.2)',
            animation: 'fadeInUp 0.6s ease-out 0.2s backwards'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-4)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)'
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
                  <TrendingUp size={24} color="white" />
                </div>
                <div>
                  <h3 style={{ 
                    marginBottom: 'var(--space-1)',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-bold)'
                  }}>
                    Shopping Progress
                  </h3>
                  <p style={{ 
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--text-sm)'
                  }}>
                    {checkedItems} of {totalItems} items completed
                  </p>
                </div>
              </div>

              <div style={{
                fontSize: 'var(--text-4xl)',
                fontWeight: 'var(--font-extrabold)',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {Math.round(progressPercent)}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar">
              <div 
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-8)',
          flexWrap: 'wrap',
          animation: 'fadeInUp 0.6s ease-out 0.3s backwards'
        }}>
          <button
            onClick={() => setShowAddProduct(true)}
            className="btn hover-lift"
            style={{
              flex: '1',
              minWidth: '200px',
              background: 'var(--gradient-primary)',
              color: 'white',
              height: '3.5rem',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-semibold)'
            }}
          >
            <Plus size={24} />
            Add Product
          </button>
          
          <button
            onClick={handleOptimize}
            className="btn btn-secondary hover-lift"
            disabled={optimizing || items.length === 0}
            style={{
              flex: '1',
              minWidth: '200px',
              height: '3.5rem',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-semibold)',
              background: optimizing ? 'var(--bg-tertiary)' : 'transparent',
              border: '2px solid var(--border)'
            }}
          >
            <Zap size={24} />
            {optimizing ? 'Optimizing...' : 'Optimize List'}
          </button>
        </div>

        {/* Shopping List Items */}
        <div className="card" style={{
          marginBottom: 'var(--space-8)',
          animation: 'fadeInUp 0.6s ease-out 0.4s backwards'
        }}>
          {/* Icon Header */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-xl)',
            background: `linear-gradient(135deg, ${listColor} 0%, ${listColor}dd 100%)`,
            marginBottom: 'var(--space-4)'
          }}>
            <ShoppingBag size={28} color="white" />
          </div>

          <h2 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-bold)',
            marginBottom: 'var(--space-2)'
          }}>
            Shopping Items
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-6)',
            fontSize: 'var(--text-lg)'
          }}>
            {totalItems === 0 
              ? 'No items in your list yet. Add some products to get started!'
              : `Manage your ${totalItems} shopping ${totalItems === 1 ? 'item' : 'items'}`
            }
          </p>

          {items.length > 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)'
            }}>
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="hover-lift"
                  style={{
                    padding: 'var(--space-4)',
                    border: '2px solid var(--border)',
                    borderRadius: 'var(--radius-xl)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    opacity: item.checked ? 0.6 : 1,
                    transition: 'all var(--transition-base)',
                    background: item.checked 
                      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)'
                      : 'var(--bg-primary)',
                    animation: `fadeInUp 0.4s ease-out ${0.05 * index}s backwards`
                  }}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleChecked(item.id, item.checked)}
                    className="hover-scale"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--radius-md)',
                      border: `3px solid ${item.checked ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: item.checked ? 'var(--primary)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all var(--transition-base)'
                    }}
                  >
                    {item.checked && <Check size={18} color="white" strokeWidth={3} />}
                  </button>

                  {/* Product Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{
                      marginBottom: 'var(--space-1)',
                      textDecoration: item.checked ? 'line-through' : 'none',
                      fontSize: 'var(--text-lg)',
                      fontWeight: 'var(--font-semibold)',
                      color: item.checked ? 'var(--text-tertiary)' : 'var(--text-primary)'
                    }}>
                      {item.product_name}
                    </h4>
                    <div style={{
                      display: 'flex',
                      gap: 'var(--space-3)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
                      flexWrap: 'wrap'
                    }}>
                      {item.category && (
                        <span style={{
                          padding: 'var(--space-1) var(--space-2)',
                          background: 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-medium)'
                        }}>
                          {item.category}
                        </span>
                      )}
                      {item.brand && (
                        <span style={{
                          padding: 'var(--space-1) var(--space-2)',
                          background: 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-medium)'
                        }}>
                          {item.brand}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-2)',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-lg)'
                  }}>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="btn btn-sm hover-scale"
                      style={{
                        width: '32px',
                        height: '32px',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid var(--border)',
                        background: 'var(--bg-primary)'
                      }}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span style={{
                      minWidth: '2.5rem',
                      textAlign: 'center',
                      fontWeight: 'var(--font-bold)',
                      fontSize: 'var(--text-lg)'
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="btn btn-sm hover-scale"
                      style={{
                        width: '32px',
                        height: '32px',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid var(--border)',
                        background: 'var(--bg-primary)'
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="btn btn-sm hover-scale"
                    style={{
                      width: '40px',
                      height: '40px',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-lg)',
                      border: '2px solid rgba(239, 68, 68, 0.2)',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: 'var(--danger)'
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div style={{
              textAlign: 'center',
              padding: 'var(--space-16) var(--space-8)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.1) 100%)',
              borderRadius: 'var(--radius-2xl)',
              border: '2px dashed rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-6)',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
              }}>
                <ShoppingBag size={48} color="white" />
              </div>
              <h3 style={{
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-bold)'
              }}>
                No Items Yet
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-6)',
                fontSize: 'var(--text-lg)',
                maxWidth: '400px',
                margin: '0 auto var(--space-6)'
              }}>
                Start building your shopping list by adding products
              </p>
              <button
                onClick={() => setShowAddProduct(true)}
                className="btn hover-lift"
                style={{
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  height: '3.5rem',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-semibold)'
                }}
              >
                <Plus size={24} />
                Add Your First Item
              </button>
            </div>
          )}
        </div>

        {/* Optimization Results */}
        {optimization && (
          <div className="card" style={{
            animation: 'fadeInUp 0.6s ease-out 0.5s backwards'
          }}>
            {/* Icon Header */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              marginBottom: 'var(--space-4)'
            }}>
              <Zap size={28} color="white" />
            </div>

            <h2 style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-bold)',
              marginBottom: 'var(--space-2)'
            }}>
              Smart Store Recommendations
            </h2>
            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-6)',
              fontSize: 'var(--text-lg)'
            }}>
              Based on {optimization.total_items} items in your list, here are the best stores
            </p>

            {optimization.recommendations && optimization.recommendations.length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)'
              }}>
                {optimization.recommendations.slice(0, 5).map((rec, index) => (
                  <div
                    key={rec.store_id}
                    className="hover-lift"
                    style={{
                      padding: 'var(--space-6)',
                      border: index === 0 
                        ? '3px solid var(--primary)'
                        : '2px solid var(--border)',
                      borderRadius: 'var(--radius-2xl)',
                      background: index === 0 
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
                        : 'var(--bg-primary)',
                      position: 'relative',
                      animation: `fadeInUp 0.4s ease-out ${0.1 * index}s backwards`
                    }}
                  >
                    {/* Best Value Badge */}
                    {index === 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: 'var(--space-2) var(--space-4)',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-bold)',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                        animation: 'pulse 2s ease-in-out infinite'
                      }}>
                        <Sparkles size={16} />
                        BEST VALUE
                      </div>
                    )}

                    {/* Store Info */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 'var(--space-4)',
                      flexWrap: 'wrap',
                      gap: 'var(--space-4)'
                    }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-3)',
                          marginBottom: 'var(--space-2)'
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-lg)',
                            background: index === 0 
                              ? 'var(--gradient-primary)'
                              : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'var(--text-xl)',
                            fontWeight: 'var(--font-bold)',
                            color: 'white'
                          }}>
                            #{index + 1}
                          </div>
                          <div>
                            <h3 style={{
                              marginBottom: 'var(--space-1)',
                              fontSize: 'var(--text-xl)',
                              fontWeight: 'var(--font-bold)'
                            }}>
                              {rec.store_name}
                            </h3>
                            {rec.chain_name && (
                              <p style={{
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-secondary)'
                              }}>
                                {rec.chain_name}
                              </p>
                            )}
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-2)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-tertiary)'
                        }}>
                          <MapPin size={16} />
                          <span>{rec.distance.toFixed(1)} miles away</span>
                        </div>
                      </div>

                      {/* Total Price */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: 'var(--text-5xl)',
                          fontWeight: 'var(--font-extrabold)',
                          background: index === 0 
                            ? 'var(--gradient-primary)'
                            : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          marginBottom: 'var(--space-1)'
                        }}>
                          ${rec.total.toFixed(2)}
                        </div>
                        <p style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-secondary)',
                          fontWeight: 'var(--font-medium)'
                        }}>
                          {rec.coverage} of {optimization.total_items} items ({rec.coverage_percent}%)
                        </p>
                      </div>
                    </div>

                    {/* Available Items */}
                    <div style={{
                      paddingTop: 'var(--space-4)',
                      borderTop: '1px solid var(--border)'
                    }}>
                      <p style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        marginBottom: 'var(--space-3)',
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Available Items:
                      </p>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: 'var(--space-2)'
                      }}>
                        {rec.items.slice(0, 6).map(item => (
                          <div
                            key={item.product_id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: 'var(--space-2) var(--space-3)',
                              background: 'var(--bg-secondary)',
                              borderRadius: 'var(--radius-md)',
                              fontSize: 'var(--text-sm)'
                            }}
                          >
                            <span style={{ 
                              color: 'var(--text-secondary)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {item.product_name}
                            </span>
                            <span style={{
                              fontWeight: 'var(--font-bold)',
                              color: 'var(--text-primary)',
                              marginLeft: 'var(--space-2)'
                            }}>
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      {rec.items.length > 6 && (
                        <p style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-tertiary)',
                          marginTop: 'var(--space-3)',
                          fontStyle: 'italic'
                        }}>
                          +{rec.items.length - 6} more items available
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: 'var(--space-12)',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.1) 100%)',
                borderRadius: 'var(--radius-2xl)',
                border: '2px dashed rgba(245, 158, 11, 0.2)'
              }}>
                <AlertCircle size={48} color="#f59e0b" style={{ margin: '0 auto var(--space-4)' }} />
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--text-lg)'
                }}>
                  No recommendations available. Make sure items in your list have prices at nearby stores.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            padding: 'var(--space-4)',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setShowAddProduct(false)}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '600px',
              maxHeight: '85vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
              animation: 'scaleIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-6)',
              paddingBottom: 'var(--space-4)',
              borderBottom: '2px solid var(--border)'
            }}>
              <div>
                <h3 style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-bold)',
                  marginBottom: 'var(--space-1)'
                }}>
                  Add Product to List
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  Search and select products to add
                </p>
              </div>
              <button
                onClick={() => setShowAddProduct(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)',
                  transition: 'all var(--transition-base)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <X size={28} />
              </button>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: 'var(--space-6)' }}>
              <Search
                size={22}
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
                placeholder="Search products..."
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

            {/* Search Results */}
            {searching && (
              <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
                <LoadingSpinner />
              </div>
            )}
            
            {!searching && searchResults.length > 0 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)'
              }}>
                {searchResults.map((product, index) => (
                  <button
                    key={product.id}
                    onClick={() => handleAddProduct(product)}
                    className="hover-lift"
                    style={{
                      padding: 'var(--space-4)',
                      border: '2px solid var(--border)',
                      borderRadius: 'var(--radius-xl)',
                      background: 'var(--bg-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all var(--transition-base)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      animation: `fadeInUp 0.3s ease-out ${0.05 * index}s backwards`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'var(--bg-primary)';
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        marginBottom: 'var(--space-1)',
                        fontSize: 'var(--text-lg)',
                        fontWeight: 'var(--font-semibold)'
                      }}>
                        {product.name}
                      </h4>
                      <div style={{
                        display: 'flex',
                        gap: 'var(--space-2)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-secondary)',
                        flexWrap: 'wrap'
                      }}>
                        {product.brand && (
                          <span style={{
                            padding: 'var(--space-1) var(--space-2)',
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--text-xs)'
                          }}>
                            {product.brand}
                          </span>
                        )}
                        {product.category && (
                          <span style={{
                            padding: 'var(--space-1) var(--space-2)',
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--text-xs)'
                          }}>
                            {product.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--gradient-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Plus size={24} color="white" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!searching && searchQuery && searchResults.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: 'var(--space-12)',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-xl)'
              }}>
                <Search size={48} color="var(--text-tertiary)" style={{ margin: '0 auto var(--space-4)' }} />
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--text-lg)'
                }}>
                  No products found. Try a different search term.
                </p>
              </div>
            )}

            {!searchQuery && (
              <div style={{
                textAlign: 'center',
                padding: 'var(--space-12)',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.1) 100%)',
                borderRadius: 'var(--radius-xl)',
                border: '2px dashed rgba(16, 185, 129, 0.2)'
              }}>
                <Search size={48} color="#10b981" style={{ margin: '0 auto var(--space-4)' }} />
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--text-lg)'
                }}>
                  Start typing to search for products
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListDetailPage;
