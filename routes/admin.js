const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const router = express.Router();

// Admin middleware
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

// Get dashboard stats
router.get('/dashboard', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update commission percentage
router.put('/commission', auth, adminAuth, async (req, res) => {
  try {
    const { percentage } = req.body;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ commissionPercentage: percentage });
    } else {
      settings.commissionPercentage = percentage;
    }
    
    await settings.save();
    res.json({ message: 'Commission updated successfully', percentage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve/reject products
router.put('/products/:id/approve', auth, adminAuth, async (req, res) => {
  try {
    const { isApproved } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { isApproved });
    res.json({ message: 'Product status updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;