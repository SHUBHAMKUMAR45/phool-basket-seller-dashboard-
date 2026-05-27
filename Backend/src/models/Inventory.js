const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  id: mongoose.Schema.Types.Mixed,
  name: String,
  stock: Number,
  unit: String,
  status: String,
});

module.exports = mongoose.model('Inventory', InventorySchema);
