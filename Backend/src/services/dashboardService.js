const Order = require('../models/Order');
const Product = require('../models/Product');
const Activity = require('../models/Activity');

async function getDashboard() {
  const recentOrders = await Order.find().limit(5).lean();
  const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).lean();
  const activities = await Activity.find().limit(10).lean();
  
  return {
    recentOrders: recentOrders.map(d => { delete d._id; delete d.__v; return d; }),
    lowStockProducts: lowStockProducts.map(d => { delete d._id; delete d.__v; return d; }),
    activities: activities.map(d => { delete d._id; delete d.__v; return d; }),
  };
}

module.exports = { getDashboard };
