import mongoose from "mongoose";
const LeaveCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    bonusLeaves: { type: Number, default: 0 }, //extra leaves apart from total leaves
  },
  { timestamps: true }
);

export default mongoose.model("LeaveCategory", LeaveCategorySchema);
