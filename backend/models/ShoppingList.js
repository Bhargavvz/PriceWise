import pool from '../config/database.js';

class ShoppingList {
  static async create({ user_id, name, description }) {
    const query = `
      INSERT INTO shopping_lists (user_id, name, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [user_id, name, description]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM shopping_lists WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT * FROM shopping_lists 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async update(id, { name, description, is_active }) {
    const query = `
      UPDATE shopping_lists 
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          is_active = COALESCE($3, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;
    const result = await pool.query(query, [name, description, is_active, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM shopping_lists WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async addItem({ list_id, product_id, quantity, notes }) {
    const query = `
      INSERT INTO list_items (list_id, product_id, quantity, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [list_id, product_id, quantity, notes]);
    return result.rows[0];
  }

  static async getItems(listId) {
    const query = `
      SELECT 
        li.*,
        p.name as product_name,
        p.category,
        p.brand,
        p.image_url,
        p.unit_type
      FROM list_items li
      JOIN products p ON li.product_id = p.id
      WHERE li.list_id = $1
      ORDER BY li.created_at ASC
    `;
    const result = await pool.query(query, [listId]);
    return result.rows;
  }

  static async updateItem(itemId, { quantity, checked, notes }) {
    const query = `
      UPDATE list_items 
      SET quantity = COALESCE($1, quantity),
          checked = COALESCE($2, checked),
          notes = COALESCE($3, notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;
    const result = await pool.query(query, [quantity, checked, notes, itemId]);
    return result.rows[0];
  }

  static async removeItem(itemId) {
    const query = 'DELETE FROM list_items WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [itemId]);
    return result.rows[0];
  }

  static async getListWithItems(listId) {
    const list = await this.findById(listId);
    if (!list) return null;

    const items = await this.getItems(listId);
    return { ...list, items };
  }
}

export default ShoppingList;
