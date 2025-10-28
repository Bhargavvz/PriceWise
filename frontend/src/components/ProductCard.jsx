import { ShoppingBag, Tag, MapPin } from 'lucide-react';

const ProductCard = ({ product, onClick }) => {
  const lowestPrice = product.current_prices?.[0] || product;

  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Product Image */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '200px',
        marginBottom: '1rem',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-tertiary)'
      }}>
        <img
          src={product.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        {lowestPrice.on_sale && (
          <div style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            backgroundColor: 'var(--danger)',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            fontWeight: 'bold'
          }}>
            SALE
          </div>
        )}
      </div>

      {/* Product Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          fontSize: '1.125rem',
          marginBottom: '0.5rem',
          color: 'var(--text-primary)',
          lineHeight: '1.4'
        }}>
          {product.name}
        </h3>

        {product.brand && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--text-tertiary)'
          }}>
            <Tag size={14} />
            <span>{product.brand}</span>
          </div>
        )}

        <div style={{
          display: 'inline-block',
          padding: '0.25rem 0.75rem',
          backgroundColor: 'var(--bg-tertiary)',
          color: 'var(--text-secondary)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          marginBottom: '1rem',
          alignSelf: 'flex-start'
        }}>
          {product.category}
        </div>

        {/* Price Info */}
        <div style={{ marginTop: 'auto' }}>
          {lowestPrice.price && (
            <>
              <div style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: 'var(--primary)',
                marginBottom: '0.25rem'
              }}>
                ${parseFloat(lowestPrice.price).toFixed(2)}
              </div>
              {lowestPrice.unit_price && (
                <div style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-tertiary)'
                }}>
                  ${parseFloat(lowestPrice.unit_price).toFixed(2)} per unit
                </div>
              )}
              {lowestPrice.store_name && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  marginTop: '0.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  <MapPin size={14} />
                  <span>{lowestPrice.store_name}</span>
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
