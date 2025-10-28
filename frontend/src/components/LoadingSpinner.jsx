const LoadingSpinner = ({ size = 'md', fullScreen = false, variant = 'spinner' }) => {
  const sizes = {
    sm: '24px',
    md: '40px',
    lg: '60px',
    xl: '80px'
  };

  const spinnerSize = sizes[size] || sizes.md;

  // Skeleton loading variant
  if (variant === 'skeleton') {
    return (
      <div style={{
        display: 'grid',
        gap: 'var(--space-4)',
        padding: fullScreen ? 'var(--space-8)' : 0
      }}>
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text" style={{ width: '60%' }} />
      </div>
    );
  }

  const spinner = (
    <div style={{
      width: spinnerSize,
      height: spinnerSize,
      position: 'relative',
      display: 'inline-block'
    }}>
      {/* Outer Ring */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        border: '3px solid var(--border)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      
      {/* Inner Ring */}
      <div style={{
        position: 'absolute',
        width: '70%',
        height: '70%',
        top: '15%',
        left: '15%',
        border: '3px solid transparent',
        borderTopColor: 'var(--secondary)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite reverse',
        opacity: 0.6
      }} />
      
      {/* Center Dot */}
      <div style={{
        position: 'absolute',
        width: '30%',
        height: '30%',
        top: '35%',
        left: '35%',
        background: 'var(--gradient-primary)',
        borderRadius: '50%',
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        gap: 'var(--space-4)',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        {spinner}
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-medium)',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          Loading amazing content...
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 'var(--space-8)'
    }}>
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
