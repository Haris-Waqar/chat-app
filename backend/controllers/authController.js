const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Register a New User
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check If The Input Fields are Valid
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please Input Username and Password" });
    }

    // Check If User Exists In The Database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    // Save The User To The Database
    const newUser = new User({ username, email, password });
    await newUser.save();

    return res
      .status(201)
      .json({ message: "User Created Successfully", user: newUser });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error Creating User" });
  }
};

// Login a User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check If The Input Fields are Valid
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please Input Username and Password" });
    }

    // Check If User Exists In The Database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User Does Not Exist" });
    }

    // Check If Password Matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY || "1234!@#%<{*&)",
      { expiresIn: "1h" }
    );

    console.log("TOKEN", token);

    return res
      .status(200)
      .json({ message: "Login Successful", data: user, token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error Logging In" });
  }
};

module.exports = {
  register,
  login,
};
