const Message = require("../models/Message");

const getMessages = async (req, res) => {
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
};

// Get Last Message
const getLastMessage = async (req, res) => {
  const { userId, contactId } = req.params;

  try {
    const lastMessage = await Message.find(
      {
        $or: [
          { senderId: userId, receiverId: contactId },
          { senderId: contactId, receiverId: userId },
        ],
      },
      null,
      { sort: { timestamp: -1 } }
    );

    console.log(lastMessage);

    if (!lastMessage) {
      return res.json({ message: "No messages found" });
    }
    // Send last element of lastMessage array

    res.json(lastMessage[lastMessage.length - 1]);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving last message" });
  }
};

module.exports = { getMessages, getLastMessage };
