const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  id: String,
  title: String,
  message: String,
  category: String,
  sentAt: String,
  reached: Number,
  status: String,
});

module.exports = mongoose.model('Notification', NotificationSchema);
