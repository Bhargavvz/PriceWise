import { ShoppingBag, Tag, MapPin, Heart, Eye, TrendingDown } from 'lucide-react';
import { useState } from 'react';

const ProductCard = ({ product, onClick }) => {
  const lowestPrice = product.current_prices?.[0] || product;
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div
      className="card animate-fadeInUp"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all var(--transition-base)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered ? 'var(--shadow-xl)' : 'var(--shadow-md)',
        overflow: 'hidden'
      }}
    >
      {/* Product Image with Overlay */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '220px',
        marginBottom: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-tertiary)'
      }}>
        {/* Image */}
        <img
          src={product.image_url || 'https://via.placeholder.com/300x220?text=No+Image'}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-slow)',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x220?text=No+Image';
          }}
        />
        
        {/* Gradient Overlay on Hover */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity var(--transition-base)',
          pointerEvents: 'none'
        }} />
        
        {/* Sale Badge */}
        {lowestPrice.on_sale && (
          <div style={{
            position: 'absolute',
            top: 'var(--space-3)',
            left: 'var(--space-3)',
            background: 'linear-gradient(135deg, var(--danger) 0%, var(--danger-dark) 100%)',
            color: 'white',
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-bold)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            boxShadow: 'var(--shadow-lg)',
            animation: 'pulse 2s infinite'
          }}>
            <TrendingDown size={12} />
            SALE
          </div>
        )}
        
        {/* Action Buttons */}
        <div style={{
          position: 'absolute',
          top: 'var(--space-3)',
          right: 'var(--space-3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateX(0)' : 'translateX(20px)',
          transition: 'all var(--transition-base)'
        }}>
          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)',
              transition: 'all var(--transition-base)',
              color: isFavorite ? 'var(--danger)' : 'var(--text-tertiary)'
            }}
            className="hover-lift"
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          
          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)',
              transition: 'all var(--transition-base)',
              color: 'var(--text-secondary)'
            }}
            className="hover-lift"
          >
            <Eye size={18} />
          </button>
        </div>
        
        {/* Quick Add to Cart Button (Bottom) */}
        <div style={{
          position: 'absolute',
          bottom: 'var(--space-3)',
          left: '50%',
          transform: `translateX(-50%) translateY(${isHovered ? '0' : '60px'})`,
          opacity: isHovered ? 1 : 0,
          transition: 'all var(--transition-base)',
          width: 'calc(100% - var(--space-6))'
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Add to cart logic here
            }}
            className="btn btn-primary"
            style={{
              width: '100%',
              gap: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              padding: 'var(--space-2) var(--space-4)',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <ShoppingBag size={16} />
            Add to List
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Product Name */}
        <h3 style={{
          fontSize: 'var(--text-lg)',
          marginBottom: 'var(--space-2)',
          color: 'var(--text-primary)',
          lineHeight: 'var(--leading-tight)',
          fontWeight: 'var(--font-semibold)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {product.name}
        </h3>

        {/* Brand */}
        {product.brand && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            marginBottom: 'var(--space-2)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-tertiary)'
          }}>
            <Tag size={14} />
            <span>{product.brand}</span>
          </div>
        )}

        {/* Category Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: 'var(--space-1) var(--space-3)',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
          color: 'var(--primary)',
          borderRadius: 'var(--radius-full)',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-medium)',
          marginBottom: 'var(--space-4)',
          alignSelf: 'flex-start',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          {product.category}
        </div>

        {/* Price Info */}
        <div style={{ 
          marginTop: 'auto',
          padding: 'var(--space-3) 0',
          borderTop: '1px solid var(--border-light)'
        }}>
          {lowestPrice.price && (
            <>
              {/* Price */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-2)'
              }}>
                <div style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--font-bold)',
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1
                }}>
                  ${parseFloat(lowestPrice.price).toFixed(2)}
                </div>
                {lowestPrice.on_sale && (
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--danger)',
                    fontWeight: 'var(--font-semibold)'
                  }}>
                    Save 15%
                  </div>
                )}
              </div>
              
              {/* Unit Price */}
              {lowestPrice.unit_price && (
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-tertiary)',
                  marginBottom: 'var(--space-2)'
                }}>
                  ${parseFloat(lowestPrice.unit_price).toFixed(2)} per unit
                </div>
              )}
              
              {/* Store Location */}
              {lowestPrice.store_name && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)'
                }}>
                  <MapPin size={14} style={{ flexShrink: 0, color: 'var(--primary)' }} />
                  <span style={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {lowestPrice.store_name}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
