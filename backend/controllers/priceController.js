import Price from '../models/Price.js';

// @desc    Get current prices for a product
// @route   GET /api/prices/product/:productId
// @access  Public
export const getProductPrices = async (req, res) => {
  try {
    const prices = await Price.getCurrentPrices(req.params.productId);

    res.json({
      success: true,
      count: prices.length,
      data: prices
    });
  } catch (error) {
    console.error('Get product prices error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get price history for a product at a store
// @route   GET /api/prices/history/:productId/:storeId
// @access  Public
export const getPriceHistory = async (req, res) => {
  try {
    const { productId, storeId } = req.params;
    const { days } = req.query;

    const history = await Price.getPriceHistory(
      productId, 
      storeId, 
      parseInt(days) || 30
    );

    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    console.error('Get price history error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Compare prices for multiple products
// @route   POST /api/prices/compare
// @access  Public
export const comparePrices = async (req, res) => {
  try {
    const { product_ids, latitude, longitude, radius } = req.body;

    if (!product_ids || !Array.isArray(product_ids) || product_ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product IDs array is required' 
      });
    }

    const lat = parseFloat(latitude) || 40.7128; // Default to NYC
    const lng = parseFloat(longitude) || -74.0060;
    const radiusMiles = parseFloat(radius) || 10;

    const prices = await Price.comparePrices(product_ids, lat, lng, radiusMiles);

    // Group prices by product
    const grouped = {};
    prices.forEach(price => {
      if (!grouped[price.product_id]) {
        grouped[price.product_id] = {
          product_id: price.product_id,
          product_name: price.product_name,
          category: price.category,
          brand: price.brand,
          image_url: price.image_url,
          prices: []
        };
      }
      grouped[price.product_id].prices.push({
        store_id: price.store_id,
        store_name: price.store_name,
        chain_name: price.chain_name,
        address: price.address,
        latitude: price.latitude,
        longitude: price.longitude,
        price: parseFloat(price.price),
        unit_size: price.unit_size,
        unit_price: price.unit_price,
        on_sale: price.on_sale,
        distance: parseFloat(price.distance).toFixed(2)
      });
    });

    res.json({
      success: true,
      data: Object.values(grouped)
    });
  } catch (error) {
    console.error('Compare prices error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get sale items
// @route   GET /api/prices/sales
// @access  Public
export const getSaleItems = async (req, res) => {
  try {
    const { store_id, limit } = req.query;

    const sales = await Price.getSaleItems(
      store_id ? parseInt(store_id) : null,
      parseInt(limit) || 20
    );

    res.json({
      success: true,
      count: sales.length,
      data: sales
    });
  } catch (error) {
    console.error('Get sale items error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
