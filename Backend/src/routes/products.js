const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const productsController = require("../controllers/productsController");

const router = express.Router();
router.use(authMiddleware);

router.get("/", productsController.list);
router.post("/", productsController.create);
router.delete("/:id", productsController.remove);
router.post("/ai-scan", productsController.aiScan);

module.exports = router;
