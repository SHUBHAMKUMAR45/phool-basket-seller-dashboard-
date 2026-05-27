const Inventory = require('../models/Inventory');

async function listInventory() {
  const docs = await Inventory.find().lean();
  return docs.map(d => { delete d._id; delete d.__v; return d; });
}

module.exports = { listInventory };
