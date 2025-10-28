import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, X, Grid, List, ChevronDown, SlidersHorizontal, Package, TrendingUp, ArrowUpDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { productService } from '../services';
import { useToast } from '../contexts/ToastContext';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true); // Default to true for desktop
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('relevance');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    dietary: searchParams.get('dietary') || ''
  });

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      searchProducts();
    }
  }, [searchParams]);

  const loadFilterOptions = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        productService.getCategories(),
        productService.getBrands()
      ]);

      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (brandsRes.success) setBrands(brandsRes.data);
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };

  const searchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        q: searchParams.get('q'),
        category: searchParams.get('category'),
        brand: searchParams.get('brand'),
        dietary: searchParams.get('dietary')
      };

      const response = await productService.search(params);
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (filters.category) params.set('category', filters.category);
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.dietary) params.set('dietary', filters.dietary);
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.brand) params.set('brand', newFilters.brand);
    if (newFilters.dietary) params.set('dietary', newFilters.dietary);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ category: '', brand: '', dietary: '' });
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    setSearchParams(params);
  };

  const hasActiveFilters = filters.category || filters.brand || filters.dietary;

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--bg-primary)'
    }}>
      {/* Enhanced Search Header */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        padding: 'var(--space-12) 0 var(--space-16)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Pattern Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'fadeIn 1s ease-out'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="animate-fadeInUp" style={{
            display: 'flex',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-6)',
            flexWrap: 'wrap'
          }}>
            <div style={{ 
              flex: '1 1 300px',
              position: 'relative'
            }}>
              <Search
                size={24}
                style={{
                  position: 'absolute',
                  left: 'var(--space-4)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                  zIndex: 1
                }}
              />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
                style={{ 
                  paddingLeft: 'var(--space-12)',
                  height: '3.5rem',
                  fontSize: 'var(--text-lg)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: 'none',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{
              height: '3.5rem',
              padding: '0 var(--space-8)',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)'
            }}>
              <Search size={20} />
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary"
              style={{
                height: '3.5rem',
                padding: '0 var(--space-6)',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white'
              }}
            >
              <SlidersHorizontal size={20} />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </form>

          {/* Active Filters Chips */}
          {hasActiveFilters && (
            <div className="animate-fadeInUp" style={{
              display: 'flex',
              gap: 'var(--space-2)',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <span style={{ 
                color: 'white',
                fontSize: 'var(--text-sm)',
                opacity: 0.9
              }}>
                Active Filters:
              </span>
              {filters.category && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  color: 'white',
                  fontSize: 'var(--text-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <span>Category: {filters.category}</span>
                  <X
                    size={14}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleFilterChange('category', '')}
                  />
                </div>
              )}
              {filters.brand && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  color: 'white',
                  fontSize: 'var(--text-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <span>Brand: {filters.brand}</span>
                  <X
                    size={14}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleFilterChange('brand', '')}
                  />
                </div>
              )}
              {filters.dietary && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  color: 'white',
                  fontSize: 'var(--text-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <span>Dietary: {filters.dietary}</span>
                  <X
                    size={14}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleFilterChange('dietary', '')}
                  />
                </div>
              )}
              <button
                onClick={clearFilters}
                style={{
                  background: 'rgba(239, 68, 68, 0.3)',
                  backdropFilter: 'blur(10px)',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  color: 'white',
                  fontSize: 'var(--text-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer'
                }}
              >
                <X size={14} />
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ 
        padding: 'var(--space-8) var(--space-4)',
        display: 'flex',
        gap: 'var(--space-6)',
        alignItems: 'flex-start'
      }}>
        {/* Sticky Sidebar Filters */}
        {showFilters && (
          <aside className="card animate-fadeInLeft" style={{
            width: '300px',
            flexShrink: 0,
            position: 'sticky',
            top: 'var(--space-6)',
            maxHeight: 'calc(100vh - var(--space-12))',
            overflowY: 'auto',
            padding: 'var(--space-6)'
          }}>
            {/* Filter Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-6)',
              paddingBottom: 'var(--space-4)',
              borderBottom: '2px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Filter size={18} color="white" />
                </div>
                <h3 style={{ fontSize: 'var(--text-xl)', margin: 0 }}>Filters</h3>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="btn btn-sm" style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--danger)',
                  padding: 'var(--space-2) var(--space-3)'
                }}>
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-3)',
                fontWeight: '600',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)'
              }}>
                <Package size={16} color="var(--primary)" />
                CATEGORY
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid var(--border)',
                  fontSize: 'var(--text-sm)'
                }}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-3)',
                fontWeight: '600',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)'
              }}>
                <TrendingUp size={16} color="var(--primary)" />
                BRAND
              </label>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="input"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid var(--border)',
                  fontSize: 'var(--text-sm)'
                }}
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Dietary Filter */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-3)',
                fontWeight: '600',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)'
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'var(--gradient-success)'
                }} />
                DIETARY PREFERENCES
              </label>
              <select
                value={filters.dietary}
                onChange={(e) => handleFilterChange('dietary', e.target.value)}
                className="input"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid var(--border)',
                  fontSize: 'var(--text-sm)'
                }}
              >
                <option value="">All Products</option>
                <option value="organic">🌱 Organic</option>
                <option value="vegan">🥬 Vegan</option>
                <option value="vegetarian">🥗 Vegetarian</option>
                <option value="gluten-free">🌾 Gluten Free</option>
              </select>
            </div>

            {/* Price Range (Future Enhancement) */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-3)',
                fontWeight: '600',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)'
              }}>
                💰 PRICE RANGE
              </label>
              <div style={{
                background: 'var(--bg-secondary)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-sm)'
              }}>
                ${priceRange[0]} - ${priceRange[1]}
              </div>
            </div>
          </aside>
        )}

        {/* Results Section */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Results Header with View Toggle & Sort */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-6)',
            flexWrap: 'wrap',
            gap: 'var(--space-4)'
          }}>
            <div>
              <h2 style={{ 
                fontSize: 'var(--text-3xl)',
                marginBottom: 'var(--space-2)',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {searchQuery ? `"${searchQuery}"` : 'All Products'}
              </h2>
              <p style={{ 
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-sm)'
              }}>
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
              {/* View Mode Toggle */}
              <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-1)',
                display: 'flex',
                gap: 'var(--space-1)'
              }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: 'var(--space-2) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    background: viewMode === 'grid' ? 'var(--gradient-primary)' : 'transparent',
                    color: viewMode === 'grid' ? 'white' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    transition: 'all var(--transition-base)',
                    fontWeight: '500'
                  }}
                >
                  <Grid size={18} />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: 'var(--space-2) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    background: viewMode === 'list' ? 'var(--gradient-primary)' : 'transparent',
                    color: viewMode === 'list' ? 'white' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    transition: 'all var(--transition-base)',
                    fontWeight: '500'
                  }}
                >
                  <List size={18} />
                  List
                </button>
              </div>

              {/* Sort Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="btn btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}
                >
                  <ArrowUpDown size={18} />
                  Sort: {sortBy === 'relevance' ? 'Relevance' : sortBy === 'price-low' ? 'Price: Low to High' : sortBy === 'price-high' ? 'Price: High to Low' : 'Name'}
                  <ChevronDown size={16} />
                </button>

                {showSortDropdown && (
                  <div className="card animate-fadeIn" style={{
                    position: 'absolute',
                    top: 'calc(100% + var(--space-2))',
                    right: 0,
                    minWidth: '200px',
                    padding: 'var(--space-2)',
                    zIndex: 10,
                    boxShadow: 'var(--shadow-xl)'
                  }}>
                    {['relevance', 'price-low', 'price-high', 'name'].map(option => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: 'var(--space-3) var(--space-4)',
                          borderRadius: 'var(--radius-md)',
                          background: sortBy === option ? 'var(--bg-hover)' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: sortBy === option ? 'var(--primary)' : 'var(--text-primary)',
                          fontWeight: sortBy === option ? '600' : '400',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        {option === 'relevance' ? 'Relevance' : 
                         option === 'price-low' ? 'Price: Low to High' : 
                         option === 'price-high' ? 'Price: High to Low' : 'Name (A-Z)'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr',
              gap: 'var(--space-6)'
            }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card">
                  <div className="skeleton" style={{ height: '220px', marginBottom: 'var(--space-4)' }} />
                  <div className="skeleton skeleton-title" />
                  <div className="skeleton skeleton-text" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr',
              gap: 'var(--space-6)'
            }}>
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fadeInUp"
                  style={{
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  <ProductCard
                    product={product}
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="card animate-fadeIn" style={{
              textAlign: 'center',
              padding: 'var(--space-16)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.1) 100%)',
              border: '2px dashed var(--border)'
            }}>
              <Package size={64} color="var(--text-tertiary)" style={{ margin: '0 auto var(--space-4)' }} />
              <h3 style={{ 
                fontSize: 'var(--text-2xl)',
                marginBottom: 'var(--space-2)'
              }}>
                No Products Found
              </h3>
              <p style={{ 
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-6)',
                maxWidth: '400px',
                margin: '0 auto var(--space-6)'
              }}>
                We couldn't find any products matching your search criteria.
                Try adjusting your filters or search terms.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="btn btn-primary">
                    Clear Filters
                  </button>
                )}
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    clearFilters();
                  }}
                  className="btn btn-secondary"
                >
                  Browse All Products
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
