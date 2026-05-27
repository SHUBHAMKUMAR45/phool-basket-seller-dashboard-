const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  phone: String,
  orders: Number,
  spent: String,
  joined: String,
});

module.exports = mongoose.model('Customer', CustomerSchema);
