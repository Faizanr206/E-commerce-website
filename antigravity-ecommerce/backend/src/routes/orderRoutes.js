const express = require('express');
const router = express.Router();
const {
  createCheckoutSession,
  confirmOrderPayment,
  getOrders,
  updateOrderToDelivered,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/create-session', protect, createCheckoutSession);
router.post('/confirm', protect, confirmOrderPayment);

// Admin routes
router.get('/', protect, admin, getOrders);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

module.exports = router;
