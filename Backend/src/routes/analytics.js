const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const analyticsController = require("../controllers/analyticsController");
const Product = require("../models/Product");
const Order = require("../models/Order");

const router = express.Router();
router.use(authMiddleware);

function parseAmount(amountStr) {
  const num = parseInt(String(amountStr).replace(/[^\d]/g, ""), 10);
  return Number.isNaN(num) ? 0 : num;
}

router.get("/", async (req, res) => {
  const products = await Product.find().lean();
  const orders = await Order.find().lean();
  
  const monthlyRevenue = [30, 45, 60, 40, 80, 95, 70, 85, 100, 75, 90, 110];
  const categorySales = [
    { label: "Roses", percent: 40, color: "#ec4899" },
    { label: "Wedding", percent: 30, color: "#3b82f6" },
    { label: "Birthday", percent: 20, color: "#10b981" },
    { label: "Others", percent: 10, color: "#f59e0b" },
  ];
  const topProducts = products.slice(0, 3).map((p, i) => ({
    name: p.name,
    sales: String(450 - i * 130),
    growth: `+${15 - i * 7}%`,
  }));
  const totalRevenue = orders.reduce((sum, o) => sum + parseAmount(o.amount), 0);

  res.json({
    success: true,
    monthlyRevenue,
    categorySales,
    metrics: {
      monthlyProfit: "₹45,200",
      orderGrowth: "24%",
      totalRevenue,
    },
    topProducts: topProducts.length ? topProducts : [
      { name: "Red Rose Bouquet", sales: "450", growth: "+15%" },
      { name: "Pink Lilies", sales: "320", growth: "+8%" },
      { name: "Wedding Special", sales: "210", growth: "+20%" },
    ],
  });
});

module.exports = router;
