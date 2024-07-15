const express = require("express");
const router = express.Router();

const { chatHandler } = require("../Controllers/chatController");

router.post("/", chatHandler);

module.exports = router;