const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');

router.get('/', authenticate, productController.getAllProducts);
router.get('/low-stock', authenticate, productController.getLowStock);
router.get('/:id', authenticate, productController.getProduct);
router.post('/', authenticate, authorize('admin'), validateProduct, productController.createProduct);
router.put('/:id', authenticate, authorize('admin'), validateProduct, productController.updateProduct);
router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct);

module.exports = router;
