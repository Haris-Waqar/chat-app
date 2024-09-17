const express = require("express");
const { getUsers } = require("../controllers/userController");
const { isAuthenticated } = require("../config/authMiddleware");

const router = express.Router();

router.get("/getAllUsers", isAuthenticated, getUsers);

module.exports = router;
