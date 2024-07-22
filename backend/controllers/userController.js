const User = require("../models/user");

// Fetch All Users From The Database

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Error Fetching Users" });
  }
};

module.exports = { getUsers };
