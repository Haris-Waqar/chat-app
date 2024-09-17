const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    // Extract the token and remove quotes if present
    let token = req.headers.authorization;
    token = token.replace(/['"]/g, ""); // Remove any quotes from the token

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      throw new Error();
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error Validating Token" });
  }
};

module.exports = {
  isAuthenticated,
};
