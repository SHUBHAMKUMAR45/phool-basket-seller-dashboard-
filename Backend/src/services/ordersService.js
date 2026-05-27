const Order = require('../models/Order');
const Activity = require('../models/Activity');

async function listOrders() {
  const docs = await Order.find().lean();
  return docs.map(d => { delete d._id; delete d.__v; return d; });
}

async function updateOrderStatus(id, status) {
  const order = await Order.findOneAndUpdate({ id }, { status }, { new: true }).lean();
  if (order) {
    await Activity.create({ id: Date.now(), type: 'order', text: `Order ${order.id} updated to ${status}`, time: 'Just now' });
    delete order._id; delete order.__v;
  }
  return order;
}

module.exports = { listOrders, updateOrderStatus };
