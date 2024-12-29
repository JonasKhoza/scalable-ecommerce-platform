import nodemailer from "nodemailer";
import { CustomError } from "../models/error.models";
import { ResponseStructure } from "../models/response.models";

// Validate required environment variables
const requiredEnvVars = [
  "EMAIL_SERVICE",
  "E_HOST",
  "E_HOST_PORT",
  "EMAIL_USER",
  "E_PASSWORD",
];

export default async function sendEmailVerification(
  email: string,
  otp: string
) {
  try {
    requiredEnvVars.forEach((envVar) => {
      if (!process.env[envVar]) {
        throw new CustomError(
          false,
          `Missing environment variable: ${envVar}`,
          409
        );
      }
    });

    const isSecure = parseInt(process.env.E_HOST_PORT!) === 465;

    const transporter = nodemailer.createTransport({
      service: String(process.env.EMAIL_SERVICE),
      host: String(process.env.E_HOST),
      port: parseInt(process.env.E_HOST_PORT || "587"),
      secure: isSecure,
      auth: {
        user: String(process.env.EMAIL_USER),
        pass: String(process.env.E_PASSWORD),
      },
    });

    //console.log("Transporter initialized");

    await transporter.verify();
    //console.log("Transporter is ready to send emails");

    const info = await transporter.sendMail({
      from: String(process.env.EMAIL_USER),
      to: email, //email,
      subject: "Your OTP code",
      text: `Your OTP is: ${otp}`,
    });

    return new ResponseStructure(true, "Email sent successfully");
  } catch (err: any) {
    // Customize error message and add HTTP status code
    if (err.code === "EAUTH") {
      // Invalid login credentials for the email service
      throw new CustomError(
        false,
        "Authentication error with email service",
        401,
        err
      );
    } else if (err.code === "ECONNREFUSED") {
      // Network-related issues
      throw new CustomError(
        false,
        "Connection refused while sending email",
        503,
        err
      );
    } else {
      // General error fallback
      throw new CustomError(
        false,
        "Error occurred while sending email",
        500,
        err
      );
    }
  }
}

// const resultedOTP = generateRandomnOTP();
// sendEmailVerification("richardgallant108@gmail.com", resultedOTP);
