import pool from '../config/database.js';

// @desc    Get user's savings analytics
// @route   GET /api/analytics/savings
// @access  Private
export const getSavings = async (req, res) => {
  try {
    const { days } = req.query;
    const period = parseInt(days) || 30;

    // This is a simplified calculation
    // In production, you'd track actual purchases vs market average
    const query = `
      SELECT 
        COUNT(DISTINCT li.id) as items_tracked,
        AVG(p.price) as avg_price,
        MIN(p.price) as best_price,
        (AVG(p.price) - MIN(p.price)) * COUNT(DISTINCT li.id) as estimated_savings
      FROM list_items li
      JOIN shopping_lists sl ON li.list_id = sl.id
      JOIN prices p ON li.product_id = p.product_id
      WHERE sl.user_id = $1
        AND p.date_recorded >= CURRENT_DATE - INTERVAL '${period} days'
    `;

    const result = await pool.query(query, [req.user.id]);
    const data = result.rows[0];

    res.json({
      success: true,
      data: {
        period_days: period,
        items_tracked: parseInt(data.items_tracked) || 0,
        estimated_savings: parseFloat(data.estimated_savings) || 0,
        avg_price: parseFloat(data.avg_price) || 0,
        best_price: parseFloat(data.best_price) || 0
      }
    });
  } catch (error) {
    console.error('Get savings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get price trends for products user tracks
// @route   GET /api/analytics/trends
// @access  Private
export const getPriceTrends = async (req, res) => {
  try {
    const { product_id, days } = req.query;
    const period = parseInt(days) || 30;

    let query;
    let values;

    if (product_id) {
      // Trend for specific product
      query = `
        SELECT 
          p.date_recorded,
          p.product_id,
          pr.name as product_name,
          AVG(p.price) as avg_price,
          MIN(p.price) as min_price,
          MAX(p.price) as max_price,
          COUNT(DISTINCT p.store_id) as store_count
        FROM prices p
        JOIN products pr ON p.product_id = pr.id
        WHERE p.product_id = $1
          AND p.date_recorded >= CURRENT_DATE - INTERVAL '${period} days'
        GROUP BY p.date_recorded, p.product_id, pr.name
        ORDER BY p.date_recorded ASC
      `;
      values = [product_id];
    } else {
      // Trends for user's tracked products
      query = `
        SELECT 
          p.date_recorded,
          p.product_id,
          pr.name as product_name,
          AVG(p.price) as avg_price,
          MIN(p.price) as min_price,
          MAX(p.price) as max_price
        FROM prices p
        JOIN products pr ON p.product_id = pr.id
        JOIN list_items li ON p.product_id = li.product_id
        JOIN shopping_lists sl ON li.list_id = sl.id
        WHERE sl.user_id = $1
          AND p.date_recorded >= CURRENT_DATE - INTERVAL '${period} days'
        GROUP BY p.date_recorded, p.product_id, pr.name
        ORDER BY p.date_recorded ASC
        LIMIT 100
      `;
      values = [req.user.id];
    }

    const result = await pool.query(query, values);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Get price trends error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user's shopping statistics
// @route   GET /api/analytics/stats
// @access  Private
export const getStats = async (req, res) => {
  try {
    // Get shopping list stats
    const listsQuery = `
      SELECT 
        COUNT(*) as total_lists,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_lists
      FROM shopping_lists
      WHERE user_id = $1
    `;
    const listsResult = await pool.query(listsQuery, [req.user.id]);

    // Get items stats
    const itemsQuery = `
      SELECT 
        COUNT(DISTINCT li.id) as total_items,
        COUNT(DISTINCT li.product_id) as unique_products,
        COUNT(CASE WHEN li.checked = true THEN 1 END) as checked_items
      FROM list_items li
      JOIN shopping_lists sl ON li.list_id = sl.id
      WHERE sl.user_id = $1
    `;
    const itemsResult = await pool.query(itemsQuery, [req.user.id]);

    // Get most frequent categories
    const categoriesQuery = `
      SELECT 
        p.category,
        COUNT(*) as count
      FROM list_items li
      JOIN shopping_lists sl ON li.list_id = sl.id
      JOIN products p ON li.product_id = p.id
      WHERE sl.user_id = $1
      GROUP BY p.category
      ORDER BY count DESC
      LIMIT 5
    `;
    const categoriesResult = await pool.query(categoriesQuery, [req.user.id]);

    res.json({
      success: true,
      data: {
        lists: listsResult.rows[0],
        items: itemsResult.rows[0],
        top_categories: categoriesResult.rows
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get popular products in user's area
// @route   GET /api/analytics/popular
// @access  Public
export const getPopularProducts = async (req, res) => {
  try {
    const { latitude, longitude, limit } = req.query;
    
    // This is a simplified version - in production you'd track actual user behavior
    const query = `
      SELECT 
        p.id,
        p.name,
        p.category,
        p.brand,
        p.image_url,
        COUNT(DISTINCT pr.store_id) as available_stores,
        AVG(pr.price) as avg_price,
        MIN(pr.price) as min_price
      FROM products p
      JOIN prices pr ON p.id = pr.product_id
      WHERE pr.date_recorded = CURRENT_DATE
      GROUP BY p.id, p.name, p.category, p.brand, p.image_url
      ORDER BY available_stores DESC, avg_price ASC
      LIMIT $1
    `;

    const result = await pool.query(query, [parseInt(limit) || 10]);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Get popular products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
