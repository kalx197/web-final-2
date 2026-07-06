const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const { authenticate } = require('../middleware/auth');
const { validateSale } = require('../middleware/validation');

router.get('/', authenticate, saleController.getAllSales);
router.get('/stats', authenticate, saleController.getSalesStats);
router.get('/:id', authenticate, saleController.getSale);
router.post('/', authenticate, validateSale, saleController.createSale);

module.exports = router;
