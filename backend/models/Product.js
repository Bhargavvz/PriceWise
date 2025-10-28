import pool from '../config/database.js';

class Product {
  static async create({ name, category, brand, description, image_url, unit_type, dietary_tags }) {
    const query = `
      INSERT INTO products (name, category, brand, description, image_url, unit_type, dietary_tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [name, category, brand, description, image_url, unit_type, JSON.stringify(dietary_tags || [])];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM products WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async search({ query, category, brand, dietary_tags, limit = 20, offset = 0 }) {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (query) {
      sql += ` AND (name ILIKE $${paramCount} OR brand ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      values.push(`%${query}%`);
      paramCount++;
    }

    if (category) {
      sql += ` AND category = $${paramCount}`;
      values.push(category);
      paramCount++;
    }

    if (brand) {
      sql += ` AND brand = $${paramCount}`;
      values.push(brand);
      paramCount++;
    }

    if (dietary_tags && dietary_tags.length > 0) {
      sql += ` AND dietary_tags ?| $${paramCount}`;
      values.push(dietary_tags);
      paramCount++;
    }

    sql += ` ORDER BY name LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(sql, values);
    return result.rows;
  }

  static async getCategories() {
    const query = 'SELECT DISTINCT category FROM products ORDER BY category';
    const result = await pool.query(query);
    return result.rows.map(row => row.category);
  }

  static async getBrands() {
    const query = 'SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL ORDER BY brand';
    const result = await pool.query(query);
    return result.rows.map(row => row.brand);
  }
}

export default Product;
