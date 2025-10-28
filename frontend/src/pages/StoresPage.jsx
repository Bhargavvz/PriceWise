import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  MapPin, Phone, Clock, Navigation, Store as StoreIcon, Search, 
  Filter, Layers, X, ArrowRight, Star, TrendingUp 
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { storeService } from '../services';
import { useToast } from '../contexts/ToastContext';
import 'leaflet/dist/leaflet.css';

const StoresPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  useEffect(() => {
    getUserLocation();
    loadStores();
  }, []);

  useEffect(() => {
    filterStores();
  }, [stores, searchQuery, selectedChain]);

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
        setFilteredStores(response.data);
      }
    } catch (error) {
      console.error('Error loading stores:', error);
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const filterStores = () => {
    let filtered = stores;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.chain_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Chain filter
    if (selectedChain !== 'all') {
      filtered = filtered.filter(store => store.chain_name === selectedChain);
    }

    setFilteredStores(filtered);
  };

  const getUniqueChains = () => {
    const chains = [...new Set(stores.map(s => s.chain_name).filter(Boolean))];
    return chains.sort();
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const getDirections = (store) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`;
    window.open(url, '_blank');
  };

  if (loading || !userLocation) {
    return <LoadingSpinner fullScreen />;
  }

  const chains = getUniqueChains();

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
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-4)',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-full)',
            marginBottom: 'var(--space-4)',
            animation: 'fadeInDown 0.6s ease-out'
          }}>
            <MapPin size={16} color="white" />
            <span style={{ color: 'white', fontSize: 'var(--text-sm)', fontWeight: '600' }}>
              Find Nearby Stores
            </span>
          </div>

          {/* Main Heading */}
          <h1 style={{
            fontSize: 'var(--text-6xl)',
            fontWeight: 'extrabold',
            color: 'white',
            marginBottom: 'var(--space-4)',
            letterSpacing: '-0.02em',
            animation: 'fadeInUp 0.6s ease-out 0.1s backwards'
          }}>
            Stores
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #fef3c7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Near You
            </span>
          </h1>

          <p style={{
            fontSize: 'var(--text-xl)',
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '600px',
            lineHeight: '1.6',
            animation: 'fadeInUp 0.6s ease-out 0.2s backwards'
          }}>
            Discover local grocery stores and compare prices in your area
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container" style={{ marginTop: 'var(--space-8)', marginBottom: 'var(--space-8)', position: 'relative', zIndex: 10 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)'
        }}>
          <div className="card hover-lift" style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%)',
            border: '2px solid rgba(59, 130, 246, 0.2)',
            textAlign: 'center',
            animation: 'fadeInUp 0.6s ease-out 0.3s backwards'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              marginBottom: 'var(--space-3)'
            }}>
              <StoreIcon size={24} color="white" />
            </div>
            <p style={{
              fontSize: 'var(--text-5xl)',
              fontWeight: 'extrabold',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 'var(--space-1)'
            }}>
              {stores.length}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: '500' }}>
              Total Stores
            </p>
          </div>

          <div className="card hover-lift" style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
            border: '2px solid rgba(16, 185, 129, 0.2)',
            textAlign: 'center',
            animation: 'fadeInUp 0.6s ease-out 0.4s backwards'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-primary)',
              marginBottom: 'var(--space-3)'
            }}>
              <Layers size={24} color="white" />
            </div>
            <p style={{
              fontSize: 'var(--text-5xl)',
              fontWeight: 'extrabold',
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 'var(--space-1)'
            }}>
              {chains.length}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: '500' }}>
              Store Chains
            </p>
          </div>

          <div className="card hover-lift" style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
            border: '2px solid rgba(245, 158, 11, 0.2)',
            textAlign: 'center',
            animation: 'fadeInUp 0.6s ease-out 0.5s backwards'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              marginBottom: 'var(--space-3)'
            }}>
              <Navigation size={24} color="white" />
            </div>
            <p style={{
              fontSize: 'var(--text-5xl)',
              fontWeight: 'extrabold',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 'var(--space-1)'
            }}>
              {filteredStores.length}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: '500' }}>
              Stores Found
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="container" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.1) 100%)',
          border: '2px solid rgba(59, 130, 246, 0.2)'
        }}>
          {/* Icon Header */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            marginBottom: 'var(--space-4)'
          }}>
            <Filter size={24} color="white" />
          </div>

          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', marginBottom: 'var(--space-6)' }}>
            Search & Filter Stores
          </h2>

          {/* Search Input */}
          <div style={{ position: 'relative', marginBottom: 'var(--space-6)' }}>
            <Search 
              size={20} 
              style={{
                position: 'absolute',
                left: 'var(--space-4)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)'
              }}
            />
            <input
              type="text"
              placeholder="Search by store name, chain, address, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{
                paddingLeft: 'var(--space-12)',
                height: '3.5rem',
                fontSize: 'var(--text-lg)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: 'var(--space-4)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-tertiary)',
                  padding: 'var(--space-2)'
                }}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Chain Filter Pills */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--space-3)', 
              fontWeight: '600',
              fontSize: 'var(--text-sm)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-secondary)'
            }}>
              Filter by Chain
            </label>
            <div style={{
              display: 'flex',
              gap: 'var(--space-2)',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setSelectedChain('all')}
                style={{
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: selectedChain === 'all'
                    ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                    : 'var(--bg-secondary)',
                  color: selectedChain === 'all' ? 'white' : 'var(--text-primary)',
                  fontWeight: selectedChain === 'all' ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  fontSize: 'var(--text-sm)',
                  boxShadow: selectedChain === 'all' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                }}
              >
                All Chains ({stores.length})
              </button>
              {chains.map(chain => (
                <button
                  key={chain}
                  onClick={() => setSelectedChain(chain)}
                  style={{
                    padding: 'var(--space-2) var(--space-4)',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: selectedChain === chain
                      ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                      : 'var(--bg-secondary)',
                    color: selectedChain === chain ? 'white' : 'var(--text-primary)',
                    fontWeight: selectedChain === chain ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    fontSize: 'var(--text-sm)',
                    boxShadow: selectedChain === chain ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                  }}
                >
                  {chain} ({stores.filter(s => s.chain_name === chain).length})
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filter */}
          {(searchQuery || selectedChain !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedChain('all');
              }}
              className="btn btn-secondary"
              style={{ marginTop: 'var(--space-4)' }}
            >
              <X size={20} />
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* View Toggle */}
      <div className="container" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button
            onClick={() => setViewMode('grid')}
            className="btn"
            style={{
              background: viewMode === 'grid' ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
              color: viewMode === 'grid' ? 'white' : 'var(--text-primary)'
            }}
          >
            <Layers size={20} />
            Grid View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className="btn"
            style={{
              background: viewMode === 'map' ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
              color: viewMode === 'map' ? 'white' : 'var(--text-primary)'
            }}
          >
            <MapPin size={20} />
            Map View
          </button>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="container" style={{ marginBottom: 'var(--space-8)' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden', height: '600px' }}>
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredStores.map(store => (
                <Marker
                  key={store.id}
                  position={[parseFloat(store.latitude), parseFloat(store.longitude)]}
                >
                  <Popup>
                    <div style={{ minWidth: '250px', padding: 'var(--space-2)' }}>
                      <h4 style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)' }}>
                        {store.name}
                      </h4>
                      {store.chain_name && (
                        <div style={{
                          display: 'inline-block',
                          padding: 'var(--space-1) var(--space-2)',
                          background: 'var(--gradient-primary)',
                          color: 'white',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          marginBottom: 'var(--space-2)'
                        }}>
                          {store.chain_name}
                        </div>
                      )}
                      <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                        {store.address}
                      </p>
                      {userLocation && (
                        <p style={{ 
                          fontSize: 'var(--text-sm)', 
                          color: 'var(--primary)',
                          fontWeight: '600',
                          marginBottom: 'var(--space-2)'
                        }}>
                          📍 {calculateDistance(
                            userLocation.lat, 
                            userLocation.lng, 
                            parseFloat(store.latitude), 
                            parseFloat(store.longitude)
                          )} miles away
                        </p>
                      )}
                      <button
                        onClick={() => navigate(`/stores/${store.id}`)}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 'var(--space-2)' }}
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      )}

      {/* Store Grid */}
      {viewMode === 'grid' && (
        <div className="container" style={{ paddingBottom: 'var(--space-12)' }}>
          {filteredStores.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 'var(--space-6)'
            }}>
              {filteredStores.map((store, index) => (
                <div 
                  key={store.id} 
                  className="card hover-lift"
                  style={{
                    cursor: 'pointer',
                    animation: `fadeInUp 0.6s ease-out ${0.05 * index}s backwards`
                  }}
                  onClick={() => navigate(`/stores/${store.id}`)}
                >
                  {/* Store Icon/Logo */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-xl)',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--text-3xl)',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: 'var(--space-4)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}>
                    {store.name.charAt(0)}
                  </div>

                  {/* Store Name */}
                  <h3 style={{ 
                    fontSize: 'var(--text-xl)', 
                    fontWeight: 'bold', 
                    marginBottom: 'var(--space-2)' 
                  }}>
                    {store.name}
                  </h3>

                  {/* Chain Badge */}
                  {store.chain_name && (
                    <div style={{
                      display: 'inline-block',
                      padding: 'var(--space-1) var(--space-3)',
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.1) 100%)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: '600',
                      color: '#3b82f6',
                      marginBottom: 'var(--space-4)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {store.chain_name}
                    </div>
                  )}

                  {/* Address */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: 'var(--space-2)', 
                    marginBottom: 'var(--space-3)',
                    padding: 'var(--space-3)',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <MapPin size={16} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.5' }}>
                        {store.address}
                      </p>
                      {store.city && store.state && (
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
                          {store.city}, {store.state} {store.zip_code}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  {store.phone && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--space-2)', 
                      marginBottom: 'var(--space-3)',
                      padding: 'var(--space-2) var(--space-3)',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <Phone size={16} color="var(--primary)" />
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>
                        {store.phone}
                      </p>
                    </div>
                  )}

                  {/* Distance */}
                  {userLocation && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      padding: 'var(--space-2) var(--space-3)',
                      background: 'var(--gradient-primary)',
                      color: 'white',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '600',
                      marginBottom: 'var(--space-4)'
                    }}>
                      <Navigation size={14} />
                      {calculateDistance(
                        userLocation.lat, 
                        userLocation.lng, 
                        parseFloat(store.latitude), 
                        parseFloat(store.longitude)
                      )} miles away
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ 
                    display: 'flex', 
                    gap: 'var(--space-2)', 
                    marginTop: 'var(--space-4)',
                    paddingTop: 'var(--space-4)',
                    borderTop: '1px solid var(--border)'
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/stores/${store.id}`);
                      }}
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                    >
                      <ArrowRight size={20} />
                      View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        getDirections(store);
                      }}
                      className="btn btn-secondary"
                    >
                      <Navigation size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="card" style={{
              textAlign: 'center',
              padding: 'var(--space-16) var(--space-8)',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.1) 100%)'
            }}>
              <div style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-6)',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
              }}>
                <StoreIcon size={48} color="white" />
              </div>
              <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-3)' }}>
                No Stores Found
              </h2>
              <p style={{ 
                color: 'var(--text-secondary)', 
                marginBottom: 'var(--space-6)',
                maxWidth: '400px',
                margin: '0 auto var(--space-6)'
              }}>
                {searchQuery || selectedChain !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'No stores are available in this area'}
              </p>
              {(searchQuery || selectedChain !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedChain('all');
                  }}
                  className="btn btn-primary"
                >
                  <X size={20} />
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StoresPage;
