const customersService = require('../services/customersService');

async function list(req, res) {
  const customers = await customersService.listCustomers();
  res.json({ success: true, customers });
}

module.exports = { list };
