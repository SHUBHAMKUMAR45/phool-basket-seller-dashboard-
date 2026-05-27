const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { authMiddleware } = require("../middleware/auth");
const couponsController = require("../controllers/couponsController");
const Coupon = require("../models/Coupon");
const Activity = require("../models/Activity");

const router = express.Router();
router.use(authMiddleware);

router.get("/", couponsController.list);

router.post("/", async (req, res) => {
  const { code, discount, minAmount, expiry } = req.body;
  if (!code || !discount) {
    return res.status(400).json({ success: false, message: "Code and discount are required." });
  }

  const coupon = new Coupon({
    id: uuidv4(),
    code: code.toUpperCase(),
    discount,
    minAmount: minAmount || "₹0",
    expiry: expiry || "",
    status: "Active",
  });

  await coupon.save();
  await Activity.create({ id: Date.now(), type: "coupon", text: `Coupon ${coupon.code} created`, time: "Just now" });
  
  const obj = coupon.toObject(); delete obj._id; delete obj.__v;
  res.status(201).json({ success: true, coupon: obj });
});

module.exports = router;
