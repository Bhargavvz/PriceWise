import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, MapPin, ShoppingCart, DollarSign, Clock, Sparkles, Zap, Target, ArrowRight } from 'lucide-react';
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
    <div style={{ overflow: 'hidden' }}>
      {/* Hero Section - Redesigned with Gradient & Animation */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '6rem 0 8rem',
        marginBottom: '4rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'fadeIn 1s ease-out'
        }} />

        {/* Floating Shapes */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '100px',
          height: '100px',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: '150px',
          height: '150px',
          borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          animation: 'float 8s ease-in-out infinite'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            {/* Badge */}
            <div className="animate-fadeInDown" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-4)',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-full)',
              marginBottom: 'var(--space-6)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <Sparkles size={16} />
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>
                Smart Price Comparison
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="animate-fadeInUp" style={{
              fontSize: 'var(--text-6xl)',
              fontWeight: 'var(--font-extrabold)',
              marginBottom: 'var(--space-6)',
              color: 'white',
              lineHeight: 'var(--leading-tight)',
              letterSpacing: '-0.02em'
            }}>
              Save Money on Every
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Grocery Purchase
              </span>
            </h1>

            <p className="animate-fadeInUp" style={{
              fontSize: 'var(--text-xl)',
              marginBottom: 'var(--space-8)',
              opacity: 0.95,
              lineHeight: 'var(--leading-relaxed)',
              maxWidth: '700px',
              margin: '0 auto var(--space-8)'
            }}>
              Compare prices across multiple stores instantly and find the best deals
              on groceries in your area. Save time and money with smart shopping.
            </p>

            {/* Enhanced Search Bar with Glass-morphism */}
            <form onSubmit={handleSearch} className="animate-fadeInUp" style={{
              display: 'flex',
              gap: 'var(--space-3)',
              maxWidth: '700px',
              margin: '0 auto var(--space-8)',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <div style={{
                flex: '1 1 400px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 'var(--radius-2xl)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                }} />
                <Search
                  size={24}
                  style={{
                    position: 'absolute',
                    left: 'var(--space-6)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-tertiary)',
                    zIndex: 2
                  }}
                />
                <input
                  type="text"
                  placeholder="Search products, brands, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    height: '4rem',
                    paddingLeft: 'var(--space-16)',
                    paddingRight: 'var(--space-6)',
                    fontSize: 'var(--text-lg)',
                    border: 'none',
                    borderRadius: 'var(--radius-2xl)',
                    background: 'transparent',
                    position: 'relative',
                    zIndex: 1,
                    outline: 'none',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn"
                style={{
                  height: '4rem',
                  padding: '0 var(--space-8)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-bold)',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  boxShadow: '0 12px 24px rgba(245, 158, 11, 0.4)',
                  borderRadius: 'var(--radius-2xl)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}
              >
                Search
                <ArrowRight size={20} />
              </button>
            </form>

            {/* Stats */}
            <div className="animate-fadeInUp" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 'var(--space-6)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              {[
                { number: '10K+', label: 'Products' },
                { number: '50+', label: 'Stores' },
                { number: '$500', label: 'Avg. Savings' }
              ].map((stat, i) => (
                <div key={i} style={{
                  textAlign: 'center',
                  padding: 'var(--space-4)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{
                    fontSize: 'var(--text-3xl)',
                    fontWeight: 'var(--font-extrabold)',
                    marginBottom: 'var(--space-1)'
                  }}>
                    {stat.number}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    opacity: 0.9
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Cards with Icons */}
      <section className="container" style={{ marginBottom: 'var(--space-20)' }}>
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--space-12)'
        }}>
          <h2 className="animate-fadeInUp" style={{
            fontSize: 'var(--text-4xl)',
            fontWeight: 'var(--font-bold)',
            marginBottom: 'var(--space-4)'
          }}>
            Why Choose PriceWise?
          </h2>
          <p className="animate-fadeInUp" style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Everything you need to make smarter shopping decisions
          </p>
        </div>

        <div className="grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-8)'
        }}>
          {[
            {
              icon: DollarSign,
              title: 'Best Prices',
              description: 'Compare prices across multiple stores to find the best deals and save money on every purchase',
              gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#10b981'
            },
            {
              icon: MapPin,
              title: 'Nearby Stores',
              description: 'Find stores near you with the products you need using our smart location-based search',
              gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#3b82f6'
            },
            {
              icon: Zap,
              title: 'Smart Optimization',
              description: 'Get personalized recommendations for the best store combinations to minimize your total cost',
              gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#f59e0b'
            },
            {
              icon: Clock,
              title: 'Price Tracking',
              description: 'Track price history and get alerts when prices drop on your favorite products',
              gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: '#8b5cf6'
            },
            {
              icon: Target,
              title: 'Shopping Lists',
              description: 'Create and manage shopping lists with automatic price calculations and store recommendations',
              gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
              color: '#ec4899'
            },
            {
              icon: TrendingUp,
              title: 'Analytics Dashboard',
              description: 'View your savings statistics, shopping patterns, and get insights to save even more',
              gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              color: '#06b6d4'
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="card animate-fadeInUp hover-lift"
                style={{
                  textAlign: 'center',
                  padding: 'var(--space-8)',
                  borderRadius: 'var(--radius-2xl)',
                  position: 'relative',
                  overflow: 'hidden',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Gradient Background */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '6px',
                  background: feature.gradient
                }} />

                {/* Icon */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto var(--space-6)',
                  borderRadius: 'var(--radius-2xl)',
                  background: feature.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 24px ${feature.color}40`,
                  transition: 'transform var(--transition-base)'
                }}>
                  <Icon size={40} color="white" />
                </div>

                <h3 style={{
                  marginBottom: 'var(--space-3)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'var(--font-bold)'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 'var(--leading-relaxed)'
                }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Deals - Enhanced Section */}
      <section className="container" style={{ marginBottom: 'var(--space-20)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-8)',
          flexWrap: 'wrap',
          gap: 'var(--space-4)'
        }}>
          <div>
            <h2 style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-bold)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-2)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(245, 87, 108, 0.3)'
              }}>
                <TrendingUp size={28} color="white" />
              </div>
              Featured Deals
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
              Don't miss out on these amazing savings
            </p>
          </div>
          <button
            onClick={() => navigate('/deals')}
            className="btn btn-outline"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}
          >
            View All Deals
            <ArrowRight size={18} />
          </button>
        </div>

        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-6)'
          }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card" style={{ padding: 'var(--space-6)' }}>
                <div className="skeleton" style={{ height: '220px', marginBottom: 'var(--space-4)' }} />
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-text" style={{ width: '60%' }} />
              </div>
            ))}
          </div>
        ) : saleItems.length > 0 ? (
          <div className="grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-6)'
          }}>
            {saleItems.map((item, index) => (
              <div
                key={item.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard
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
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{
            textAlign: 'center',
            padding: 'var(--space-16)',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.1) 100%)',
            border: '2px dashed var(--border)'
          }}>
            <TrendingUp size={64} color="var(--text-tertiary)" style={{ margin: '0 auto var(--space-4)' }} />
            <h3 style={{ marginBottom: 'var(--space-2)' }}>No Deals Available</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              Check back soon for amazing deals and special offers!
            </p>
            <button onClick={() => navigate('/search')} className="btn btn-primary">
              Browse Products
            </button>
          </div>
        )}
      </section>

      {/* Popular Products - Enhanced Section */}
      <section className="container" style={{ marginBottom: 'var(--space-20)', paddingBottom: 'var(--space-12)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-8)',
          flexWrap: 'wrap',
          gap: 'var(--space-4)'
        }}>
          <div>
            <h2 style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-bold)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-2)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(79, 172, 254, 0.3)'
              }}>
                <ShoppingCart size={28} color="white" />
              </div>
              Popular Products
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
              Most purchased items in your area
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-6)'
          }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card" style={{ padding: 'var(--space-6)' }}>
                <div className="skeleton" style={{ height: '220px', marginBottom: 'var(--space-4)' }} />
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-text" style={{ width: '60%' }} />
              </div>
            ))}
          </div>
        ) : popularProducts.length > 0 ? (
          <div className="grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-6)'
          }}>
            {popularProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard
                  product={{
                    ...product,
                    current_prices: [{
                      price: product.min_price || product.avg_price,
                      store_name: `${product.available_stores} stores`
                    }]
                  }}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{
            textAlign: 'center',
            padding: 'var(--space-16)',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.1) 100%)',
            border: '2px dashed var(--border)'
          }}>
            <ShoppingCart size={64} color="var(--text-tertiary)" style={{ margin: '0 auto var(--space-4)' }} />
            <h3 style={{ marginBottom: 'var(--space-2)' }}>No Products Available</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              Start exploring our catalog to discover amazing products
            </p>
            <button onClick={() => navigate('/search')} className="btn btn-primary">
              Explore Products
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
