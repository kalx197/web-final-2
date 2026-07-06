const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const logger = require('../middleware/logger');

exports.getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    const products = await Product.findAll({ category, minPrice, maxPrice, search });
    
    const lowStock = await Product.getLowStock();
    
    res.json({
      products,
      lowStockCount: lowStock.length,
      total: products.length
    });
  } catch (error) {
    logger.error(`Get products error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    logger.error(`Get product error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Only admins can create products
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const productId = await Product.create(req.body);
    const product = await Product.findById(productId);
    
    logger.info(`Product created: ${product.name} by user ${req.user.username}`);
    
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    logger.error(`Create product error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Only admins can update products
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updated = await Product.update(req.params.id, req.body);
    if (!updated) {
      return res.status(400).json({ message: 'Update failed' });
    }

    const updatedProduct = await Product.findById(req.params.id);
    logger.info(`Product updated: ${updatedProduct.name} by user ${req.user.username}`);
    
    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    logger.error(`Update product error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    // Only admins can delete products
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const deleted = await Product.delete(req.params.id);
    if (!deleted) {
      return res.status(400).json({ message: 'Delete failed' });
    }

    logger.info(`Product deleted: ${product.name} by user ${req.user.username}`);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    logger.error(`Delete product error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLowStock = async (req, res) => {
  try {
    const threshold = req.query.threshold || 10;
    const products = await Product.getLowStock(threshold);
    res.json(products);
  } catch (error) {
    logger.error(`Get low stock error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};
