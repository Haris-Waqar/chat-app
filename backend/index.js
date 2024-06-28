const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDb } = require("./config/database");
const { readdirSync } = require("fs");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

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
  socket.on("addNewUser", (userId) => {
    console.log("UserId is", userId);
    // first check we don't have the user already
    const existingUser = onlineUsers.find((user) => user.userId === userId);
    if (existingUser) {
      console.log("User already exists");
      return;
    }

    // Add the new user to the list of online users
    console.log(`Adding user with ID: ${userId}`);
    onlineUsers.push({
      userId,
      socketId: socket.id,
    });
    console.log("Online Users", onlineUsers);
  });

  // listen to a private message
  socket.on("sendMessage", (msgObj) => {
    const user = onlineUsers.find((user) => user.userId === msgObj.receiverId);
    if (user) {
      console.log(`Sending message to user with ID: ${msgObj.receiverId}`);
      io.to(user.socketId).emit("getMessage", msgObj);
    }
    // socket.emit("message", {
    //   sender: "bot",
    //   message: "Thank you. Please wait for a moment",
    //   time: new Date().toLocaleTimeString(),
    // });
    // let newMessage = msgObj.message;
    // console.log(socket.id);
    // socket.to(msgObj.to).emit("private message", {
    //   newMessage,
    //   from: socket.id,
    // });
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
    const index = onlineUsers.findIndex((user) => user.socketId === socket.id);
    if (index > -1) {
      onlineUsers.splice(index, 1);
    }
    console.log("Online Users", onlineUsers);
  });
});

// Listening to the PORT
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
