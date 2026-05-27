const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { authMiddleware } = require("../middleware/auth");
const notificationsController = require("../controllers/notificationsController");
const Notification = require("../models/Notification");

const router = express.Router();
router.use(authMiddleware);

router.get("/", notificationsController.list);

router.post("/", async (req, res) => {
  const { title, message, category } = req.body;
  if (!title || !message) {
    return res.status(400).json({ success: false, message: "Title and message are required." });
  }

  const notification = new Notification({
    id: uuidv4(),
    title,
    message,
    category: category || "Promotion",
    sentAt: new Date().toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
    reached: Math.floor(Math.random() * 2000) + 4000,
    status: "Sent",
  });

  await notification.save();
  const obj = notification.toObject(); delete obj._id; delete obj.__v;
  res.status(201).json({ success: true, notification: obj });
});

module.exports = router;
