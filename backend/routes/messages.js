const express = require("express");
const router = express.Router();
const {
  getMessages,
  getLastMessage,
} = require("../controllers/messagingController");

// Get messages between two users
router.get("/messages/:userId/:contactId", getMessages);

// Get last message between two users
router.get("/lastMessage/:userId/:contactId", getLastMessage);

module.exports = router;
