import { Request, Response } from "express";
import generateRandomnOTP from "../utils/generateRandomnOTP";
import sendEmailVerification from "../utils/sendEmailVerification";
import errorResponseHelper from "../utils/errorResponseHelper";
import { OTP } from "../models/otp.model";
import validateOTP from "../utils/validateOTP";
import { ResponseStructure } from "../models/response.models";
import { validationResult } from "express-validator";
import validateUserInputHelper from "../utils/validateUserInputHelper";
import { DBUser } from "../models/user.models";
import { CustomError } from "../models/error.models";

async function createVerifyUserEmailOTPHandler(req: Request, res: Response) {
  /*
    This includes sending a verification email for the email and sms with OTP to the phone number 
  
    STEPS: 
      1. Receive email from the frontend
      2. Generate an OTP from the received email address which is given back to the frontend inside the token upon signing up completion
      3. Store the OTP in the database for 1minute
      4. Provides status on success/failure of sending OTP
*/

  try {
    //Get the input validation results from express validator middleware
    const validationResults = validationResult(req);
    //Get condition of results
    const validatioResult = validateUserInputHelper(validationResults);

    //Check condition of results
    if (!validatioResult.success) {
      //If error, then throw the error
      throw validatioResult;
    }

    const { email } = req.body;

    //Check to see if the email does exists in the database first

    const existingUser = await DBUser.findOne({ email });

    if (!existingUser) {
      throw new CustomError(
        false,
        "Email does not exist in the database.",
        400
      );
    }

    const generatedRandOTP = generateRandomnOTP();

    //Post tot the database
    const userOTP = new OTP({ identifier: email, otp: generatedRandOTP });

    await userOTP.save();

    const result = await sendEmailVerification(email, generatedRandOTP);
    //If there's an error
    if (!result.success) {
      throw result;
    }
    //If success
    res.status(200).json(result);
  } catch (err) {
    errorResponseHelper(res, err);
    return;
  }
}

async function verifyUserEmailOTPHandler(req: Request, res: Response) {
  /*
      1. Receive email from the frontend
      2. Query the database for the email and OTP combination check
      3. If success, delete the existing record and send back a success message
      4. If failure, provide an invalid/expired otp error message
*/
  try {
    const { email, otp } = req.body;

    //Check to see if the email does exists in the database first
    const existingUser = await DBUser.findOne({ email });

    if (!existingUser) {
      throw new CustomError(
        false,
        "Email does not exist in the database.",
        400
      );
    }

    //Validate OTP
    const result = await validateOTP(email, otp);
    if (result && result.success === false) {
      throw result;
    }

    //Update email verification status
    await DBUser.updateOne(
      { email },
      { $set: { emailverified: true } } // Corrected usage
    );

    //If no error occured
    res
      .status(200)
      .json(new ResponseStructure(true, 200, "Successfully verified email."));
  } catch (err) {
    errorResponseHelper(res, err);
    return;
  }
}
function verifyUserPhoneNumberOTPHandler(req: Request, res: Response) {}
function createVerifyUserPhoneNumberOTPHandler(req: Request, res: Response) {}

export {
  createVerifyUserEmailOTPHandler,
  createVerifyUserPhoneNumberOTPHandler,
  verifyUserEmailOTPHandler,
  verifyUserPhoneNumberOTPHandler,
};
