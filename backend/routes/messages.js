const express = require("express");
const { isAuthenticated } = require("../config/authMiddleware");
const router = express.Router();
const {
  getMessages,
  getLastMessage,
} = require("../controllers/messagingController");

// Get messages between two users
router.get("/messages/:userId/:contactId", isAuthenticated, getMessages);

// Get last message between two users
router.get("/lastMessage/:userId/:contactId", isAuthenticated, getLastMessage);

module.exports = router;
