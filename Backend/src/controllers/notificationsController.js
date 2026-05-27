const notificationsService = require('../services/notificationsService');

async function list(req, res) {
  const notifications = await notificationsService.listNotifications();
  res.json({ success: true, notifications });
}

module.exports = { list };
