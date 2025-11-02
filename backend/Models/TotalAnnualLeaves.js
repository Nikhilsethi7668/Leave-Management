import mongoose from "mongoose";

const TotalAnnualLeavesSchema = new mongoose.Schema(
  {
    annualLeaves: { type: Number, default: 20 },
  },
  { timestamps: true }
);

export default mongoose.model("TotalAnnualLeaves", TotalAnnualLeavesSchema);
