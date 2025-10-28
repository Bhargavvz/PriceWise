import pool from '../config/database.js';

class Store {
  static async create({ name, chain_name, address, city, state, zip_code, latitude, longitude, phone, hours }) {
    const query = `
      INSERT INTO stores (name, chain_name, address, city, state, zip_code, latitude, longitude, phone, hours)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [name, chain_name, address, city, state, zip_code, latitude, longitude, phone, JSON.stringify(hours || {})];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM stores WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAll(limit = 50) {
    const query = 'SELECT * FROM stores ORDER BY name LIMIT $1';
    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  static async findNearby(latitude, longitude, radiusMiles = 10, limit = 20) {
    // Using Haversine formula for distance calculation
    const query = `
      SELECT *, 
        (3959 * acos(
          cos(radians($1)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(latitude))
        )) AS distance
      FROM stores
      WHERE (3959 * acos(
        cos(radians($1)) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians($2)) + 
        sin(radians($1)) * sin(radians(latitude))
      )) <= $3
      ORDER BY distance
      LIMIT $4
    `;
    const result = await pool.query(query, [latitude, longitude, radiusMiles, limit]);
    return result.rows;
  }

  static async findByChain(chainName) {
    const query = 'SELECT * FROM stores WHERE chain_name = $1 ORDER BY name';
    const result = await pool.query(query, [chainName]);
    return result.rows;
  }

  static async getChains() {
    const query = 'SELECT DISTINCT chain_name FROM stores WHERE chain_name IS NOT NULL ORDER BY chain_name';
    const result = await pool.query(query);
    return result.rows.map(row => row.chain_name);
  }
}

export default Store;
