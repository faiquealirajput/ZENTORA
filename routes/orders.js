const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { items, paymentMethod, shippingAddress } = req.body;
    
    let totalAmount = 0;
    const orderItems = [];
    
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        seller: product.seller
      });
      
      totalAmount += product.price * item.quantity;
    }
    
    const order = new Order({
      user: req.user.userId,
      items: orderItems,
      totalAmount,
      paymentMethod,
      shippingAddress
    });
    
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;