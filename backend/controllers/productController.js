import Product from '../models/Product.js';
import Price from '../models/Price.js';

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req, res) => {
  try {
    const { q, category, brand, dietary, limit, offset } = req.query;

    const dietary_tags = dietary ? dietary.split(',') : null;

    const products = await Product.search({
      query: q,
      category,
      brand,
      dietary_tags,
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get current prices for this product
    const prices = await Price.getCurrentPrices(product.id);

    res.json({
      success: true,
      data: {
        ...product,
        current_prices: prices
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.getCategories();

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all brands
// @route   GET /api/products/brands
// @access  Public
export const getBrands = async (req, res) => {
  try {
    const brands = await Product.getBrands();

    res.json({
      success: true,
      data: brands
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
