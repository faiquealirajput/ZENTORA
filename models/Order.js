const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cod', 'bank', 'easypaisa', 'jazzcash'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String
  },
  trackingNumber: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);