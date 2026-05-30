const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

const defaultDb = {
  users: [],
  products: [],
  orders: [],
  customers: [],
  inventory: [],
  coupons: [],
  banners: [],
  notifications: [],
  activities: [],
};

module.exports = { defaultDb };
