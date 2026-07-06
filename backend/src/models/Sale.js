const { getDB } = require('../config/database');

class Sale {
  static async create(saleData) {
    const { user_id, total_amount, payment_method, status = 'completed' } = saleData;
    const db = getDB();
    
    const [result] = await db.execute(
      `INSERT INTO sales (user_id, total_amount, payment_method, status) 
       VALUES (?, ?, ?, ?)`,
      [user_id, total_amount, payment_method, status]
    );
    
    return result.insertId;
  }

  static async findById(id) {
    const db = getDB();
    const [rows] = await db.execute(`
      SELECT s.*, u.username 
      FROM sales s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `, [id]);
    return rows[0];
  }

  static async findAll(filters = {}) {
    const db = getDB();
    let query = `
      SELECT s.*, u.username,
      (SELECT COUNT(*) FROM sale_items WHERE sale_id = s.id) as item_count
      FROM sales s
      JOIN users u ON s.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      query += ' AND s.status = ?';
      params.push(filters.status);
    }

    if (filters.startDate) {
      query += ' AND s.created_at >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ' AND s.created_at <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY s.created_at DESC';

    const [rows] = await db.execute(query, params);
    return rows;
  }

  static async getSaleItems(saleId) {
    const db = getDB();
    const [rows] = await db.execute(`
      SELECT si.*, p.name, p.image_url
      FROM sale_items si
      JOIN products p ON si.product_id = p.id
      WHERE si.sale_id = ?
    `, [saleId]);
    return rows;
  }

  static async getSalesStats() {
    const db = getDB();
    const [rows] = await db.execute(`
      SELECT 
        COUNT(*) as total_sales,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as avg_sale_amount,
        DATE_FORMAT(created_at, '%Y-%m-%d') as sale_date
      FROM sales
      WHERE status = 'completed'
      GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
      ORDER BY sale_date DESC
      LIMIT 30
    `);
    return rows;
  }
}

module.exports = Sale;
