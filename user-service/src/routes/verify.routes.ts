import { Router } from "express";
import {
  createVerifyUserEmailOTPHandler,
  createVerifyUserPhoneNumberOTPHandler,
  verifyUserEmailOTPHandler,
  verifyUserPhoneNumberOTPHandler,
} from "../controllers/verify.controllers";
import validateContentType from "../middlewares/validateContentType";
import { applicationjson } from "../utils/contentTypes";
import { emailValidator } from "../utils/authInputDataValidators";

const router = Router();

router.post(
  "/email/create",
  emailValidator,
  validateContentType(applicationjson),
  createVerifyUserEmailOTPHandler
);
router.post(
  "/email/verify",
  emailValidator,
  validateContentType(applicationjson),
  verifyUserEmailOTPHandler
);
router.get("/phone-number/create", createVerifyUserPhoneNumberOTPHandler);
router.post("/phone-number/verify", verifyUserPhoneNumberOTPHandler);

export default router;
