const mongoose = require("mongoose");

exports.connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      w: "majority", // Correct write concern
    });
    console.log("MongoDB connection Established...");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};
