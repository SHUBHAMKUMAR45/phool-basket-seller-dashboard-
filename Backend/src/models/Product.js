const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: String,
  stock: Number,
  category: String,
  discount: String,
  desc: String,
  image: String,
});

module.exports = mongoose.model('Product', ProductSchema);
