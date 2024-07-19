const express = require("express");
const { chatHandler,getChatHistoryById, getConversationsByUserId } = require("../Controllers/chatController");
const router = express.Router();

// Route to handle chat messages
router.post("/", chatHandler);

// Route to fetch chat history for a conversation
router.get("/:conversationId", getChatHistoryById);

router.get("/conversations/:userId", getConversationsByUserId);

module.exports = router;
