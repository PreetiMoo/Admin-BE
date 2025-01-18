const express = require('express');
const { auth, checkRole } = require('../middleware/auth');
const {
  placeOrder,
  getOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();


router.post('/', auth, checkRole('Employee'), placeOrder);


router.get('/', auth, getOrders);


router.patch('/:id', auth, checkRole('Manager'), updateOrderStatus);

module.exports = router;
