import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, MapPin, TrendingDown, Plus, ShoppingCart, Heart, Share2, Star, Package, Info, BarChart3, Store, X, ZoomIn, Sparkles } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
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
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showImageLightbox, setShowImageLightbox] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    loadProductData();
  }, [id]);

  useEffect(() => {
    if (product) {
      loadSimilarProducts();
    }
  }, [product]);

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

  const loadSimilarProducts = async () => {
    try {
      const response = await productService.search({ 
        category: product.category,
        limit: 4 
      });
      if (response.success) {
        const similar = response.data.filter(p => p.id !== product.id).slice(0, 4);
        setSimilarProducts(similar);
      }
    } catch (error) {
      console.error('Error loading similar products:', error);
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
      <div className="container" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
        <Package size={64} color="var(--text-tertiary)" style={{ margin: '0 auto var(--space-4)' }} />
        <h2 style={{ marginBottom: 'var(--space-4)' }}>Product not found</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary">
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Breadcrumb & Actions Bar */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        padding: 'var(--space-4) 0',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)'
        }}>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            <ArrowLeft size={20} />
            Back to Results
          </button>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="btn btn-secondary"
              style={{
                padding: 'var(--space-3)',
                background: isFavorite ? 'rgba(239, 68, 68, 0.1)' : undefined,
                color: isFavorite ? 'var(--danger)' : undefined
              }}
            >
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ padding: 'var(--space-3)' }}
              onClick={() => toast.success('Link copied!')}
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
        {/* Main Product Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-8)'
        }}>
          {/* Image Gallery */}
          <div className="card animate-fadeInLeft" style={{ padding: 0, overflow: 'hidden' }}>
            <div
              onClick={() => setShowImageLightbox(true)}
              style={{
                width: '100%',
                height: '500px',
                position: 'relative',
                backgroundColor: 'var(--bg-tertiary)',
                cursor: 'zoom-in'
              }}
            >
              <img
                src={product.image_url || 'https://via.placeholder.com/800x600?text=No+Image'}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => e.target.src = 'https://via.placeholder.com/800x600?text=No+Image'}
              />
              <div style={{
                position: 'absolute',
                bottom: 'var(--space-4)',
                right: 'var(--space-4)',
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-sm)'
              }}>
                <ZoomIn size={18} style={{ display: 'inline', marginRight: '4px' }} />
                Zoom
              </div>
              {lowestPrice?.on_sale && (
                <div style={{
                  position: 'absolute',
                  top: 'var(--space-4)',
                  left: 'var(--space-4)',
                  background: 'linear-gradient(135deg, var(--danger) 0%, var(--danger-dark) 100%)',
                  color: 'white',
                  padding: 'var(--space-3) var(--space-5)',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 'bold',
                  animation: 'pulse 2s infinite'
                }}>
                  <TrendingDown size={16} style={{ display: 'inline', marginRight: '4px' }} />
                  ON SALE
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="card animate-fadeInRight">
            <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-3)' }}>
              {product.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="var(--warning)" color="var(--warning)" />
              ))}
              <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>4.5 (127)</span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
              {product.brand && (
                <div style={{
                  padding: 'var(--space-2) var(--space-4)',
                  background: 'var(--gradient-ocean)',
                  color: 'white',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600'
                }}>{product.brand}</div>
              )}
              <div style={{
                padding: 'var(--space-2) var(--space-4)',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-sm)'
              }}>
                <Package size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {product.category}
              </div>
            </div>
            {lowestPrice && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.15) 100%)',
                border: '2px solid var(--primary)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)',
                marginBottom: 'var(--space-6)'
              }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                  Best Price Available
                </p>
                <div style={{
                  fontSize: 'var(--text-6xl)',
                  fontWeight: 'bold',
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: '1'
                }}>
                  ${parseFloat(lowestPrice.price).toFixed(2)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                  <Store size={16} color="var(--text-secondary)" />
                  <span style={{ color: 'var(--text-secondary)' }}>at {lowestPrice.store_name}</span>
                </div>
              </div>
            )}
            {savings > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.15) 100%)',
                border: '2px dashed var(--warning)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
                marginBottom: 'var(--space-6)'
              }}>
                <Sparkles size={20} color="var(--warning)" style={{ display: 'inline', marginRight: '8px' }} />
                <span style={{ fontWeight: 'bold', color: 'var(--warning)' }}>Save up to ${savings}</span>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
                  compared to highest price • {prices.length} stores
                </p>
              </div>
            )}
            {product.description && (
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>
                  Description
                </h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{product.description}</p>
              </div>
            )}
            {product.dietary_tags && product.dietary_tags.length > 0 && (
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)', textTransform: 'uppercase' }}>
                  🌱 Dietary
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  {product.dietary_tags.map(tag => (
                    <span key={tag} style={{
                      padding: 'var(--space-2) var(--space-4)',
                      background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.1) 0%, rgba(5, 150, 105, 0.15) 100%)',
                      color: 'var(--primary)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-sm)',
                      border: '1px solid rgba(22, 163, 74, 0.3)'
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            )}
            <button onClick={handleAddToList} className="btn btn-primary" style={{ width: '100%', height: '3.5rem', fontSize: 'var(--text-lg)', background: 'var(--gradient-primary)' }}>
              <Plus size={24} />
              Add to Shopping List
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="card animate-fadeInUp" style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)', borderBottom: '2px solid var(--border)', marginBottom: 'var(--space-6)', overflowX: 'auto' }}>
            {[{ id: 'overview', label: 'Overview', icon: Info }, { id: 'prices', label: 'Prices', icon: BarChart3 }, { id: 'history', label: 'History', icon: TrendingDown }].map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  padding: 'var(--space-4) var(--space-6)',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  position: 'relative',
                  color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  whiteSpace: 'nowrap'
                }}>
                  <Icon size={18} style={{ display: 'inline', marginRight: '8px' }} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div style={{ position: 'absolute', bottom: '-2px', left: 0, right: 0, height: '2px', background: 'var(--gradient-primary)' }} />
                  )}
                </button>
              );
            })}
          </div>
          {activeTab === 'overview' && (
            <div className="animate-fadeIn">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.15) 100%)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '2px solid rgba(16, 185, 129, 0.3)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Stores</p>
                  <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--primary)' }}>{prices.length}</p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.15) 100%)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '2px solid rgba(245, 158, 11, 0.3)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Savings</p>
                  <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--warning)' }}>${savings}</p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'prices' && (
            <div className="animate-fadeIn">
              {prices.map((sp, index) => (
                <div key={sp.store_id} onClick={() => handleStoreSelect(sp)} className="hover-lift" style={{
                  padding: 'var(--space-5)',
                  border: `2px solid ${selectedStore?.store_id === sp.store_id ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-xl)',
                  marginBottom: 'var(--space-4)',
                  cursor: 'pointer',
                  background: selectedStore?.store_id === sp.store_id ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-secondary)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ marginBottom: 'var(--space-2)' }}>{sp.store_name}</h3>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                        <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        {sp.address}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
                        ${parseFloat(sp.price).toFixed(2)}
                      </div>
                      {index === 0 && (
                        <span style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--gradient-primary)', color: 'white', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>
                          BEST
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'history' && priceHistory.length > 0 && (
            <div className="animate-fadeIn">
              <h3 style={{ marginBottom: 'var(--space-4)' }}>at {selectedStore?.store_name}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} />
                  <Line type="monotone" dataKey="price" stroke="var(--primary)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="animate-fadeInUp" style={{ marginBottom: 'var(--space-8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-sunset)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={24} color="white" />
              </div>
              <h2 style={{ fontSize: 'var(--text-3xl)' }}>You May Also Like</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
              {similarProducts.map((p, i) => (
                <div key={p.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                  <ProductCard product={p} onClick={() => navigate(`/product/${p.id}`)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add to List Modal */}
      {showAddToList && (
        <div onClick={() => setShowAddToList(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card animate-fadeIn" style={{ width: '100%', maxWidth: '400px', margin: 'var(--space-4)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h3>Add to Shopping List</h3>
              <button onClick={() => setShowAddToList(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 'var(--space-2)' }}>
                <X size={24} />
              </button>
            </div>
            {lists.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {lists.map(list => (
                  <button key={list.id} onClick={() => addToList(list.id)} className="btn btn-secondary hover-lift" style={{ justifyContent: 'flex-start' }}>
                    <ShoppingCart size={20} />
                    {list.name}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>No lists yet</p>
                <button onClick={() => navigate('/lists')} className="btn btn-primary">Create a List</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Lightbox */}
      {showImageLightbox && (
        <div onClick={() => setShowImageLightbox(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 'var(--space-4)' }}>
          <button onClick={() => setShowImageLightbox(false)} style={{ position: 'absolute', top: 'var(--space-6)', right: 'var(--space-6)', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', border: 'none', color: 'white', borderRadius: 'var(--radius-full)', padding: 'var(--space-3)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
          <img src={product.image_url || 'https://via.placeholder.com/800x600'} alt={product.name} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
