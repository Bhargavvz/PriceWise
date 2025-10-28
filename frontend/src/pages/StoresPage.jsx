import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Phone, Clock } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { storeService } from '../services';
import { useToast } from '../contexts/ToastContext';
import 'leaflet/dist/leaflet.css';

const StoresPage = () => {
  const toast = useToast();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    getUserLocation();
    loadStores();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          setUserLocation({ lat: 40.7128, lng: -74.0060 }); // Default to NYC
        }
      );
    } else {
      setUserLocation({ lat: 40.7128, lng: -74.0060 });
    }
  };

  const loadStores = async () => {
    try {
      setLoading(true);
      const response = await storeService.getStores(100);
      if (response.success) {
        setStores(response.data);
      }
    } catch (error) {
      console.error('Error loading stores:', error);
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !userLocation) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div>
      {/* Map */}
      <div style={{ height: '400px', width: '100%' }}>
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {stores.map(store => (
            <Marker
              key={store.id}
              position={[parseFloat(store.latitude), parseFloat(store.longitude)]}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>{store.name}</h4>
                  {store.chain_name && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {store.chain_name}
                    </p>
                  )}
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    {store.address}
                  </p>
                  {store.phone && (
                    <p style={{ fontSize: '0.875rem' }}>
                      {store.phone}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Store List */}
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>All Stores</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {stores.map(store => (
            <div key={store.id} className="card">
              <h3 style={{ marginBottom: '0.5rem' }}>{store.name}</h3>
              {store.chain_name && (
                <div style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  {store.chain_name}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <MapPin size={16} color="var(--text-secondary)" style={{ marginTop: '0.25rem' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {store.address}
                  </p>
                  {store.city && store.state && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {store.city}, {store.state} {store.zip_code}
                    </p>
                  )}
                </div>
              </div>
              {store.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Phone size={16} color="var(--text-secondary)" />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {store.phone}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoresPage;
