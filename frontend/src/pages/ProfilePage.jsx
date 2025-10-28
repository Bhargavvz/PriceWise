import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Lock, Settings, Moon, Sun, Trash2, Save, LogOut } from 'lucide-react';
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
      // Simulate API call - in real app, call backend endpoint
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
      // Simulate API call
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
      // Simulate API call
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
      // Simulate account deletion
      toast.success('Account deleted');
      logout();
      navigate('/');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Settings }
  ];

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
          margin: '0 auto 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: 'white',
          boxShadow: '0 10px 30px rgba(22, 163, 74, 0.3)'
        }}>
          {user?.first_name?.charAt(0) || 'U'}
        </div>
        <h1 style={{ marginBottom: '0.5rem' }}>Account Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your profile and preferences
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '2px solid var(--border)',
        overflowX: 'auto'
      }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 1.5rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                marginBottom: '-2px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                transition: 'var(--transition)',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={20} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="card" style={{ padding: '2rem' }}>
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Personal Information</h2>
            <form onSubmit={handleProfileUpdate}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileData.first_name}
                    onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileData.last_name}
                    onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Save size={20} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Location Tab */}
        {activeTab === 'location' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Location Settings</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Set your location to find nearby stores and get accurate distance calculations.
            </p>

            <form onSubmit={handleLocationUpdate}>
              <div style={{ marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  onClick={handleAutoDetectLocation}
                  className="btn btn-secondary"
                  style={{ marginBottom: '1rem' }}
                  disabled={loading}
                >
                  <MapPin size={20} />
                  Auto-Detect Location
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={locationData.latitude}
                    onChange={(e) => setLocationData({ ...locationData, latitude: e.target.value })}
                    className="input"
                    placeholder="40.7128"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={locationData.longitude}
                    onChange={(e) => setLocationData({ ...locationData, longitude: e.target.value })}
                    className="input"
                    placeholder="-74.0060"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Save size={20} />
                {loading ? 'Saving...' : 'Save Location'}
              </button>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Change Password</h2>
            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="input"
                  minLength={6}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="input"
                  minLength={6}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Lock size={20} />
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>

            <div style={{
              marginTop: '3rem',
              padding: '1.5rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--danger)' }}>Danger Zone</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="btn"
                style={{
                  backgroundColor: 'var(--danger)',
                  color: 'white'
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
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Dietary Preferences</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {Object.keys(preferences.dietary).map(key => (
                  <label
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem',
                      border: '2px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      backgroundColor: preferences.dietary[key] ? 'rgba(22, 163, 74, 0.1)' : 'transparent',
                      borderColor: preferences.dietary[key] ? 'var(--primary)' : 'var(--border)'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={preferences.dietary[key]}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        dietary: { ...preferences.dietary, [key]: e.target.checked }
                      })}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <span style={{ textTransform: 'capitalize' }}>{key.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Appearance</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '2px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>Theme</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="btn btn-secondary"
                >
                  Toggle
                </button>
              </div>
            </div>

            <button onClick={handlePreferencesUpdate} className="btn btn-primary" disabled={loading}>
              <Save size={20} />
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="btn btn-secondary"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
