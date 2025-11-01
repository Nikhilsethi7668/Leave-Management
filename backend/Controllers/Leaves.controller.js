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
    const { name, description, bonusLeaves } = req.body;
    if (
      !name ||
      name.trim() === "" ||
      !bonusLeaves ||
      bonusLeaves == null ||
      bonusLeaves < 0
    ) {
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
    const { userId } = req.params;

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

    const userId = req.user.id;
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

    // notify admins + superAdmins
    try {
      const admins = await User.find({
        role: { $in: ["admin", "superAdmin"] },
      }).select("email name");
      const adminEmails = admins.map((a) => a.email).filter(Boolean);

      if (adminEmails.length > 0) {
        const subject = `New leave request from ${
          applicant?.name || "Employee"
        }`;
        const text = [
          `Applicant: ${applicant?.name || "N/A"} (${
            applicant?.email || "N/A"
          })`,
          `Post/Dept: ${applicant?.post || ""}`,
          `Type: ${leaveType}`,
          `Duration: ${durationType}`,
          `Start: ${startDate}`,
          `End: ${endDate || startDate}`,
          `Days: ${numberOfDays}`,
          `Reason: ${description || "No reason provided"}`,
          `Status: Pending`,
        ].join("\n");

        // send but don't block success response if it fails
        await sendEmail({
          to: adminEmails,
          subject,
          text,
          category: "Leave Request",
        });
      }
    } catch (emailErr) {
      console.error("Failed sending leave-notification to admins:", emailErr);
      // do not fail the API; just log
    }

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
    const { status, review } = req.body;

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
      const leaveAnalytics = await LeaveAnalytics.findOne({
        user: leave.user._id,
      });

      if (leaveAnalytics) {
        leaveAnalytics.totalLeavesTaken =
          (leaveAnalytics.totalLeavesTaken || 0) + (leave.numberOfDays || 0);
        if (leave.category && leave.category.bonusLeaves) {
          leaveAnalytics.totalLeavesAllocated =
            (leaveAnalytics.totalLeavesAllocated || 0) +
            leave.category.bonusLeaves;
        }
        if (leave.leaveType === "paid") {
          leaveAnalytics.totalPaidLeavesTaken =
            (leaveAnalytics.totalPaidLeavesTaken || 0) +
            (leave.numberOfDays || 0);
          leaveAnalytics.paidLeavesRemaining =
            (leaveAnalytics.totalLeavesAllocated || 0) -
            (leaveAnalytics.totalPaidLeavesTaken || 0);
        } else if (leave.leaveType === "unpaid") {
          leaveAnalytics.totalUnpaidLeavesTaken =
            (leaveAnalytics.totalUnpaidLeavesTaken || 0) +
            (leave.numberOfDays || 0);
        }
        leaveAnalytics.lastUpdated = new Date();
        await leaveAnalytics.save();
      }
    }

    leave.status = status;
    leave.review = review || "";
    leave.reviewer = req.user.id;
    leave.reviewedAt = new Date();
    await leave.save();

    // notify the candidate about the decision
    try {
      const recipient = leave.user?.email;
      if (recipient) {
        const subject = `Your leave request has been ${status}`;
        const text = [
          `Hi ${leave.user?.name || ""},`,
          `Your leave request for ${leave.startDate} to ${
            leave.endDate || leave.startDate
          } (${leave.numberOfDays} day(s)) has been ${status}.`,
          `Reviewer note: ${review || "No note provided"}`,
          `If approved: Thank you.`,
          `If rejected: Please contact your manager for details.`,
        ].join("\n\n");

        await sendEmail({
          to: [recipient],
          subject,
          text,
          category: "Leave Review",
        });
      }
    } catch (emailErr) {
      console.error(
        "Failed sending leave-review email to candidate:",
        emailErr
      );
    }

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
