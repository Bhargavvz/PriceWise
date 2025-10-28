import pool from '../config/database.js';

class User {
  static async create({ email, password_hash, first_name, last_name, location_lat, location_lng, preferences }) {
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, location_lat, location_lng, preferences)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, first_name, last_name, location_lat, location_lng, preferences, created_at
    `;
    const values = [email, password_hash, first_name, last_name, location_lat, location_lng, JSON.stringify(preferences || {})];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, first_name, last_name, location_lat, location_lng, preferences, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateLocation(userId, latitude, longitude) {
    const query = `
      UPDATE users 
      SET location_lat = $1, location_lng = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, email, first_name, last_name, location_lat, location_lng
    `;
    const result = await pool.query(query, [latitude, longitude, userId]);
    return result.rows[0];
  }

  static async updatePreferences(userId, preferences) {
    const query = `
      UPDATE users 
      SET preferences = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, email, preferences
    `;
    const result = await pool.query(query, [JSON.stringify(preferences), userId]);
    return result.rows[0];
  }
}

export default User;
