import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Lock, Settings, Moon, Sun, Trash2, Save, LogOut,
  Bell, Heart, Shield, Sparkles, Mail, Phone as PhoneIcon, Edit3,
  Check, X, AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateUserLocation } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });

  const [locationData, setLocationData] = useState({
    latitude: '',
    longitude: '',
    autoDetect: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    dietary: {
      organic: false,
      vegan: false,
      vegetarian: false,
      'gluten-free': false
    },
    notifications: {
      priceAlerts: true,
      dealAlerts: true,
      weeklyDigest: false
    }
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || ''
      });

      setLocationData({
        latitude: user.location_lat || '',
        longitude: user.location_lng || '',
        autoDetect: false
      });

      if (user.preferences?.dietary) {
        setPreferences(prev => ({
          ...prev,
          dietary: { ...prev.dietary, ...user.preferences.dietary }
        }));
      }
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (locationData.latitude && locationData.longitude) {
        await updateUserLocation(
          parseFloat(locationData.latitude),
          parseFloat(locationData.longitude)
        );
        toast.success('Location updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoDetectLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData({
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
            autoDetect: true
          });
          setLoading(false);
          toast.success('Location detected!');
        },
        (error) => {
          setLoading(false);
          toast.error('Failed to detect location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Preferences saved!');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.success('Account deleted');
      logout();
      navigate('/');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, color: '#3b82f6' },
    { id: 'location', label: 'Location', icon: MapPin, color: '#10b981' },
    { id: 'security', label: 'Security', icon: Lock, color: '#8b5cf6' },
    { id: 'preferences', label: 'Preferences', icon: Settings, color: '#f59e0b' }
  ];

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 'var(--space-12)' }}>
      {/* Hero Header with Gradient based on active tab */}
      <div style={{
        background: activeTab === 'profile' 
          ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
          : activeTab === 'location'
          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          : activeTab === 'security'
          ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
          : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        padding: 'var(--space-12) 0 var(--space-16)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.5s ease'
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

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* User Avatar */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'white',
            margin: '0 auto var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--text-5xl)',
            fontWeight: 'extrabold',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            border: '4px solid white',
            animation: 'fadeInUp 0.6s ease-out'
          }}>
            {user?.first_name?.charAt(0) || 'U'}
          </div>

          {/* User Name */}
          <h1 style={{
            color: 'white',
            marginBottom: 'var(--space-2)',
            fontSize: 'var(--text-4xl)',
            fontWeight: 'extrabold',
            animation: 'fadeInUp 0.6s ease-out 0.1s backwards'
          }}>
            {user?.first_name && user?.last_name 
              ? `${user.first_name} ${user.last_name}`
              : 'Your Account'}
          </h1>

          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: 'var(--text-lg)',
            marginBottom: 'var(--space-6)',
            animation: 'fadeInUp 0.6s ease-out 0.2s backwards'
          }}>
            {user?.email || 'Manage your profile and preferences'}
          </p>

          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-4)',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            animation: 'fadeInUp 0.6s ease-out 0.3s backwards'
          }}>
            <Sparkles size={16} color="white" />
            <span style={{ color: 'white', fontSize: 'var(--text-sm)', fontWeight: '600' }}>
              Premium Member
            </span>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
        {/* Tabs */}
        <div className="card" style={{
          padding: 'var(--space-2)',
          marginBottom: 'var(--space-8)',
          background: 'var(--bg-primary)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          animation: 'fadeInUp 0.6s ease-out 0.4s backwards'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
            gap: 'var(--space-2)'
          }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="hover-lift"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-4)',
                    border: 'none',
                    background: isActive 
                      ? `linear-gradient(135deg, ${tab.color} 0%, ${tab.color}dd 100%)`
                      : 'var(--bg-secondary)',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-lg)',
                    color: isActive ? 'white' : 'var(--text-secondary)',
                    fontWeight: isActive ? '600' : '500',
                    transition: 'var(--transition)',
                    boxShadow: isActive ? `0 4px 12px ${tab.color}40` : 'none'
                  }}
                >
                  <Icon size={24} />
                  <span style={{ fontSize: 'var(--text-sm)' }}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="card" style={{ 
          padding: 'var(--space-8)',
          animation: 'fadeInUp 0.6s ease-out 0.5s backwards'
        }}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              {/* Icon Header */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                marginBottom: 'var(--space-4)'
              }}>
                <User size={28} color="white" />
              </div>

              <h2 style={{ 
                fontSize: 'var(--text-3xl)', 
                fontWeight: 'bold', 
                marginBottom: 'var(--space-2)' 
              }}>
                Personal Information
              </h2>
              <p style={{ 
                color: 'var(--text-secondary)', 
                marginBottom: 'var(--space-8)',
                fontSize: 'var(--text-lg)'
              }}>
                Update your personal details and contact information
              </p>

              <form onSubmit={handleProfileUpdate}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                  gap: 'var(--space-6)', 
                  marginBottom: 'var(--space-6)' 
                }}>
                  <div>
                    <label style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      marginBottom: 'var(--space-3)', 
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      <Edit3 size={14} />
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileData.first_name}
                      onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                      className="input"
                      required
                      style={{ height: '3rem', fontSize: 'var(--text-base)' }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      marginBottom: 'var(--space-3)', 
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      <Edit3 size={14} />
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                      className="input"
                      required
                      style={{ height: '3rem', fontSize: 'var(--text-base)' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <label style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    marginBottom: 'var(--space-3)', 
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <Mail size={14} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="input"
                    required
                    style={{ height: '3rem', fontSize: 'var(--text-base)' }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn hover-lift" 
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    height: '3.5rem',
                    fontSize: 'var(--text-lg)',
                    fontWeight: '600'
                  }}
                >
                  <Save size={20} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Location Tab */}
          {activeTab === 'location' && (
            <div>
              {/* Icon Header */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--gradient-primary)',
                marginBottom: 'var(--space-4)'
              }}>
                <MapPin size={28} color="white" />
              </div>

              <h2 style={{ 
                fontSize: 'var(--text-3xl)', 
                fontWeight: 'bold', 
                marginBottom: 'var(--space-2)' 
              }}>
                Location Settings
              </h2>
              <p style={{ 
                color: 'var(--text-secondary)', 
                marginBottom: 'var(--space-8)',
                fontSize: 'var(--text-lg)'
              }}>
                Set your location to find nearby stores and get accurate distance calculations
              </p>

              <form onSubmit={handleLocationUpdate}>
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <button
                    type="button"
                    onClick={handleAutoDetectLocation}
                    className="btn hover-lift"
                    disabled={loading}
                    style={{
                      background: 'var(--gradient-primary)',
                      color: 'white',
                      height: '3.5rem',
                      fontSize: 'var(--text-lg)',
                      fontWeight: '600',
                      width: '100%'
                    }}
                  >
                    <MapPin size={24} />
                    {loading ? 'Detecting Location...' : 'Auto-Detect My Location'}
                  </button>
                </div>

                <div style={{
                  padding: 'var(--space-6)',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.1) 100%)',
                  borderRadius: 'var(--radius-xl)',
                  border: '2px solid rgba(16, 185, 129, 0.2)',
                  marginBottom: 'var(--space-6)'
                }}>
                  <h3 style={{ 
                    fontSize: 'var(--text-lg)', 
                    fontWeight: '600', 
                    marginBottom: 'var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}>
                    <AlertCircle size={20} color="var(--primary)" />
                    Manual Entry
                  </h3>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                    gap: 'var(--space-6)'
                  }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: 'var(--space-3)', 
                        fontWeight: '600',
                        fontSize: 'var(--text-sm)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={locationData.latitude}
                        onChange={(e) => setLocationData({ ...locationData, latitude: e.target.value })}
                        className="input"
                        placeholder="40.7128"
                        style={{ height: '3rem', fontSize: 'var(--text-base)' }}
                      />
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: 'var(--space-3)', 
                        fontWeight: '600',
                        fontSize: 'var(--text-sm)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={locationData.longitude}
                        onChange={(e) => setLocationData({ ...locationData, longitude: e.target.value })}
                        className="input"
                        placeholder="-74.0060"
                        style={{ height: '3rem', fontSize: 'var(--text-base)' }}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn hover-lift" 
                  disabled={loading}
                  style={{
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    height: '3.5rem',
                    fontSize: 'var(--text-lg)',
                    fontWeight: '600'
                  }}
                >
                  <Save size={20} />
                  {loading ? 'Saving...' : 'Save Location'}
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              {/* Icon Header */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                marginBottom: 'var(--space-4)'
              }}>
                <Lock size={28} color="white" />
              </div>

              <h2 style={{ 
                fontSize: 'var(--text-3xl)', 
                fontWeight: 'bold', 
                marginBottom: 'var(--space-2)' 
              }}>
                Change Password
              </h2>
              <p style={{ 
                color: 'var(--text-secondary)', 
                marginBottom: 'var(--space-8)',
                fontSize: 'var(--text-lg)'
              }}>
                Keep your account secure by updating your password regularly
              </p>

              <form onSubmit={handlePasswordChange}>
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <label style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    marginBottom: 'var(--space-3)', 
                    fontWeight: '600',
                    fontSize: 'var(--text-sm)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <Shield size={14} />
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="input"
                    required
                    style={{ height: '3rem', fontSize: 'var(--text-base)' }}
                  />
                </div>

                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <label style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    marginBottom: 'var(--space-3)', 
                    fontWeight: '600',
                    fontSize: 'var(--text-sm)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <Lock size={14} />
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="input"
                    minLength={6}
                    required
                    style={{ height: '3rem', fontSize: 'var(--text-base)' }}
                  />
                  <p style={{ 
                    fontSize: 'var(--text-sm)', 
                    color: 'var(--text-secondary)', 
                    marginTop: 'var(--space-2)' 
                  }}>
                    Must be at least 6 characters long
                  </p>
                </div>

                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <label style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    marginBottom: 'var(--space-3)', 
                    fontWeight: '600',
                    fontSize: 'var(--text-sm)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <Check size={14} />
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="input"
                    minLength={6}
                    required
                    style={{ height: '3rem', fontSize: 'var(--text-base)' }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn hover-lift" 
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                    color: 'white',
                    height: '3.5rem',
                    fontSize: 'var(--text-lg)',
                    fontWeight: '600'
                  }}
                >
                  <Lock size={20} />
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>

              {/* Danger Zone */}
              <div style={{
                marginTop: 'var(--space-12)',
                padding: 'var(--space-8)',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.1) 100%)',
                borderRadius: 'var(--radius-2xl)',
                border: '2px solid rgba(239, 68, 68, 0.2)'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  marginBottom: 'var(--space-4)'
                }}>
                  <AlertCircle size={24} color="white" />
                </div>

                <h3 style={{ 
                  marginBottom: 'var(--space-3)', 
                  color: '#ef4444',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'bold'
                }}>
                  Danger Zone
                </h3>
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  marginBottom: 'var(--space-6)',
                  fontSize: 'var(--text-base)'
                }}>
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="btn hover-lift"
                  style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    height: '3rem'
                  }}
                >
                  <Trash2 size={20} />
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div>
              {/* Icon Header */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                marginBottom: 'var(--space-4)'
              }}>
                <Settings size={28} color="white" />
              </div>

              {/* Dietary Preferences */}
              <div style={{ marginBottom: 'var(--space-10)' }}>
                <h2 style={{ 
                  fontSize: 'var(--text-2xl)', 
                  fontWeight: 'bold', 
                  marginBottom: 'var(--space-2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}>
                  <Heart size={24} color="#f59e0b" />
                  Dietary Preferences
                </h2>
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  marginBottom: 'var(--space-6)',
                  fontSize: 'var(--text-base)'
                }}>
                  Select your dietary preferences for personalized product recommendations
                </p>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                  gap: 'var(--space-4)' 
                }}>
                  {Object.keys(preferences.dietary).map(key => (
                    <label
                      key={key}
                      className="hover-lift"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        padding: 'var(--space-4)',
                        border: '2px solid',
                        borderColor: preferences.dietary[key] ? '#f59e0b' : 'var(--border)',
                        borderRadius: 'var(--radius-xl)',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        background: preferences.dietary[key] 
                          ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)'
                          : 'var(--bg-secondary)',
                        boxShadow: preferences.dietary[key] ? '0 4px 12px rgba(245, 158, 11, 0.2)' : 'none'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={preferences.dietary[key]}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          dietary: { ...preferences.dietary, [key]: e.target.checked }
                        })}
                        style={{ 
                          width: '24px', 
                          height: '24px',
                          accentColor: '#f59e0b',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ 
                        textTransform: 'capitalize',
                        fontWeight: preferences.dietary[key] ? '600' : '500',
                        fontSize: 'var(--text-base)'
                      }}>
                        {key.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Appearance */}
              <div style={{ marginBottom: 'var(--space-10)' }}>
                <h2 style={{ 
                  fontSize: 'var(--text-2xl)', 
                  fontWeight: 'bold', 
                  marginBottom: 'var(--space-2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}>
                  {theme === 'dark' ? <Moon size={24} color="#f59e0b" /> : <Sun size={24} color="#f59e0b" />}
                  Appearance
                </h2>
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  marginBottom: 'var(--space-6)',
                  fontSize: 'var(--text-base)'
                }}>
                  Customize how PriceWise looks on your device
                </p>

                <div className="hover-lift" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: 'var(--space-6)', 
                  border: '2px solid var(--border)', 
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--bg-secondary)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-lg)',
                      background: theme === 'dark' 
                        ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                        : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                    }}>
                      {theme === 'dark' ? <Moon size={24} color="white" /> : <Sun size={24} color="white" />}
                    </div>
                    <div>
                      <h4 style={{ marginBottom: 'var(--space-1)', fontSize: 'var(--text-lg)', fontWeight: '600' }}>
                        Theme Mode
                      </h4>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                        Currently using <strong>{theme === 'dark' ? 'Dark' : 'Light'}</strong> mode
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="btn hover-lift"
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: 'white',
                      height: '3rem',
                      minWidth: '120px'
                    }}
                  >
                    Toggle
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <button 
                onClick={handlePreferencesUpdate} 
                className="btn hover-lift" 
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  height: '3.5rem',
                  fontSize: 'var(--text-lg)',
                  fontWeight: '600',
                  width: '100%'
                }}
              >
                <Save size={20} />
                {loading ? 'Saving...' : 'Save All Preferences'}
              </button>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div style={{ marginTop: 'var(--space-8)', textAlign: 'center' }}>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="btn btn-secondary hover-lift"
            style={{
              height: '3.5rem',
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              minWidth: '200px'
            }}
          >
            <LogOut size={24} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
