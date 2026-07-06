const { getDB } = require('../config/database');

class SaleItem {
  static async create(saleItemData) {
    const { sale_id, product_id, quantity, price_at_time } = saleItemData;
    const db = getDB();
    
    const [result] = await db.execute(
      `INSERT INTO sale_items (sale_id, product_id, quantity, price_at_time) 
       VALUES (?, ?, ?, ?)`,
      [sale_id, product_id, quantity, price_at_time]
    );
    
    return result.insertId;
  }

  static async createMultiple(items) {
    const db = getDB();
    const values = items.map(item => 
      [item.sale_id, item.product_id, item.quantity, item.price_at_time]
    );
    
    const [result] = await db.query(
      'INSERT INTO sale_items (sale_id, product_id, quantity, price_at_time) VALUES ?',
      [values]
    );
    
    return result.affectedRows;
  }
}

module.exports = SaleItem;
