import Store from '../models/Store.js';
import Price from '../models/Price.js';

// @desc    Get all stores
// @route   GET /api/stores
// @access  Public
export const getStores = async (req, res) => {
  try {
    const { limit } = req.query;
    const stores = await Store.findAll(parseInt(limit) || 50);

    res.json({
      success: true,
      count: stores.length,
      data: stores
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get store by ID
// @route   GET /api/stores/:id
// @access  Public
export const getStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    // Get current sales at this store
    const sales = await Price.getSaleItems(store.id, 10);

    res.json({
      success: true,
      data: {
        ...store,
        current_sales: sales
      }
    });
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get nearby stores
// @route   GET /api/stores/nearby
// @access  Public
export const getNearbyStores = async (req, res) => {
  try {
    const { latitude, longitude, radius, limit } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude are required' 
      });
    }

    const stores = await Store.findNearby(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(radius) || 10,
      parseInt(limit) || 20
    );

    res.json({
      success: true,
      count: stores.length,
      data: stores
    });
  } catch (error) {
    console.error('Get nearby stores error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get stores by chain
// @route   GET /api/stores/chain/:chainName
// @access  Public
export const getStoresByChain = async (req, res) => {
  try {
    const stores = await Store.findByChain(req.params.chainName);

    res.json({
      success: true,
      count: stores.length,
      data: stores
    });
  } catch (error) {
    console.error('Get stores by chain error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all store chains
// @route   GET /api/stores/chains
// @access  Public
export const getChains = async (req, res) => {
  try {
    const chains = await Store.getChains();

    res.json({
      success: true,
      data: chains
    });
  } catch (error) {
    console.error('Get chains error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
