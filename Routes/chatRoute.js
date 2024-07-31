const express = require("express");
const { chatHandler,getChatHistoryById, getConversationsByUserId, startNewConversation } = require("../Controllers/chatController");
const router = express.Router();

// Route to handle chat messages
router.post("/", chatHandler);

// Route to fetch chat history for a conversation
router.get("/chathistory/:userId/conversations/:conversationId", getChatHistoryById);

router.get("/conversations/:userId", getConversationsByUserId);

router.post("/new", startNewConversation);

module.exports = router;
