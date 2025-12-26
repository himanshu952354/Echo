import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  abandonedCalls: { type: Number, default: 0 },
  profilePicture: { type: String, default: "" },
  city: { type: String, default: "" },
  timezone: { type: String, default: "UTC/GMT -4 hours" },
  dailyUtilization: { type: Number, default: 7 },
  coreWorkRangeStart: { type: Number, default: 3 },
  coreWorkRangeEnd: { type: Number, default: 6 },
});

export default mongoose.model("User", userSchema);
