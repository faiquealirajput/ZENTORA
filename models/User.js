const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
  phone: String,
  address: String,
  isVerified: { type: Boolean, default: false },
  wallet: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);