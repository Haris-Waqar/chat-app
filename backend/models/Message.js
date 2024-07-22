const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
  },
  receiverId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
  time: {
    type: String,
    required: true,
  },
  message_random_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Messages", messageSchema);
