const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/auth");
const { findUserByEmail, createUser, verifyPassword } = require("../services/authService");

function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

async function register(req, res) {
  const { name, email, phone, storeName, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: "Name, email and password are required." });
  }
  const existing = await findUserByEmail(email);
  if (existing) return res.status(409).json({ success: false, message: "User with this email already exists." });
  const user = await createUser({ name, email, phone, storeName, password });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ success: true, token, user: sanitizeUser(user) });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required." });
  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ success: false, message: "Invalid email or password." });
  const valid = await verifyPassword(user, password);
  if (!valid) return res.status(401).json({ success: false, message: "Invalid email or password." });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ success: true, token, user: sanitizeUser(user) });
}

function me(req, res) {
  const { findUserById } = require('../services/authService');
  findUserById(req.user.id).then((user) => {
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user: sanitizeUser(user) });
  }).catch(err => {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  });
}

module.exports = { register, login, me };
