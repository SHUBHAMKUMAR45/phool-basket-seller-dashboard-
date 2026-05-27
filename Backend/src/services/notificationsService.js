const Notification = require('../models/Notification');

async function listNotifications() {
  const docs = await Notification.find().lean();
  return docs.map(d => { delete d._id; delete d.__v; return d; });
}

module.exports = { listNotifications };
