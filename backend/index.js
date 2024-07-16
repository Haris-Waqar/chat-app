const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDb } = require("./config/database");
const { readdirSync } = require("fs");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const Message = require("./models/Message");

dotenv.config();

const app = express();

// Middlewares
app.use(cors()); // Cross-Origin Resource Sharing

app.use(express.json()); // this use function that is available with express to parse json data. when we send data from client to server, we send data in json format so we need to parse it.

// Initialized Database Configuration
connectDb();

// Port
const PORT = process.env.PORT || 8000;

// ****Setting up routes****
readdirSync("./routes").map((r) =>
  app.use("/api/v1", require(`./routes/${r}`))
);

// Root Entry
app.get("/", (req, res) => {
  res.send("Welcome to the ChatApp");
});

const server = createServer(app);
const io = new Server(server);
let onlineUsers = [];
io.on("connection", (socket) => {
  socket.removeAllListeners();
  console.log(`User connected with Socket ID ${socket.id}`);

  // listen to a connection
  socket.on("addNewUser", async (userId) => {
    console.log("UserId is::", userId, "Socket ID is::", socket.id);
    // first check we don't have the user already
    const existingUser = onlineUsers.find((user) => user.userId === userId);
    if (existingUser) {
      console.log("User already exists");
      //   assign the new socket id to the existing user
      existingUser.socketId = socket.id;
      return;
    }

    // Add the new user to the list of online users
    console.log(`Adding user with ID: ${userId}`);
    onlineUsers.push({
      userId,
      socketId: socket.id,
    });
    console.log("Online Users", onlineUsers);
    // Emit online users
    io.emit("getOnlineUsers", onlineUsers);

    // Check for undelivered messages
    try {
      const undeliveredMessages = await Message.find({
        receiverId: userId,
        status: "sent",
      });
      console.log("Undelivered Messages", undeliveredMessages);
      if (undeliveredMessages) {
        for (const msg of undeliveredMessages) {
          msg.status = "delivered";
          await msg.save();
          console.log("Message status updated to delivered", msg);
          console.log("Socket ID", socket.id);

          io.to(socket.id).emit("messageDelivered", {
            message_random_id: savedMessage.message_random_id,
            status: "delivered",
          });
        }
        console.log(
          "Undelivered messages updated to delivered",
          undeliveredMessages
        );
      }
    } catch (error) {
      console.log("Error getting undelivered messages", error);
    }
  });

  // listen to a private message
  socket.on("sendMessage", async (msgObj) => {
    console.log(" message from client side", msgObj);
    console.log("Who is Online:::", onlineUsers);
    let sender = onlineUsers.find((user) => user.userId === msgObj.senderId);
    let user = onlineUsers.find((user) => user.userId === msgObj.receiverId);
    // Save message to the database
    const newMessage = new Message({
      senderId: msgObj.senderId,
      receiverId: msgObj.receiverId,
      message: msgObj.updateMessage,
      time: msgObj.time,
      status: user ? "delivered" : "sent",
      message_random_id: msgObj.message_random_id,
    });

    console.log("New Message ===>>>>>", newMessage);

    try {
      const savedMessage = await newMessage.save();
      console.log("Message saved to the database", savedMessage);

      console.log("Is user online", user, "Is sender online", sender);
      if (user) {
        console.log("User is online");
        console.log(`Sending message to user with ID: ${msgObj.receiverId}`);
        console.log("sending the msgOBj", msgObj);
        io.to(user.socketId).emit("getMessage", msgObj);
        // Emit messageDelivered event to the sender
        console.log("who is the user?", user);
        io.to(sender.socketId).emit("messageDelivered", {
          message_random_id: savedMessage.message_random_id,
          status: "delivered",
        });
        console.log("Message Delivered", savedMessage.message_random_id);
      }
    } catch (error) {
      console.log("Error saving message to the database", error);
    }
  });

  // Handling the message delivered
  socket.on("messageDelivered", (msgObj) => {
    // Update the message status to delivered in the database

    //  check if the receiver is online then we will update the status to delivered
    if (!user) {
      console.log("User is not online");
      return;
    }

    Message.updateOne(
      { message_random_id: msgObj.message_random_id },
      { status: "delivered" },
      (err, result) => {
        if (err) {
          console.log("Error updating message status to delivered", err);
          return;
        }
        console.log("Message status updated to delivered", result);
      }
    );
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
    const index = onlineUsers.findIndex((user) => user.socketId === socket.id);
    if (index > -1) {
      onlineUsers.splice(index, 1);
    }
    console.log("Online Users", onlineUsers);
    // Emit online users
    io.emit("getOnlineUsers", onlineUsers);
  });
});

// Listening to the PORT
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
