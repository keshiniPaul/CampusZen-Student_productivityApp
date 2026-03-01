const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set in environment variables.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    const connection = await mongoose.connect(process.env.DATABASE_URL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.log("Starting server without MongoDB connection...");
    // Don't exit, allow server to start anyway
  }
};

module.exports = connectDB;
