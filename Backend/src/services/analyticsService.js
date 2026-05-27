const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

async function getAnalytics() {
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalCustomers = await Customer.countDocuments();
  
  return {
    totalOrders,
    totalProducts,
    totalCustomers,
    orderGrowth: '+12%',
    revenue: '₹5,24,000',
    timeFrame: 'This Month'
  };
}

module.exports = { getAnalytics };
