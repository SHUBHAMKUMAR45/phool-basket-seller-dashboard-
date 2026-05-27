const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  id: mongoose.Schema.Types.Mixed,
  type: String,
  text: String,
  time: String,
});

module.exports = mongoose.model('Activity', ActivitySchema);
