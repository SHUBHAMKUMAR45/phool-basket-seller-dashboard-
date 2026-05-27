const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const dashboardController = require("../controllers/dashboardController");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Banner = require("../models/Banner");
const Coupon = require("../models/Coupon");
const Inventory = require("../models/Inventory");
const Customer = require("../models/Customer");
const Activity = require("../models/Activity");

const router = express.Router();
router.use(authMiddleware);

function parseAmount(amountStr) {
  const num = parseInt(String(amountStr).replace(/[^\d]/g, ""), 10);
  return Number.isNaN(num) ? 0 : num;
}

router.get("/stats", async (req, res) => {
  const orders = await Order.find().lean();
  const products = await Product.find().lean();
  const banners = await Banner.find().lean();
  const coupons = await Coupon.find().lean();
  const inventory = await Inventory.find().lean();
  const customers = await Customer.find().lean();
  
  const totalOrders = orders.length;
  const pending = orders.filter((o) => o.status === "Pending" || o.status === "Preparing").length;
  const revenueToday = orders
    .filter((o) => o.date === "10/05/2026")
    .reduce((sum, o) => sum + parseAmount(o.amount), 0);
  const monthlyRev = orders.reduce((sum, o) => sum + parseAmount(o.amount), 0);
  const weeklyOrders = [60, 45, 80, 55, 95, 70, 85];

  res.json({
    success: true,
    stats: {
      totalOrders,
      revenueToday: revenueToday >= 1000 ? `₹${Math.round(revenueToday / 1000)}K` : `₹${revenueToday}`,
      pending,
      monthlyRev: monthlyRev >= 100000 ? `₹${(monthlyRev / 100000).toFixed(1)}L` : `₹${monthlyRev.toLocaleString("en-IN")}`,
      weeklyOrders,
    },
    platform: {
      products: products.length,
      banners: banners.length,
      coupons: coupons.length,
      lowStock: inventory.filter((i) => i.status !== "In Stock").length,
    },
    admin: {
      totalRevenue: "$48,329",
      totalSales: "2,847",
      ordersToday: String(totalOrders),
      activeCustomers: String(customers.length),
      topItems: [
        { label: "Roses", val: 85, color: "#ef4444" },
        { label: "Sunfl.", val: 72, color: "#f97316" },
        { label: "Lily", val: 60, color: "#22c55e" },
        { label: "Tulips", val: 38, color: "#a855f7" },
      ],
      recentOrders: orders.slice(0, 5).map((o) => ({
        id: o.id.replace("ORD", "#"),
        customer: o.customer,
        item: "Floral Order",
        amount: o.amount,
        status: o.status === "Preparing" ? "Processing" : o.status,
        sc: o.status === "Delivered" ? "#16a34a" : o.status === "Pending" ? "#d97706" : o.status === "Shipped" ? "#3b82f6" : "#3b82f6",
      })),
    },
  });
});

router.get("/activity", async (req, res) => {
  const activities = await Activity.find().lean();
  res.json({ success: true, activities: activities.map(a => { delete a._id; delete a.__v; return a; }) });
});

module.exports = router;
