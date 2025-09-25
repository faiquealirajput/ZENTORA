const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  commissionPercentage: { type: Number, default: 10 },
  categories: [String],
  paymentMethods: [{
    name: String,
    isActive: Boolean
  }],
  banners: [{
    title: String,
    image: String,
    link: String,
    isActive: Boolean
  }]
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);