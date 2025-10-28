import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, MapPin, ShoppingCart, DollarSign, Clock } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { priceService, analyticsService } from '../services';
import { useToast } from '../contexts/ToastContext';

const HomePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [saleItems, setSaleItems] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [salesRes, popularRes] = await Promise.all([
        priceService.getSaleItems(null, 8),
        analyticsService.getPopularProducts(40.7128, -74.0060, 8)
      ]);

      if (salesRes.success) {
        setSaleItems(salesRes.data);
      }
      if (popularRes.success) {
        setPopularProducts(popularRes.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load featured items');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        color: 'white',
        padding: '4rem 0',
        marginBottom: '3rem'
      }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              color: 'white'
            }}>
              Compare Grocery Prices, Save Money
            </h1>
            <p style={{
              fontSize: '1.25rem',
              marginBottom: '2rem',
              opacity: 0.9
            }}>
              Find the best prices on groceries across multiple stores in your area
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{
              display: 'flex',
              gap: '0.5rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{
                flex: 1,
                position: 'relative'
              }}>
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
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input"
                  style={{
                    paddingLeft: '3rem',
                    height: '3.5rem',
                    fontSize: '1.125rem'
                  }}
                />
              </div>
              <button type="submit" className="btn btn-secondary" style={{
                height: '3.5rem',
                padding: '0 2rem',
                fontSize: '1.125rem',
                fontWeight: 'bold'
              }}>
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div className="grid md:grid-cols-3" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              margin: '0 auto 1rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(22, 163, 74, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={32} color="var(--primary)" />
            </div>
            <h3 style={{ marginBottom: '0.75rem' }}>Best Prices</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Compare prices across multiple stores to find the best deals
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              margin: '0 auto 1rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(22, 163, 74, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MapPin size={32} color="var(--primary)" />
            </div>
            <h3 style={{ marginBottom: '0.75rem' }}>Nearby Stores</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Find stores near you with the products you need
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              margin: '0 auto 1rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(22, 163, 74, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={32} color="var(--primary)" />
            </div>
            <h3 style={{ marginBottom: '0.75rem' }}>Price Tracking</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Track price history and get alerts when prices drop
            </p>
          </div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <TrendingUp size={32} color="var(--primary)" />
            Featured Deals
          </h2>
          <button
            onClick={() => navigate('/deals')}
            className="btn btn-outline"
          >
            View All Deals
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : saleItems.length > 0 ? (
          <div className="grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {saleItems.map(item => (
              <ProductCard
                key={item.id}
                product={{
                  id: item.product_id,
                  name: item.product_name,
                  category: item.category,
                  brand: item.brand,
                  image_url: item.image_url,
                  current_prices: [{
                    price: item.price,
                    unit_price: item.unit_price,
                    on_sale: item.on_sale,
                    store_name: item.store_name
                  }]
                }}
                onClick={() => navigate(`/product/${item.product_id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No deals available at the moment</p>
          </div>
        )}
      </section>

      {/* Popular Products */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <ShoppingCart size={32} color="var(--primary)" />
            Popular Products
          </h2>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : popularProducts.length > 0 ? (
          <div className="grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {popularProducts.map(product => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  current_prices: [{
                    price: product.min_price || product.avg_price,
                    store_name: `${product.available_stores} stores`
                  }]
                }}
                onClick={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No products available</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
