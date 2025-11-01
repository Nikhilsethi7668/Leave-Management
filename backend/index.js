import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./Config/db.js";
import userRoutes from "./Routes/User.routes.js";
import departmentRoutes from "./Routes/Department.routes.js";
import leaveRoutes from "./Routes/Leaves.routes.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

//All routes here
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);

// Connect to MongoDB
try {
  await connectDB();
} catch (error) {
  console.error("Failed to connect to the database:", error);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
