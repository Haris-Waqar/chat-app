const express = require("express");
const router = express.Router();
const { getMessages } = require("../controllers/messagingController");

// Get messages between two users
router.get("/messages/:userId/:contactId", getMessages);

module.exports = router;
