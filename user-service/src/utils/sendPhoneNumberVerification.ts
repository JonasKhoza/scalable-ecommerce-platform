import twilio from "twilio";
import generateRandomnOTP from "./generateRandomnOTP";
import * as dotenv from "dotenv";
dotenv.config();

console.log(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN,
  process.env.TWILIO_PHONE_NUMBER
);

const sendSmsOTP = async (phoneNumber: string, otp: string) => {
  try {
    const client = twilio(
      String(process.env.TWILIO_SID),
      String(process.env.TWILIO_AUTH_TOKEN)
    );

    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: String(process.env.TWILIO_PHONE_NUMBER),
      to: phoneNumber,
    });
  } catch (err) {
    console.log(err);
  }
};

// const resultedOTP = generateRandomnOTP();
// sendSmsOTP("+27818895823", resultedOTP);
