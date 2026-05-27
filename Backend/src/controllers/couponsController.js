const couponsService = require('../services/couponsService');

async function list(req, res) {
  const coupons = await couponsService.listCoupons();
  res.json({ success: true, coupons });
}

module.exports = { list };
