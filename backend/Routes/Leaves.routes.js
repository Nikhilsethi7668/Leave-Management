import express from "express";
const router = express.Router();
import {
  setTotalLeaves,
  createLeaveCategory,
  getAllLeaveCategories,
  getAllLeaveApplications,
  getLeaveAnalyticsForUser,
  applyForLeave,
  reviewLeaveApplication,
  getLeaveHistoryForUser,
} from "../Controllers/Leaves.controller.js";
import { isAdmin } from "../Middlewares/auth.middleware.js";

// Set total leaves for all users - only admin/superadmin can do this
router.post("/total-leaves", isAdmin, setTotalLeaves);

// Create Leave Category - only admin/superadmin can do this
router.post("/categories", isAdmin, createLeaveCategory);

// Get all Leave Categories
router.get("/categories", getAllLeaveCategories);

router.get("/applications", isAdmin, getAllLeaveApplications);

// Apply for leave - accessible to all authenticated users
router.post("/apply", applyForLeave);

// Review leave application - only admin/superadmin can do this
router.patch("/review/:leaveId", isAdmin, reviewLeaveApplication);

// Get leave history for a specific user - accessible to admin/superadmin and the user themselves
router.get("/history/:userId", getLeaveHistoryForUser);

// Get Leave Analytics for a specific user
router.get("/analytics/:userId", getLeaveAnalyticsForUser);

export default router;
