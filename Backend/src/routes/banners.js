const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { authMiddleware } = require("../middleware/auth");
const bannersController = require("../controllers/bannersController");
const Banner = require("../models/Banner");

const router = express.Router();
router.use(authMiddleware);

router.get("/", bannersController.list);

router.post("/", async (req, res) => {
  const { title, type, image } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: "Title is required." });
  }

  const banner = new Banner({
    id: uuidv4(),
    title,
    type: type || "Promo",
    image: image || "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400&q=80",
  });

  await banner.save();
  const obj = banner.toObject(); delete obj._id; delete obj.__v;
  res.status(201).json({ success: true, banner: obj });
});

router.delete("/:id", async (req, res) => {
  const result = await Banner.findOneAndDelete({ id: req.params.id });
  if (!result) {
    return res.status(404).json({ success: false, message: "Banner not found." });
  }
  res.json({ success: true });
});

module.exports = router;
