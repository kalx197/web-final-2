const Product = require('../models/Product');
const Sale = require('../models/Sale');
const SaleItem = require('../models/SaleItem');
const { validationResult } = require('express-validator');
const logger = require('../middleware/logger');

exports.createSale = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, payment_method } = req.body;
    
    // Validate items and calculate total
    let total_amount = 0;
    const saleItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(400).json({ 
          message: `Product with id ${item.product_id} not found` 
        });
      }
      
      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock_quantity}` 
        });
      }
      
      const price_at_time = product.price;
      total_amount += price_at_time * item.quantity;
      
      saleItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_time: price_at_time
      });
    }

    // Create sale
    const saleId = await Sale.create({
      user_id: req.user.id,
      total_amount,
      payment_method,
      status: 'completed'
    });

    // Create sale items
    const saleItemsWithId = saleItems.map(item => ({
      ...item,
      sale_id: saleId
    }));
    
    await SaleItem.createMultiple(saleItemsWithId);

    // Update stock
    for (const item of items) {
      await Product.updateStock(item.product_id, item.quantity);
    }

    const sale = await Sale.findById(saleId);
    const saleItemsData = await Sale.getSaleItems(saleId);
    
    logger.info(`Sale created: #${saleId} by user ${req.user.username} for $${total_amount}`);
    
    res.status(201).json({
      message: 'Sale completed successfully',
      sale: {
        ...sale,
        items: saleItemsData
      }
    });
  } catch (error) {
    logger.error(`Create sale error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllSales = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const sales = await Sale.findAll({ status, startDate, endDate });
    res.json(sales);
  } catch (error) {
    logger.error(`Get sales error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    const items = await Sale.getSaleItems(req.params.id);
    res.json({ ...sale, items });
  } catch (error) {
    logger.error(`Get sale error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSalesStats = async (req, res) => {
  try {
    const stats = await Sale.getSalesStats();
    res.json(stats);
  } catch (error) {
    logger.error(`Get sales stats error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};
