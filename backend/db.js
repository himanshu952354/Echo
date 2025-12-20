import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
  try {
    // Use the MONGODB_URI from your .env file
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Atlas Connected");
  } catch (err) {
    console.error("MongoDB Error:", err.message);
    process.exit(1);
  }
};

export default connectDB;