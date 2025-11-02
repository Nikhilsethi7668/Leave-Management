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
  getAdminAnalytics,
  getPendingLeaves,
} from "../Controllers/Leaves.controller.js";
import { auth, isAdmin } from "../Middlewares/auth.middleware.js";

// Set total leaves for all users - only admin/superadmin can do this
router.post("/total-leaves", auth, isAdmin, setTotalLeaves);

// Create Leave Category - only admin/superadmin can do this
router.post("/categories", auth, isAdmin, createLeaveCategory);

// Get Admin Analytics]
router.get("/analytics/admin", auth, isAdmin, getAdminAnalytics);

router.get("/pending", auth, isAdmin, getPendingLeaves);

// Get all Leave Categories
router.get("/categories", auth, getAllLeaveCategories);

router.get("/applications", auth, isAdmin, getAllLeaveApplications);

// Apply for leave - accessible to all authenticated users
router.post("/apply", auth, applyForLeave);

// Review leave application - only admin/superadmin can do this
router.post("/review/:leaveId", auth, isAdmin, reviewLeaveApplication);

// Get leave history for a specific user - accessible to admin/superadmin and the user themselves
router.get("/history/:userId", auth, getLeaveHistoryForUser);

// Get Leave Analytics for a specific user
router.get("/analytics/:userId", auth, getLeaveAnalyticsForUser);

export default router;
