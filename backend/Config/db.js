import mongoose from "mongoose";
import dotenv from "dotenv";

//This will help us to load the environment variables from the .env file
dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://leavemanagement:leavemanagement@cluster0.oymkjdn.mongodb.net/?appName=Cluster0";
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  } finally {
    console.log("connectDB function executed");
  }
};
