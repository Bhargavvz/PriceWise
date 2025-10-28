import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ArrowLeft, MapPin, Phone, Clock, Tag, Navigation, Star } from 'lucide-react';
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
      <div className="container" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
        <h2>Store not found</h2>
        <button onClick={() => navigate('/stores')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Stores
        </button>
      </div>
    );
  }

  const hoursData = formatHours(store.hours);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div style={{ minHeight: 'calc(100vh - 4rem)' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        color: 'white',
        padding: '3rem 0 2rem',
        marginBottom: '2rem',
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
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <button
            onClick={() => navigate('/stores')}
            className="btn btn-secondary"
            style={{ 
              marginBottom: '1.5rem',
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white'
            }}
          >
            <ArrowLeft size={20} />
            Back to Stores
          </button>

          <div style={{ display: 'flex', alignItems: 'start', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'var(--primary)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}>
              {store.name.charAt(0)}
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '2.5rem' }}>
                {store.name}
              </h1>
              {store.chain_name && (
                <div style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  backdropFilter: 'blur(10px)'
                }}>
                  {store.chain_name}
                </div>
              )}
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={20} />
                  <span>{store.address}</span>
                </div>
                {store.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={20} />
                    <span>{store.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={getDirections}
              className="btn"
              style={{
                backgroundColor: 'white',
                color: 'var(--primary)',
                fontWeight: 'bold',
                padding: '0.875rem 2rem'
              }}
            >
              <Navigation size={20} />
              Get Directions
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '0 1rem 3rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Store Hours */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Clock size={24} />
              <h3 style={{ color: 'white', margin: 0 }}>Store Hours</h3>
            </div>
            
            {hoursData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {hoursData.map(({ day, hours }) => (
                  <div
                    key={day}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      backgroundColor: day === today ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                      borderRadius: 'var(--radius-md)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <span style={{ fontWeight: day === today ? 'bold' : '500' }}>{day}</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ opacity: 0.8 }}>Hours not available</p>
            )}
          </div>

          {/* Map */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', height: '400px' }}>
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
                  <div style={{ padding: '0.5rem' }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>{store.name}</h4>
                    <p style={{ fontSize: '0.875rem', margin: 0 }}>{store.address}</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* Current Deals */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <Tag size={32} color="var(--primary)" />
            <div>
              <h2 style={{ marginBottom: '0.25rem' }}>Current Deals</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                Save big with these special offers
              </p>
            </div>
          </div>

          {deals.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {deals.map(deal => (
                <ProductCard
                  key={deal.id}
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
              ))}
            </div>
          ) : (
            <div className="card" style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.05) 0%, rgba(22, 163, 74, 0.1) 100%)'
            }}>
              <Tag size={48} color="var(--text-tertiary)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>No Current Deals</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Check back soon for new sales and special offers!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreDetailPage;
