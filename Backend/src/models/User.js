const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: { type: String, lowercase: true },
  phone: String,
  storeName: String,
  password: String,
  role: String,
  createdAt: String,
});

module.exports = mongoose.model('User', UserSchema);
