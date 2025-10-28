import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  ArrowLeft, MapPin, Phone, Clock, Tag, Navigation, Star,
  Store as StoreIcon, TrendingUp, Package, Sparkles, Calendar
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import { storeService, priceService } from '../services';
import { useToast } from '../contexts/ToastContext';

const StoreDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [store, setStore] = useState(null);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoreData();
  }, [id]);

  const loadStoreData = async () => {
    try {
      setLoading(true);
      const [storeRes, dealsRes] = await Promise.all([
        storeService.getStore(id),
        priceService.getSaleItems(id, 12)
      ]);

      if (storeRes.success) {
        setStore(storeRes.data);
      }

      if (dealsRes.success) {
        setDeals(dealsRes.data);
      }
    } catch (error) {
      console.error('Error loading store:', error);
      toast.error('Failed to load store details');
      navigate('/stores');
    } finally {
      setLoading(false);
    }
  };

  const getDirections = () => {
    if (store) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`;
      window.open(url, '_blank');
    }
  };

  const formatHours = (hours) => {
    if (!hours) return null;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.map(day => ({
      day: day.charAt(0).toUpperCase() + day.slice(1),
      hours: hours[day] || 'Closed'
    }));
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!store) {
    return (
      <div className="container" style={{ 
        padding: 'var(--space-16) var(--space-4)', 
        textAlign: 'center' 
      }}>
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
          <StoreIcon size={48} color="white" />
        </div>
        <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-3)' }}>
          Store not found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
          The store you're looking for doesn't exist or has been removed.
        </p>
        <button 
          onClick={() => navigate('/stores')} 
          className="btn btn-primary"
        >
          <ArrowLeft size={20} />
          Back to Stores
        </button>
      </div>
    );
  }

  const hoursData = formatHours(store.hours);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Header with Blue Gradient */}
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
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
            onClick={() => navigate('/stores')}
            className="btn"
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
            Back to Stores
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: 'var(--space-6)', 
            flexWrap: 'wrap' 
          }}>
            {/* Store Logo */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: 'var(--radius-2xl)',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--text-5xl)',
              fontWeight: 'extrabold',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
              animation: 'fadeInUp 0.6s ease-out 0.1s backwards'
            }}>
              {store.name.charAt(0)}
            </div>

            {/* Store Info */}
            <div style={{ flex: 1, minWidth: '300px', animation: 'fadeInUp 0.6s ease-out 0.2s backwards' }}>
              <h1 style={{ 
                color: 'white', 
                marginBottom: 'var(--space-3)', 
                fontSize: 'var(--text-5xl)',
                fontWeight: 'extrabold',
                letterSpacing: '-0.02em'
              }}>
                {store.name}
              </h1>
              
              {/* Chain Badge */}
              {store.chain_name && (
                <div style={{
                  display: 'inline-block',
                  padding: 'var(--space-2) var(--space-4)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: 'var(--space-4)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: 'var(--text-sm)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  <StoreIcon size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  {store.chain_name}
                </div>
              )}
              
              {/* Contact Info */}
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 'var(--space-4)', 
                marginTop: 'var(--space-4)' 
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <MapPin size={20} color="white" />
                  <span style={{ color: 'white', fontSize: 'var(--text-base)' }}>
                    {store.address}
                  </span>
                </div>
                
                {store.phone && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <Phone size={20} color="white" />
                    <span style={{ color: 'white', fontSize: 'var(--text-base)' }}>
                      {store.phone}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Get Directions Button */}
            <button
              onClick={getDirections}
              className="btn hover-lift"
              style={{
                backgroundColor: 'white',
                color: '#3b82f6',
                fontWeight: 'bold',
                padding: 'var(--space-4) var(--space-6)',
                fontSize: 'var(--text-lg)',
                height: '3.5rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                animation: 'fadeInUp 0.6s ease-out 0.3s backwards'
              }}
            >
              <Navigation size={24} />
              Get Directions
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ padding: '0 var(--space-4) var(--space-12)' }}>
        {/* Info Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)',
          marginTop: '-3rem',
          marginBottom: 'var(--space-8)',
          position: 'relative',
          zIndex: 10
        }}>
          {/* Store Hours Card */}
          <div className="card hover-lift" style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
            color: 'white',
            border: 'none',
            animation: 'fadeInUp 0.6s ease-out 0.4s backwards'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-xl)',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              marginBottom: 'var(--space-4)'
            }}>
              <Clock size={28} color="white" />
            </div>
            
            <h3 style={{ 
              color: 'white', 
              marginBottom: 'var(--space-4)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 'bold'
            }}>
              Store Hours
            </h3>
            
            {hoursData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {hoursData.map(({ day, hours }) => (
                  <div
                    key={day}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 'var(--space-3)',
                      backgroundColor: day === today 
                        ? 'rgba(255, 255, 255, 0.25)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 'var(--radius-lg)',
                      backdropFilter: 'blur(10px)',
                      border: day === today 
                        ? '2px solid rgba(255, 255, 255, 0.4)' 
                        : '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <span style={{ 
                      fontWeight: day === today ? 'bold' : '600',
                      fontSize: day === today ? 'var(--text-base)' : 'var(--text-sm)'
                    }}>
                      {day === today && '📍 '}
                      {day}
                    </span>
                    <span style={{ 
                      fontWeight: day === today ? 'bold' : '500',
                      fontSize: day === today ? 'var(--text-base)' : 'var(--text-sm)'
                    }}>
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ 
                opacity: 0.8, 
                padding: 'var(--space-4)',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center'
              }}>
                Hours not available
              </p>
            )}
          </div>

          {/* Map Card */}
          <div className="card hover-lift" style={{ 
            padding: 0, 
            overflow: 'hidden', 
            height: '500px',
            animation: 'fadeInUp 0.6s ease-out 0.5s backwards'
          }}>
            <MapContainer
              center={[parseFloat(store.latitude), parseFloat(store.longitude)]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[parseFloat(store.latitude), parseFloat(store.longitude)]}>
                <Popup>
                  <div style={{ padding: 'var(--space-2)' }}>
                    <h4 style={{ 
                      marginBottom: 'var(--space-2)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: 'bold'
                    }}>
                      {store.name}
                    </h4>
                    <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                      {store.address}
                    </p>
                    <button
                      onClick={getDirections}
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                    >
                      <Navigation size={16} />
                      Get Directions
                    </button>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* Current Deals Section */}
        <div style={{ animation: 'fadeInUp 0.6s ease-out 0.6s backwards' }}>
          {/* Section Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-6)'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
            }}>
              <Tag size={28} color="white" />
            </div>
            <div>
              <h2 style={{ 
                marginBottom: 'var(--space-1)',
                fontSize: 'var(--text-3xl)',
                fontWeight: 'extrabold'
              }}>
                Current Deals
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)' }}>
                {deals.length > 0 
                  ? `${deals.length} special ${deals.length === 1 ? 'offer' : 'offers'} available now`
                  : 'Save big with special offers'}
              </p>
            </div>
          </div>

          {/* Deals Grid */}
          {deals.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--space-6)'
            }}>
              {deals.map((deal, index) => (
                <div 
                  key={deal.id}
                  style={{
                    position: 'relative',
                    animation: `fadeInUp 0.6s ease-out ${0.05 * index}s backwards`
                  }}
                >
                  {/* Sale Badge */}
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
                        store_name: store.name
                      }]
                    }}
                    onClick={() => navigate(`/product/${deal.product_id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="card" style={{
              textAlign: 'center',
              padding: 'var(--space-16) var(--space-8)',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.1) 100%)',
              border: '2px solid rgba(245, 158, 11, 0.2)'
            }}>
              <div style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-6)',
                boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)'
              }}>
                <Tag size={48} color="white" />
              </div>
              <h3 style={{ 
                marginBottom: 'var(--space-3)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'bold'
              }}>
                No Current Deals
              </h3>
              <p style={{ 
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-6)',
                fontSize: 'var(--text-lg)',
                maxWidth: '400px',
                margin: '0 auto var(--space-6)'
              }}>
                Check back soon for new sales and special offers at {store.name}!
              </p>
              <button
                onClick={() => navigate('/deals')}
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white'
                }}
              >
                <Sparkles size={20} />
                Browse All Deals
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreDetailPage;
