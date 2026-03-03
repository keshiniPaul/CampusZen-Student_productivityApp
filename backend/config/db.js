const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set in environment variables.");
    process.exit(1);
  }

  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
