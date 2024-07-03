const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Get messages between two users
router.get("/messages/:userId/:contactId", async (req, res) => {
  const { userId, contactId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving messages" });
  }
});

module.exports = router;
