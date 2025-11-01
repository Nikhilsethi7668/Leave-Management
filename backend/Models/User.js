import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, index: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },

    post: { type: String, default: "" },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    
    joinedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
