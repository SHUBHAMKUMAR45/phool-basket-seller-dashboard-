const ordersService = require('../services/ordersService');

async function list(req, res) {
  const orders = await ordersService.listOrders();
  res.json({ success: true, orders });
}

async function updateStatus(req, res) {
  const { status } = req.body;
  const valid = ['Pending', 'Preparing', 'Shipped', 'Delivered'];
  if (!valid.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status.' });
  const order = await ordersService.updateOrderStatus(req.params.id, status);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
  res.json({ success: true, order });
}

module.exports = { list, updateStatus };
