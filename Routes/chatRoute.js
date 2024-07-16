const express = require("express");
const { chatHandler,getChatHistoryById } = require("../Controllers/chatController");
const router = express.Router();

// Route to handle chat messages
router.post("/", chatHandler);

// Route to fetch chat history for a conversation
router.get("/:conversationId", getChatHistoryById);

module.exports = router;
