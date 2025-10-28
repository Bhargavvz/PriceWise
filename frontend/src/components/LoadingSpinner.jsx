const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: '1.5rem',
    md: '2rem',
    lg: '3rem'
  };

  const spinner = (
    <div
      className="spinner"
      style={{
        width: sizes[size],
        height: sizes[size],
        border: `3px solid var(--border)`,
        borderTopColor: 'var(--primary)'
      }}
    />
  );

  if (fullScreen) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        {spinner}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
