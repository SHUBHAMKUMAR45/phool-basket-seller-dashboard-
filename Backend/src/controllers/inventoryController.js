const inventoryService = require('../services/inventoryService');

async function list(req, res) {
  const inventory = await inventoryService.listInventory();
  res.json({ success: true, inventory });
}

module.exports = { list };
