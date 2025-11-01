import mongoose from "mongoose";

//Total leavse for each candidate - can be controlled by admin/superadmin
const TotalLeavesSchema = new mongoose.Schema(
  {
    totalAnnualPaidLeaves: { type: Number, default: 20 },
  },
  { timestamps: true }
);

export default mongoose.model("TotalLeaves", TotalLeavesSchema);
