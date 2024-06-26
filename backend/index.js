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

io.on("connection", (socket) => {
  socket.removeAllListeners();
  console.log("a user connected");

  socket.on("sendMessage", (msgObj) => {
    console.log("message:", msgObj.name + msgObj.message);
    socket.emit("message", {
      sender: "bot",
      message: "Thank you. Please wait for a moment",
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

// Listened to the PORT
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
