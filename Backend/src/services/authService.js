const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

async function findUserByEmail(email) {
  return User.findOne({ email: email.toLowerCase() }).lean();
}

async function findUserById(id) {
  return User.findOne({ id }).lean();
}

async function createUser({ name, email, phone, storeName, password }) {
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({
    id: uuidv4(),
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    storeName: storeName || '',
    password: hashed,
    role: 'seller',
    createdAt: new Date().toISOString(),
  });
  const saved = await user.save();
  const obj = saved.toObject();
  delete obj._id;
  delete obj.__v;
  return obj;
}

async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.password);
}

module.exports = { findUserByEmail, findUserById, createUser, verifyPassword };
