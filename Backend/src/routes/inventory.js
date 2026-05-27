const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const inventoryController = require("../controllers/inventoryController");

const router = express.Router();
router.use(authMiddleware);

router.get("/", inventoryController.list);

module.exports = router;
