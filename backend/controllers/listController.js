import ShoppingList from '../models/ShoppingList.js';
import Price from '../models/Price.js';

// @desc    Create shopping list
// @route   POST /api/lists
// @access  Private
export const createList = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'List name is required' });
    }

    const list = await ShoppingList.create({
      user_id: req.user.id,
      name,
      description
    });

    res.status(201).json({
      success: true,
      data: list
    });
  } catch (error) {
    console.error('Create list error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user's shopping lists
// @route   GET /api/lists
// @access  Private
export const getLists = async (req, res) => {
  try {
    const lists = await ShoppingList.findByUserId(req.user.id);

    res.json({
      success: true,
      count: lists.length,
      data: lists
    });
  } catch (error) {
    console.error('Get lists error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get shopping list by ID
// @route   GET /api/lists/:id
// @access  Private
export const getList = async (req, res) => {
  try {
    const list = await ShoppingList.getListWithItems(req.params.id);

    if (!list) {
      return res.status(404).json({ success: false, message: 'List not found' });
    }

    // Verify ownership
    if (list.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: list
    });
  } catch (error) {
    console.error('Get list error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update shopping list
// @route   PUT /api/lists/:id
// @access  Private
export const updateList = async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ success: false, message: 'List not found' });
    }

    if (list.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { name, description, is_active } = req.body;
    const updatedList = await ShoppingList.update(req.params.id, {
      name,
      description,
      is_active
    });

    res.json({
      success: true,
      data: updatedList
    });
  } catch (error) {
    console.error('Update list error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete shopping list
// @route   DELETE /api/lists/:id
// @access  Private
export const deleteList = async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ success: false, message: 'List not found' });
    }

    if (list.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await ShoppingList.delete(req.params.id);

    res.json({
      success: true,
      message: 'List deleted successfully'
    });
  } catch (error) {
    console.error('Delete list error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add item to shopping list
// @route   POST /api/lists/:id/items
// @access  Private
export const addItem = async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ success: false, message: 'List not found' });
    }

    if (list.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { product_id, quantity, notes } = req.body;

    if (!product_id) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const item = await ShoppingList.addItem({
      list_id: req.params.id,
      product_id,
      quantity: quantity || 1,
      notes
    });

    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update list item
// @route   PUT /api/lists/items/:itemId
// @access  Private
export const updateItem = async (req, res) => {
  try {
    const { quantity, checked, notes } = req.body;

    const item = await ShoppingList.updateItem(req.params.itemId, {
      quantity,
      checked,
      notes
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Remove item from list
// @route   DELETE /api/lists/items/:itemId
// @access  Private
export const removeItem = async (req, res) => {
  try {
    const item = await ShoppingList.removeItem(req.params.itemId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({
      success: true,
      message: 'Item removed successfully'
    });
  } catch (error) {
    console.error('Remove item error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Optimize shopping list (find best stores)
// @route   POST /api/lists/:id/optimize
// @access  Private
export const optimizeList = async (req, res) => {
  try {
    const list = await ShoppingList.getListWithItems(req.params.id);

    if (!list) {
      return res.status(404).json({ success: false, message: 'List not found' });
    }

    if (list.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { latitude, longitude, radius } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ 
        success: false, 
        message: 'User location is required' 
      });
    }

    // Get product IDs from list
    const productIds = list.items.map(item => item.product_id);

    if (productIds.length === 0) {
      return res.json({
        success: true,
        data: {
          total_items: 0,
          recommendations: []
        }
      });
    }

    // Get prices for all products
    const prices = await Price.comparePrices(
      productIds, 
      parseFloat(latitude), 
      parseFloat(longitude), 
      parseFloat(radius) || 10
    );

    // Group by store and calculate totals
    const storeMap = {};
    
    prices.forEach(price => {
      const storeId = price.store_id;
      
      if (!storeMap[storeId]) {
        storeMap[storeId] = {
          store_id: storeId,
          store_name: price.store_name,
          chain_name: price.chain_name,
          address: price.address,
          latitude: price.latitude,
          longitude: price.longitude,
          distance: parseFloat(price.distance),
          items: [],
          total: 0,
          coverage: 0
        };
      }

      const listItem = list.items.find(item => item.product_id === price.product_id);
      const quantity = listItem ? listItem.quantity : 1;
      const itemTotal = parseFloat(price.price) * quantity;

      storeMap[storeId].items.push({
        product_id: price.product_id,
        product_name: price.product_name,
        quantity,
        price: parseFloat(price.price),
        subtotal: itemTotal,
        on_sale: price.on_sale
      });

      storeMap[storeId].total += itemTotal;
      storeMap[storeId].coverage++;
    });

    // Calculate coverage percentage
    const stores = Object.values(storeMap).map(store => ({
      ...store,
      coverage_percent: ((store.coverage / productIds.length) * 100).toFixed(1)
    }));

    // Sort by best value (considering coverage and price)
    stores.sort((a, b) => {
      // Prioritize stores with higher coverage
      if (a.coverage !== b.coverage) {
        return b.coverage - a.coverage;
      }
      // Then by lower price
      return a.total - b.total;
    });

    res.json({
      success: true,
      data: {
        total_items: productIds.length,
        recommendations: stores
      }
    });
  } catch (error) {
    console.error('Optimize list error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
