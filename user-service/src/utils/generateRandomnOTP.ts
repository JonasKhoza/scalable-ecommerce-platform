import crypto from "crypto";

export default function generateRandomnOTP() {
  return crypto.randomInt(100000, 999999).toString();
}
