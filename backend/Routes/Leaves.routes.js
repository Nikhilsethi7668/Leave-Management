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
  getAllUpcomingLeave,
  deleteLeaveApplication,
  deleteLeaveCategory,
} from "../Controllers/Leaves.controller.js";
import { auth, isAdmin } from "../Middlewares/auth.middleware.js";

// Set total leaves for all users - only admin/superadmin can do this
router.post("/total-leaves", auth, isAdmin, setTotalLeaves);

// Create Leave Category - only admin/superadmin can do this
router.post("/categories", auth, isAdmin, createLeaveCategory);

//Delete Leave Category - only admin/superadmin can do this
router.delete("/categories/:categoryId", auth, isAdmin, deleteLeaveCategory);

// Get Admin Analytics]
router.get("/analytics/admin", auth, isAdmin, getAdminAnalytics);

router.get("/pending", auth, isAdmin, getPendingLeaves);

router.get("/upcoming", auth, isAdmin, getAllUpcomingLeave);

router.delete("/leave/:leaveId", auth, deleteLeaveApplication);

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
router.get("/user/analytics", auth, getLeaveAnalyticsForUser);

export default router;
