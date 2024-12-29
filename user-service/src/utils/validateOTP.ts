import { CustomError } from "../models/error.models";
import { OTP } from "../models/otp.model";

const validateOTP = async (
  identifier: string,
  enteredOTP: string
): Promise<CustomError | void> => {
  try {
    const record = await OTP.findOne({ identifier, otp: enteredOTP });
    if (!record) throw new CustomError(false, "Invalid or expired OTP", 409);
    // OTP is valid; proceed with verification
    await record.deleteOne(); // Delete after verification
  } catch (err: any) {
    return err;
  }
};

export default validateOTP;
