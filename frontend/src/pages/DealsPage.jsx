import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { priceService } from '../services';
import { useToast } from '../contexts/ToastContext';

const DealsPage = () => {
  const toast = useToast();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const response = await priceService.getSaleItems(null, 50);
      if (response.success) {
        setDeals(response.data);
      }
    } catch (error) {
      console.error('Error loading deals:', error);
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Tag size={32} color="var(--primary)" />
          Current Deals
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Save big with our latest deals and discounts
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : deals.length > 0 ? (
        <div className="grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {deals.map(deal => (
            <Link key={deal.id} to={`/product/${deal.product_id}`} style={{ textDecoration: 'none' }}>
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
                    store_name: deal.store_name
                  }]
                }}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>No deals available</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Check back later for new deals!</p>
        </div>
      )}
    </div>
  );
};

export default DealsPage;
