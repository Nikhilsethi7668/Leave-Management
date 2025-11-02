import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const LeaveSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    leaveType: { type: String, enum: ["paid", "unpaid"], required: true },
    durationType: {
      type: String,
      enum: ["half-day", "full-day", "multiple-days"],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    numberOfDays: { type: Number, required: true },

    halfDayPeriod: {
      type: String,
      enum: ["first-half", "second-half"],
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "LeaveCategory" },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    //If user paid leave balance is over so he can reqest admin to provide `
    requestForPaidLeave: { type: Boolean, default: true },

    appliedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    review: { type: String, default: "" },
    isPaid: { type: Boolean, default: false },
    note: { type: String, default: "" },
    reason: { type: String, default: "" },
  },
  { timestamps: true }
);

LeaveSchema.plugin(mongoosePaginate);

export default mongoose.model("Leave", LeaveSchema);
