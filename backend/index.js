const express = require("express");
const dotenv = require("dotenv");
const { connectDb } = require("./config/database");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Iinitialized Database Configuration
connectDb();

app.use(express.json());

// Use routes
app.use("/api/v1/auth", authRoutes);

// Root Entry
app.get("/", (req, res) => {
  res.send("Welcome to the ChatApp");
});

// Listened to the PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
