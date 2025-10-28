import pool from '../config/database.js';

class Price {
  static async create({ product_id, store_id, price, unit_size, unit_price, on_sale, sale_end_date }) {
    const query = `
      INSERT INTO prices (product_id, store_id, price, unit_size, unit_price, on_sale, sale_end_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (product_id, store_id, date_recorded) 
      DO UPDATE SET price = $3, unit_size = $4, unit_price = $5, on_sale = $6, sale_end_date = $7
      RETURNING *
    `;
    const values = [product_id, store_id, price, unit_size, unit_price, on_sale, sale_end_date];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getCurrentPrices(productId) {
    const query = `
      SELECT p.*, s.name as store_name, s.chain_name, s.latitude, s.longitude, s.address
      FROM prices p
      JOIN stores s ON p.store_id = s.id
      WHERE p.product_id = $1 
        AND p.date_recorded = CURRENT_DATE
      ORDER BY p.price ASC
    `;
    const result = await pool.query(query, [productId]);
    return result.rows;
  }

  static async getPriceHistory(productId, storeId, days = 30) {
    const query = `
      SELECT * FROM prices
      WHERE product_id = $1 
        AND store_id = $2
        AND date_recorded >= CURRENT_DATE - INTERVAL '${days} days'
      ORDER BY date_recorded DESC
    `;
    const result = await pool.query(query, [productId, storeId]);
    return result.rows;
  }

  static async comparePrices(productIds, latitude, longitude, radiusMiles = 10) {
    const query = `
      SELECT 
        p.product_id,
        pr.name as product_name,
        pr.category,
        pr.brand,
        pr.image_url,
        p.price,
        p.unit_size,
        p.unit_price,
        p.on_sale,
        s.id as store_id,
        s.name as store_name,
        s.chain_name,
        s.address,
        s.latitude,
        s.longitude,
        (3959 * acos(
          cos(radians($2)) * cos(radians(s.latitude)) * 
          cos(radians(s.longitude) - radians($3)) + 
          sin(radians($2)) * sin(radians(s.latitude))
        )) AS distance
      FROM prices p
      JOIN products pr ON p.product_id = pr.id
      JOIN stores s ON p.store_id = s.id
      WHERE p.product_id = ANY($1)
        AND p.date_recorded = CURRENT_DATE
        AND (3959 * acos(
          cos(radians($2)) * cos(radians(s.latitude)) * 
          cos(radians(s.longitude) - radians($3)) + 
          sin(radians($2)) * sin(radians(s.latitude))
        )) <= $4
      ORDER BY p.product_id, p.price ASC
    `;
    const result = await pool.query(query, [productIds, latitude, longitude, radiusMiles]);
    return result.rows;
  }

  static async getLowestPriceByStore(productId) {
    const query = `
      SELECT 
        p.*,
        s.name as store_name,
        s.chain_name,
        s.latitude,
        s.longitude,
        s.address
      FROM prices p
      JOIN stores s ON p.store_id = s.id
      WHERE p.product_id = $1
        AND p.date_recorded = CURRENT_DATE
      ORDER BY p.price ASC
      LIMIT 1
    `;
    const result = await pool.query(query, [productId]);
    return result.rows[0];
  }

  static async getSaleItems(storeId = null, limit = 20) {
    let query = `
      SELECT 
        p.*,
        pr.name as product_name,
        pr.category,
        pr.brand,
        pr.image_url,
        s.name as store_name,
        s.chain_name
      FROM prices p
      JOIN products pr ON p.product_id = pr.id
      JOIN stores s ON p.store_id = s.id
      WHERE p.on_sale = true
        AND p.date_recorded = CURRENT_DATE
        AND (p.sale_end_date IS NULL OR p.sale_end_date >= CURRENT_DATE)
    `;
    
    const values = [];
    if (storeId) {
      query += ' AND p.store_id = $1';
      values.push(storeId);
    }
    
    query += ` ORDER BY p.price ASC LIMIT $${values.length + 1}`;
    values.push(limit);

    const result = await pool.query(query, values);
    return result.rows;
  }
}

export default Price;
