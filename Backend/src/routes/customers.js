const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const customersController = require("../controllers/customersController");

const router = express.Router();
router.use(authMiddleware);

router.get("/", customersController.list);

module.exports = router;
