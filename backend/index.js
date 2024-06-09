const express = require("express");

const cors = require("cors");
const dotenv = require("dotenv");
const { connectDb } = require("./config/database");
const { readdirSync } = require("fs");

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

// Listened to the PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
