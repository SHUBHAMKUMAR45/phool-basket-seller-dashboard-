const mongoose = require('mongoose');
const { defaultDb } = require('../store');

async function init() {
  const url = process.env.MONGO_URL || process.env.MONGODB_URI;
  if (!url) {
    console.log('ℹ MONGO_URL not set - running without MongoDB. Using file-based DB.');
    return;
  }
  try {
    await mongoose.connect(url, { dbName: process.env.MONGO_DB_NAME || 'phool_basket' });
    console.log('✓ Mongoose connected to MongoDB');
    
    // Import all models
    const User = require('../models/User');
    const Product = require('../models/Product');
    const Order = require('../models/Order');
    const Customer = require('../models/Customer');
    const Inventory = require('../models/Inventory');
    const Coupon = require('../models/Coupon');
    const Banner = require('../models/Banner');
    const Notification = require('../models/Notification');
    const Activity = require('../models/Activity');
    
    const models = { User, Product, Order, Customer, Inventory, Coupon, Banner, Notification, Activity };
    const collectionNames = { users: User, products: Product, orders: Order, customers: Customer, inventory: Inventory, coupons: Coupon, banners: Banner, notifications: Notification, activities: Activity };
    
    // Seed if empty
    for (const [key, Model] of Object.entries(collectionNames)) {
      const count = await Model.countDocuments();
      if (count === 0) {
        const seed = defaultDb[key] || [];
        if (seed.length > 0) {
          await Model.insertMany(seed.map(d => Object.assign({}, d)));
          console.log(`✓ Seeded ${key} collection`);
        }
      }
    }
  } catch (err) {
    console.error('✗ Mongoose connection failed:', err.message);
    throw err;
  }
}

module.exports = { init };
