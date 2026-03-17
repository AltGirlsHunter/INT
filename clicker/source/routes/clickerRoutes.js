const express = require("express");
const router = express.Router();
const controller = require("../controllers/clickerController");

router.get("/", controller.renderClicker);
router.post("/click", controller.incrementClick);
router.get("/state", controller.getState);

module.exports = router;