import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Check, X, Search, Zap, MapPin } from 'lucide-react';
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
      
      // Get user location or use default
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
      <div className="container" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
        <h2>List not found</h2>
        <button onClick={() => navigate('/lists')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Lists
        </button>
      </div>
    );
  }

  const totalItems = items.length;
  const checkedItems = items.filter(item => item.checked).length;
  const progressPercent = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Header */}
      <button
        onClick={() => navigate('/lists')}
        className="btn btn-secondary"
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={20} />
        Back to Lists
      </button>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>{list.name}</h1>
        {list.description && (
          <p style={{ color: 'var(--text-secondary)' }}>{list.description}</p>
        )}
      </div>

      {/* Progress Bar */}
      {totalItems > 0 && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '500' }}>Progress</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              {checkedItems} of {totalItems} items
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: 'var(--primary)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setShowAddProduct(true)}
          className="btn btn-primary"
        >
          <Plus size={20} />
          Add Product
        </button>
        
        <button
          onClick={handleOptimize}
          className="btn btn-secondary"
          disabled={optimizing || items.length === 0}
        >
          <Zap size={20} />
          {optimizing ? 'Optimizing...' : 'Optimize List'}
        </button>
      </div>

      {/* Shopping List Items */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Items ({totalItems})</h2>

        {items.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map(item => (
              <div
                key={item.id}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  opacity: item.checked ? 0.6 : 1,
                  transition: 'var(--transition)'
                }}
              >
                {/* Checkbox */}
                <button
                  onClick={() => handleToggleChecked(item.id, item.checked)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: 'var(--radius-sm)',
                    border: `2px solid ${item.checked ? 'var(--primary)' : 'var(--border)'}`,
                    backgroundColor: item.checked ? 'var(--primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  {item.checked && <Check size={16} color="white" />}
                </button>

                {/* Product Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{
                    marginBottom: '0.25rem',
                    textDecoration: item.checked ? 'line-through' : 'none'
                  }}>
                    {item.product_name}
                  </h4>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {item.category && <span>{item.category}</span>}
                    {item.brand && <span>• {item.brand}</span>}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="btn btn-sm btn-secondary"
                    style={{ padding: '0.25rem 0.5rem' }}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span style={{ 
                    minWidth: '2rem', 
                    textAlign: 'center',
                    fontWeight: '500'
                  }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="btn btn-sm btn-secondary"
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="btn btn-sm btn-secondary"
                  style={{ padding: '0.5rem', color: 'var(--danger)' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>No items yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Add products to start building your shopping list
            </p>
            <button onClick={() => setShowAddProduct(true)} className="btn btn-primary">
              <Plus size={20} />
              Add Your First Item
            </button>
          </div>
        )}
      </div>

      {/* Optimization Results */}
      {optimization && (
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>
            Store Recommendations
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Based on {optimization.total_items} items in your list
          </p>

          {optimization.recommendations && optimization.recommendations.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {optimization.recommendations.slice(0, 5).map((rec, index) => (
                <div
                  key={rec.store_id}
                  style={{
                    padding: '1.5rem',
                    border: `2px solid ${index === 0 ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: index === 0 ? 'rgba(22, 163, 74, 0.05)' : 'transparent'
                  }}
                >
                  {index === 0 && (
                    <div style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      marginBottom: '1rem'
                    }}>
                      BEST VALUE
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ marginBottom: '0.5rem' }}>{rec.store_name}</h3>
                      {rec.chain_name && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                          {rec.chain_name}
                        </p>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                        <MapPin size={14} />
                        <span>{rec.distance.toFixed(1)} miles away</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: index === 0 ? 'var(--primary)' : 'var(--text-primary)' }}>
                        ${rec.total.toFixed(2)}
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {rec.coverage} of {optimization.total_items} items ({rec.coverage_percent}%)
                      </p>
                    </div>
                  </div>

                  {/* Items at this store */}
                  <div style={{
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border)'
                  }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.75rem' }}>
                      Available items:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                      {rec.items.slice(0, 6).map(item => (
                        <div key={item.product_id} style={{
                          fontSize: '0.875rem',
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}>
                          <span>{item.product_name}</span>
                          <span style={{ fontWeight: '500' }}>${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                      {rec.items.length > 6 && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                          +{rec.items.length - 6} more items
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
              No recommendations available. Make sure items in your list have prices at nearby stores.
            </p>
          )}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem'
          }}
          onClick={() => setShowAddProduct(false)}
        >
          <div
            className="card"
            style={{ width: '100%', maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Add Product to List</h3>
              <button
                onClick={() => setShowAddProduct(false)}
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

            {/* Search */}
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
                placeholder="Search products..."
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
                    onClick={() => handleAddProduct(product)}
                    style={{
                      padding: '1rem',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'var(--transition)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onMouseLeave={(e) => e.target.style.borderColor = 'var(--border)'}
                  >
                    <div>
                      <h4 style={{ marginBottom: '0.25rem' }}>{product.name}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {product.brand && `${product.brand} • `}
                        {product.category}
                      </p>
                    </div>
                    <Plus size={20} color="var(--primary)" />
                  </button>
                ))}
              </div>
            )}

            {!searching && searchQuery && searchResults.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                No products found. Try a different search term.
              </p>
            )}

            {!searchQuery && (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                Start typing to search for products
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListDetailPage;
