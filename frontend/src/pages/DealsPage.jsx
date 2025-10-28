import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Sparkles, Clock, TrendingDown, Filter, X, ArrowRight, Flame } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { priceService } from '../services';
import { useToast } from '../contexts/ToastContext';

const DealsPage = () => {
  const toast = useToast();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('discount');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'all',
    'Produce',
    'Dairy & Eggs',
    'Meat & Seafood',
    'Bakery',
    'Frozen Foods',
    'Snacks',
    'Beverages'
  ];

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const response = await priceService.getSaleItems(null, 50);
      if (response.success) {
        setDeals(response.data);
      }
    } catch (error) {
      console.error('Error loading deals:', error);
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const filteredDeals = deals.filter(deal => 
    selectedCategory === 'all' || deal.category === selectedCategory
  );

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    if (sortBy === 'discount') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    return 0;
  });

  // Calculate countdown for "deal ending soon" (mock)
  const getCountdown = () => {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
            <Flame size={16} />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>Hot Deals</span>
          </div>

          <h1 className="animate-fadeInUp" style={{
            fontSize: 'var(--text-6xl)',
            fontWeight: 'extrabold',
            color: 'white',
            marginBottom: 'var(--space-4)',
            letterSpacing: '-0.02em'
          }}>
            Current
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #fef3c7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Deals
            </span>
          </h1>

          <p className="animate-fadeInUp" style={{
            fontSize: 'var(--text-xl)',
            color: 'rgba(255, 255, 255, 0.95)',
            maxWidth: '600px',
            lineHeight: '1.6'
          }}>
            Save big with our latest deals and discounts
          </p>

          {/* Stats */}
          <div className="animate-fadeInUp" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-8)',
            animationDelay: '0.2s'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                fontSize: 'var(--text-4xl)',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: 'var(--space-2)',
                lineHeight: '1'
              }}>
                {deals.length}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255, 255, 255, 0.9)' }}>
                Active Deals
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                fontSize: 'var(--text-4xl)',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: 'var(--space-2)',
                lineHeight: '1'
              }}>
                Up to 50%
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255, 255, 255, 0.9)' }}>
                Max Savings
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
        {/* Filters */}
        <div className="card animate-fadeInUp" style={{
          marginBottom: 'var(--space-8)',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.1) 100%)',
          border: '2px solid rgba(245, 158, 11, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-4)',
            flexWrap: 'wrap',
            gap: 'var(--space-4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Filter size={24} color="white" />
              </div>
              <h3 style={{ fontSize: 'var(--text-2xl)', margin: 0 }}>Filters & Sort</h3>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input"
                style={{
                  minWidth: '200px',
                  height: '3rem',
                  fontSize: 'var(--text-base)'
                }}
              >
                <option value="discount">Biggest Discount</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-2)',
            flexWrap: 'wrap'
          }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: selectedCategory === cat
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : 'var(--bg-secondary)',
                  color: selectedCategory === cat ? 'white' : 'var(--text-primary)',
                  fontWeight: selectedCategory === cat ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  fontSize: 'var(--text-sm)',
                  boxShadow: selectedCategory === cat ? '0 4px 12px rgba(245, 158, 11, 0.3)' : 'none'
                }}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          {selectedCategory !== 'all' && (
            <div style={{ marginTop: 'var(--space-4)' }}>
              <button
                onClick={() => setSelectedCategory('all')}
                className="btn btn-secondary"
                style={{ fontSize: 'var(--text-sm)' }}
              >
                <X size={16} />
                Clear Filter
              </button>
            </div>
          )}
        </div>

        {/* Deals Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : sortedDeals.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-6)'
          }}>
            {sortedDeals.map((deal, index) => (
              <div
                key={deal.id}
                className="animate-fadeInUp hover-lift"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  position: 'relative'
                }}
              >
                {/* Discount Badge */}
                <div style={{
                  position: 'absolute',
                  top: 'var(--space-4)',
                  right: 'var(--space-4)',
                  zIndex: 10,
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 'bold',
                  fontSize: 'var(--text-sm)',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                  animation: 'pulse 2s infinite'
                }}>
                  <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  SALE
                </div>

                {/* Countdown Badge */}
                {index < 5 && (
                  <div style={{
                    position: 'absolute',
                    top: 'var(--space-4)',
                    left: 'var(--space-4)',
                    zIndex: 10,
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    padding: 'var(--space-2) var(--space-3)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-1)'
                  }}>
                    <Clock size={12} />
                    Ends in {getCountdown()}
                  </div>
                )}

                <Link to={`/product/${deal.product_id}`} style={{ textDecoration: 'none' }}>
                  <ProductCard
                    product={{
                      id: deal.product_id,
                      name: deal.product_name,
                      category: deal.category,
                      brand: deal.brand,
                      image_url: deal.image_url,
                      current_prices: [{
                        price: deal.price,
                        unit_price: deal.unit_price,
                        on_sale: deal.on_sale,
                        store_name: deal.store_name
                      }]
                    }}
                  />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="card animate-fadeInUp" style={{
            textAlign: 'center',
            padding: 'var(--space-16)',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.1) 100%)',
            border: '2px dashed var(--border)'
          }}>
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.15) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-6)'
            }}>
              <Tag size={48} color="#f59e0b" />
            </div>
            <h3 style={{
              fontSize: 'var(--text-2xl)',
              marginBottom: 'var(--space-3)'
            }}>
              No deals available
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-6)'
            }}>
              Check back later for new deals!
            </p>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="btn btn-primary hover-lift"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                }}
              >
                <ArrowRight size={20} />
                View All Deals
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsPage;
