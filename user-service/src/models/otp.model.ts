import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  identifier: { type: String, required: true }, // email or phone
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "1m" }, // Expire in 1 minute
});

const OTP = mongoose.model("OTP", otpSchema);

export { OTP };
