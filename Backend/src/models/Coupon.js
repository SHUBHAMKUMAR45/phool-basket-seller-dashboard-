const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  id: String,
  code: String,
  discount: String,
  minAmount: String,
  expiry: String,
  status: String,
});

module.exports = mongoose.model('Coupon', CouponSchema);
