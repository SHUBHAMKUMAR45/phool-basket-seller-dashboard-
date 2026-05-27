const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const ordersController = require("../controllers/ordersController");

const router = express.Router();
router.use(authMiddleware);

router.get("/", ordersController.list);
router.patch("/:id/status", ordersController.updateStatus);

module.exports = router;
