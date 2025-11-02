import User from "../Models/User.js";
import Leave from "../Models/Leave.js";
import LeaveAnalytics from "../Models/LeaveAnalytics.js";
import TotalLeaves from "../Models/TotalLeaves.js";
import { sendEmail } from "../Services/Email.Service.js";
import LeaveCategory from "../Models/LeaveCategory.js";

//Set total leaves for all users - only admin/superadmin can do this
export const setTotalLeaves = async (req, res) => {
  try {
    const { totalAnnualPaidLeaves, departmentId } = req.body;
    if (totalAnnualPaidLeaves == null || totalAnnualPaidLeaves < 0) {
      return res.status(400).json({
        message: "Total annual paid leaves must be a non-negative number",
      });
    }
    if (!departmentId) {
      return res.status(400).json({
        message: "Department ID is required",
      });
    }

    let totalLeavesRecord = await TotalLeaves.findOne({
      department: departmentId,
    });
    if (totalLeavesRecord) {
      totalLeavesRecord.totalAnnualPaidLeaves = totalAnnualPaidLeaves;
      await totalLeavesRecord.save();
    } else {
      totalLeavesRecord = await TotalLeaves.create({
        totalAnnualPaidLeaves,
        department: departmentId,
      });
    }
    return res
      .status(200)
      .json({ message: "Total leaves updated successfully" });
  } catch (error) {
    console.error("Error setting total leaves:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};

//Create Leaves Cateegory - only admin/superadmin can do this
export const createLeaveCategory = async (req, res) => {
  try {
    const { name, description, bonusLeaves = 0 } = req.body;
    if (!name || name.trim() === "" || bonusLeaves < 0) {
      return res
        .status(400)
        .json({ message: "Name and valid bonus leaves are required" });
    }

    const existingCategory = await LeaveCategory.findOne({ name: name.trim() });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Leave category already exists with this name" });
    }

    await LeaveCategory.create({
      name: name.trim(),
      description: description ? description.trim() : "",
      bonusLeaves,
    });
    return res
      .status(201)
      .json({ message: "Leave category created successfully" });
  } catch (error) {
    console.error("Error creating leave category:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};

//Delete Leave Category - only admin/superadmin can do this

export const deleteLeaveCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user || !["admin", "superAdmin"].includes(user.role)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this category" });
    }
    const category = await LeaveCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Leave category not found" });
    }

    await LeaveCategory.findByIdAndDelete(categoryId);

    return res
      .status(200)
      .json({ message: "Leave category deleted successfully" });
  } catch (error) {
    console.error("Error deleting leave category:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};

//Admin Analytics to content to be provided

export const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalLeavesApplied = await Leave.countDocuments();
    const totalLeavesApproved = await Leave.countDocuments({
      status: "approved",
    });
    const totalLeavesRejected = await Leave.countDocuments({
      status: "rejected",
    });
    const totalLeavesPending = await Leave.countDocuments({
      status: "pending",
    });
    //Should also show total upcoming approved leaves

    const totalUpcomingApprovedLeaves = await Leave.countDocuments({
      status: "approved",
      startDate: { $gte: new Date() },
    });

    return res.status(200).json({
      totalUsers,
      totalLeavesApplied,
      totalLeavesApproved,
      totalLeavesRejected,
      totalLeavesPending,
      totalUpcomingApprovedLeaves,
    });
  } catch (error) {
    console.error("Error fetching admin analytics:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};

export const getAllLeaveCategories = async (req, res) => {
  try {
    const categories = await LeaveCategory.find().sort({ createdAt: -1 });
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching leave categories:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};

//Get full leave analysis for a user - accessible to admin/superadmin and the user themselves
export const getLeaveAnalyticsForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("User ID in analytics request:", userId);

    const leaveAnalytics = await LeaveAnalytics.findOne({
      user: userId,
    }).populate("user", "name email");
    if (!leaveAnalytics) {
      return res.status(404).json({ message: "Leave analytics not found" });
    }
    return res.status(200).json(leaveAnalytics);
  } catch (error) {
    console.error("Error fetching leave analytics:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};

// Candidate application for leave - accessible to all authenticated users
export const applyForLeave = async (req, res) => {
  try {
    const {
      leaveType,
      durationType,
      startDate,
      endDate,
      numberOfDays,
      halfDayPeriod,
      category,
      description,
      requestForPaidLeave,
    } = req.body;
    const userId = req.user.id;
    console.log(userId);

    if (
      !leaveType ||
      !durationType ||
      !startDate ||
      numberOfDays == null ||
      numberOfDays <= 0
    ) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    if (durationType === "half-day" && !halfDayPeriod) {
      return res
        .status(400)
        .json({ message: "Half-day period must be specified" });
    }

    const leaveAnalytics = await LeaveAnalytics.findOne({ user: userId });
    const leaveCategory = await LeaveCategory.findById(category);
    if (!leaveCategory) {
      return res.status(400).json({ message: "Invalid leave category" });
    }

    // Calculate total available: paidLeavesRemaining + bonusLeaves
    const totalAvailable =
      (leaveAnalytics?.paidLeavesRemaining || 0) +
      (leaveCategory.bonusLeaves || 0);

    if (leaveType === "paid" && numberOfDays > totalAvailable) {
      return res.status(400).json({
        message: `You requested ${numberOfDays} days, but only ${totalAvailable} (Paid: ${
          leaveAnalytics?.paidLeavesRemaining || 0
        }, Bonus: ${
          leaveCategory.bonusLeaves || 0
        }) are available for this category. Please reduce days or apply for unpaid leave.`,
      });
    }

    // const userId = req.user.id;
    // minimal user info for email content
    const applicant = await User.findById(userId).select(
      "name email post Department"
    );

    const newLeave = await Leave.create({
      user: userId,
      leaveType,
      durationType,
      startDate,
      endDate: endDate || startDate,
      numberOfDays,
      halfDayPeriod: durationType === "half-day" ? halfDayPeriod : null,
      category: category || null,
      description: description || "",
      requestForPaidLeave:
        requestForPaidLeave !== undefined ? requestForPaidLeave : true,
      appliedAt: new Date(),
      status: "pending",
    });

    await newLeave.save();
    return res.status(201).json({ message: "Leave application submitted" });
  } catch (error) {
    console.error("Error applying for leave:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};

//Get all leave applications - only admin/superadmin have this access
export const getAllLeaveApplications = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("user", "name email")
      .populate("category", "name description")
      .sort({ appliedAt: -1 });

    const leaveAnalytics = await LeaveAnalytics.find({ user: leaves.user });
    return res.status(200).json({ leaves, leaveAnalytics });
  } catch (error) {
    console.error("Error fetching leave applications:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};

//Response to leave application - only admin/superadmin have this access
export const reviewLeaveApplication = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status, isPaid, note, reason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be either 'approved' or 'rejected'" });
    }

    const leave = await Leave.findById(leaveId)
      .populate("user", "name email")
      .populate("category");
    if (!leave) {
      return res.status(404).json({ message: "Leave application not found" });
    }
    if (leave.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Leave application has already been reviewed" });
    }

    if (status === "approved") {
      leave.isPaid = isPaid || false;
      leave.note = note || "";
      const leaveAnalytics = await LeaveAnalytics.findOne({
        user: leave.user._id,
      });

      if (leaveAnalytics) {
        // If category has bonus leaves, allocate them on approval
        let bonusAllocated = 0;
        if (leave.category && leave.category.bonusLeaves) {
          bonusAllocated = leave.category.bonusLeaves;
          leaveAnalytics.totalLeavesAllocated =
            (leaveAnalytics.totalLeavesAllocated || 0) + bonusAllocated;
        }
        leaveAnalytics.totalLeavesTaken =
          (leaveAnalytics.totalLeavesTaken || 0) + (leave.numberOfDays || 0);

        if (isPaid === true) {
          leaveAnalytics.totalPaidLeavesTaken =
            (leaveAnalytics.totalPaidLeavesTaken || 0) +
            (leave.numberOfDays || 0);
          // Add bonus to paidLeavesRemaining before subtracting used
          if (bonusAllocated > 0) {
            leaveAnalytics.paidLeavesRemaining =
              (leaveAnalytics.paidLeavesRemaining || 0) + bonusAllocated;
          }
          leaveAnalytics.paidLeavesRemaining =
            (leaveAnalytics.paidLeavesRemaining || 0) -
            (leave.numberOfDays || 0);
        } else {
          leaveAnalytics.totalUnpaidLeavesTaken =
            (leaveAnalytics.totalUnpaidLeavesTaken || 0) +
            (leave.numberOfDays || 0);
        }
        leaveAnalytics.lastUpdated = new Date();
        await leaveAnalytics.save();
      }
    } else {
      leave.reason = reason || "";
    }

    leave.status = status;
    leave.reviewer = req.user.id;
    leave.reviewedAt = new Date();
    await leave.save();
    return res
      .status(200)
      .json({ message: "Leave application reviewed successfully" });
  } catch (error) {
    console.error("Error reviewing leave application:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};

//Leave History of a user
//now will introduce pagination

export const getLeaveHistoryForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;
    const filter = { user: userId };
    if (status) {
      filter.status = status;
    }
    const leaves = await Leave.find(filter)
      .populate("category", "name description")
      .sort({ appliedAt: -1 });

    return res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching leave history:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};

export const getPendingLeaves = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { appliedAt: -1 },
      populate: {
        path: "user",
        select: "name email",
      },
    };

    // Populate category name for each leave
    const pendingLeaves = await Leave.paginate(
      { status: "pending" },
      {
        ...options,
        populate: [
          { path: "user", select: "name email" },
          { path: "category", select: "name" },
        ],
      }
    );

    // Ensure category name is present in each doc
    if (pendingLeaves.docs) {
      pendingLeaves.docs = pendingLeaves.docs.map((l) => ({
        ...l.toObject(),
        category: l.category ? { name: l.category.name } : null,
      }));
    }
    return res.status(200).json(pendingLeaves);
  } catch (error) {
    console.error("Error fetching pending leaves:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};

export const getAllUpcomingLeave = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const today = new Date();
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { startDate: 1 },
      populate: {
        path: "user",
        select: "name email",
      },
    };
    // Populate category name for each leave
    const upcomingLeaves = await Leave.paginate(
      { status: "approved", startDate: { $gte: today } },
      {
        ...options,
        populate: [
          { path: "user", select: "name email" },
          { path: "category", select: "name" },
        ],
      }
    );

    // Ensure category name is present in each doc
    if (upcomingLeaves.docs) {
      upcomingLeaves.docs = upcomingLeaves.docs.map((l) => ({
        ...l.toObject(),
        category: l.category ? { name: l.category.name } : null,
      }));
    }
    return res.status(200).json(upcomingLeaves);
  } catch (error) {
    console.error("Error fetching upcoming leaves:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};

//User can delete his pending leave application
export const deleteLeaveApplication = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const userId = req.user.id;
    console.log(userId);

    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ message: "Leave application not found" });
    }

    if (leave.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this leave" });
    }
    console.log(leave.status);

    if (leave.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending leave applications can be deleted" });
    }

    await Leave.findByIdAndDelete(leaveId);

    return res
      .status(200)
      .json({ message: "Leave application deleted successfully" });
  } catch (error) {
    console.error("Error deleting leave application:", error);
    res.status(500).json({
      message: "Unable to proceed right now, contact System Administrator",
    });
  }
};
