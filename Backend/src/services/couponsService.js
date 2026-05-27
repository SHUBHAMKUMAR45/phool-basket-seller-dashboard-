const Coupon = require('../models/Coupon');

async function listCoupons() {
  const docs = await Coupon.find().lean();
  return docs.map(d => { delete d._id; delete d.__v; return d; });
}

module.exports = { listCoupons };
