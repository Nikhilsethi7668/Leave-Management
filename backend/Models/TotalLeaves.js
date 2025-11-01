import mongoose from "mongoose";

//Total leavse for each candidate - can be controlled by admin/superadmin
const TotalLeavesSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    totalAnnualPaidLeaves: { type: Number, default: 20 },
  },
  { timestamps: true }
);

export default mongoose.model("TotalLeaves", TotalLeavesSchema);
