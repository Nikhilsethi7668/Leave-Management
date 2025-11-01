import mongoose from "mongoose";

//This card will store all analytics of user leaves data like total leaves taken, leaves remaining etc.
const LeaveAnalyticsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalLeavesAllocated: { type: Number, default: 12 },
    totalLeavesTaken: { type: Number, default: 0 },
    totalPaidLeavesTaken: { type: Number, default: 0 },
    totalUnpaidLeavesTaken: { type: Number, default: 0 },
    paidLeavesRemaining: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("LeaveAnalytics", LeaveAnalyticsSchema);
