import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, MapPin, TrendingDown, Plus, ShoppingCart } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { productService, priceService, listService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [prices, setPrices] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showAddToList, setShowAddToList] = useState(false);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    loadProductData();
  }, [id]);

  const loadProductData = async () => {
    try {
      setLoading(true);
      const [productRes, pricesRes] = await Promise.all([
        productService.getProduct(id),
        priceService.getProductPrices(id)
      ]);

      if (productRes.success) {
        setProduct(productRes.data);
      }

      if (pricesRes.success) {
        setPrices(pricesRes.data);
        if (pricesRes.data.length > 0) {
          const firstStore = pricesRes.data[0];
          setSelectedStore(firstStore);
          loadPriceHistory(id, firstStore.store_id);
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const loadPriceHistory = async (productId, storeId) => {
    try {
      const response = await priceService.getPriceHistory(productId, storeId, 30);
      if (response.success) {
        setPriceHistory(response.data.map(item => ({
          date: new Date(item.date_recorded).toLocaleDateString(),
          price: parseFloat(item.price)
        })));
      }
    } catch (error) {
      console.error('Error loading price history:', error);
    }
  };

  const handleStoreSelect = (storePrice) => {
    setSelectedStore(storePrice);
    loadPriceHistory(id, storePrice.store_id);
  };

  const handleAddToList = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to lists');
      navigate('/login');
      return;
    }

    try {
      const response = await listService.getLists();
      if (response.success) {
        setLists(response.data);
        setShowAddToList(true);
      }
    } catch (error) {
      toast.error('Failed to load shopping lists');
    }
  };

  const addToList = async (listId) => {
    try {
      await listService.addItem(listId, parseInt(id), 1);
      toast.success('Added to shopping list!');
      setShowAddToList(false);
    } catch (error) {
      toast.error('Failed to add to list');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Go Home
        </button>
      </div>
    );
  }

  const lowestPrice = prices.length > 0 ? prices[0] : null;
  const highestPrice = prices.length > 0 ? prices[prices.length - 1] : null;
  const savings = lowestPrice && highestPrice ? 
    (parseFloat(highestPrice.price) - parseFloat(lowestPrice.price)).toFixed(2) : 0;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary"
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Product Info */}
        <div className="card">
          <div style={{
            width: '100%',
            height: '300px',
            marginBottom: '1.5rem',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-tertiary)'
          }}>
            <img
              src={product.image_url || 'https://via.placeholder.com/400x300?text=No+Image'}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
              }}
            />
          </div>

          <h1 style={{ marginBottom: '0.75rem' }}>{product.name}</h1>
          
          {product.brand && (
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Brand: {product.brand}
            </p>
          )}

          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem'
          }}>
            {product.category}
          </div>

          {product.description && (
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {product.description}
            </p>
          )}

          {product.dietary_tags && product.dietary_tags.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Dietary Information:
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {product.dietary_tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: 'rgba(22, 163, 74, 0.1)',
                      color: 'var(--primary)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToList}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            <Plus size={20} />
            Add to Shopping List
          </button>
        </div>

        {/* Price Summary */}
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>Price Summary</h2>

          {lowestPrice && (
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Best Price
              </p>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                ${parseFloat(lowestPrice.price).toFixed(2)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <MapPin size={16} />
                <span>{lowestPrice.store_name}</span>
              </div>
              {lowestPrice.unit_price && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                  ${parseFloat(lowestPrice.unit_price).toFixed(2)} per unit
                </p>
              )}
            </div>
          )}

          {savings > 0 && (
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(22, 163, 74, 0.1)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <TrendingDown size={20} color="var(--primary)" />
                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                  Save up to ${savings}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                by shopping at the lowest priced store
              </p>
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border)'
          }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Stores Offering
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {prices.length}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Price Range
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                ${lowestPrice ? parseFloat(lowestPrice.price).toFixed(2) : '0'} - 
                ${highestPrice ? parseFloat(highestPrice.price).toFixed(2) : '0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Store Prices */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Available at {prices.length} Stores</h2>
        
        {prices.length > 0 ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {prices.map((storePrice, index) => (
              <div
                key={storePrice.store_id}
                onClick={() => handleStoreSelect(storePrice)}
                style={{
                  padding: '1rem',
                  border: `2px solid ${selectedStore?.store_id === storePrice.store_id ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  backgroundColor: selectedStore?.store_id === storePrice.store_id ? 'rgba(22, 163, 74, 0.05)' : 'transparent'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: '0.25rem' }}>{storePrice.store_name}</h3>
                    {storePrice.chain_name && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        {storePrice.chain_name}
                      </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                      <MapPin size={14} />
                      <span>{storePrice.address}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: index === 0 ? 'var(--primary)' : 'var(--text-primary)' }}>
                      ${parseFloat(storePrice.price).toFixed(2)}
                    </div>
                    {storePrice.unit_price && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                        ${parseFloat(storePrice.unit_price).toFixed(2)}/unit
                      </p>
                    )}
                    {index === 0 && (
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        marginTop: '0.5rem'
                      }}>
                        BEST PRICE
                      </span>
                    )}
                    {storePrice.on_sale && (
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: 'var(--danger)',
                        color: 'white',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        marginTop: '0.5rem',
                        marginLeft: '0.5rem'
                      }}>
                        ON SALE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
            No pricing information available
          </p>
        )}
      </div>

      {/* Price History Chart */}
      {priceHistory.length > 0 && (
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>
            Price History at {selectedStore?.store_name}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
              <Line type="monotone" dataKey="price" stroke="var(--primary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Add to List Modal */}
      {showAddToList && (
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
            zIndex: 100
          }}
          onClick={() => setShowAddToList(false)}
        >
          <div
            className="card"
            style={{ width: '100%', maxWidth: '400px', margin: '1rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '1.5rem' }}>Add to Shopping List</h3>
            
            {lists.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {lists.map(list => (
                  <button
                    key={list.id}
                    onClick={() => addToList(list.id)}
                    className="btn btn-secondary"
                    style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                  >
                    <ShoppingCart size={20} />
                    {list.name}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  You don't have any shopping lists yet
                </p>
                <button
                  onClick={() => navigate('/lists')}
                  className="btn btn-primary"
                >
                  Create a List
                </button>
              </div>
            )}

            <button
              onClick={() => setShowAddToList(false)}
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
