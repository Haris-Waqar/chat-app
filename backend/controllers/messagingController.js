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

module.exports = { getMessages };
