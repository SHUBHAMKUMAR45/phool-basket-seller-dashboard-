const express = require("express");
const cors = require("cors");
require('dotenv').config();
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const customerRoutes = require("./routes/customers");
const inventoryRoutes = require("./routes/inventory");
const couponRoutes = require("./routes/coupons");
const bannerRoutes = require("./routes/banners");
const notificationRoutes = require("./routes/notifications");
const analyticsRoutes = require("./routes/analytics");
const dashboardRoutes = require("./routes/dashboard");

const db = require("./db/connection");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Phool Basket API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error." });
});

async function start() {
  try {
    await db.init();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Phool Basket API listening on http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize store:", err);
    process.exit(1);
  }
}

start();
