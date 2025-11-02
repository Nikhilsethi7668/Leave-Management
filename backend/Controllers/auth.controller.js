import mongoose from "mongoose";
import User from "../Models/User.js";
import bcrypt from "bcrypt";
import Department from "../Models/Department.js";
import { generateToken } from "../Middlewares/auth.middleware.js";
import LeaveAnalytics from "../Models/LeaveAnalytics.js";
import TotalLeaves from "../Models/TotalLeaves.js";

//THIS WILL HELP US TO REGISTER NEW USER
export const signup = async (req, res) => {
  try {
    let { name, email, password, post, departmentId } = req.body;
    email = email.toLowerCase().trim();
    name = name.trim();
    post = post.trim();

    if (!name || !email || !password || !post || !departmentId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(400).json({ message: "Invalid Department" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      post,
      department: departmentId,
    });
    await newUser.save();
    return res.status(201).json({
      message:
        "User registered successfully ! Request sent to admin for approval",
    });
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};

// User login
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase().trim();
    password = password.trim();

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (!user.isActive) {
      return res
        .status(403)
        .json({ message: "Account is not active , Contact Admin" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    res.cookie("jwt", token, { httpOnly: true, secure: false });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("department");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      message: "Authentication failed, Please login again",
    });
  }
};

//Approve request - Admin will approve user account
export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isActive = true;
    await user.save();
    const totalLeaveData = await TotalLeaves.findOne().sort({ createdAt: -1 });

    const leaveAnalytics = await LeaveAnalytics.findOne({ user: user._id });
    if (!leaveAnalytics) {
      await LeaveAnalytics.create({
        user: user._id,
        totalLeavesAllocated: totalLeaveData?.totalAnnualPaidLeaves,
        totalLeavesTaken: 0,
        totalPaidLeavesTaken: 0,
        totalUnpaidLeavesTaken: 0,
        // paidLeavesRemaining: totalLeaveData?.totalAnnualPaidLeaves,
        leavesRemaining: totalLeaveData?.totalAnnualPaidLeaves,
        lastUpdated: new Date(),
      });
    }
    return res.status(200).json({ message: "User approved successfully" });
  } catch (error) {
    console.error("Error during user approval:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};

//Logout user
export const logout = (req, res) => {
  res.clearCookie("jwt");
  return res.status(200).json({ message: "Logout successful" });
};

//Mark user as inactive - Admin will deactivate user account
export const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = false;
    await user.save();

    return res.status(200).json({ message: "User deactivated successfully" });
  } catch (error) {
    console.error("Error during user deactivation:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Pagination params
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();
    const users = await User.find()
      .select("-password")
      .populate("department")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      docs: users,
      totalPages: Math.ceil(totalUsers / limit),
      page,
      totalUsers,
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};
