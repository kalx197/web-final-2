const { getDB } = require('../config/database');

class Product {
  static async create(productData) {
    const { name, description, price, stock_quantity, category, image_url } = productData;
    const db = getDB();
    
    const [result] = await db.execute(
      `INSERT INTO products (name, description, price, stock_quantity, category, image_url) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, price, stock_quantity, category, image_url]
    );
    
    return result.insertId;
  }

  static async findAll(filters = {}) {
    const db = getDB();
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.minPrice) {
      query += ' AND price >= ?';
      params.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      query += ' AND price <= ?';
      params.push(filters.maxPrice);
    }

    if (filters.search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const [rows] = await db.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const db = getDB();
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, productData) {
    const db = getDB();
    const { name, description, price, stock_quantity, category, image_url } = productData;
    
    const [result] = await db.execute(
      `UPDATE products 
       SET name = ?, description = ?, price = ?, stock_quantity = ?, category = ?, image_url = ?
       WHERE id = ?`,
      [name, description, price, stock_quantity, category, image_url, id]
    );
    
    return result.affectedRows > 0;
  }

  static async updateStock(id, quantity) {
    const db = getDB();
    const [result] = await db.execute(
      'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?',
      [quantity, id, quantity]
    );
    
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const db = getDB();
    const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getLowStock(threshold = 10) {
    const db = getDB();
    const [rows] = await db.execute(
      'SELECT * FROM products WHERE stock_quantity < ? ORDER BY stock_quantity ASC',
      [threshold]
    );
    return rows;
  }
}

module.exports = Product;
