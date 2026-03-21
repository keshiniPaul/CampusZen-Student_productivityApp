const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set in environment variables.");
    process.exit(1);
  }

  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.log("Starting server without MongoDB connection...");
    // Don't exit, allow server to start anyway
  }
};

module.exports = connectDB;
