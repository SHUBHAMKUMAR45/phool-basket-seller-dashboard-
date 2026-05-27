const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  id: String,
  customer: String,
  amount: String,
  status: String,
  payment: String,
  date: String,
  email: String,
  phone: String,
});

module.exports = mongoose.model('Order', OrderSchema);
