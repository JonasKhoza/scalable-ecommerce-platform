import { Router } from "express";

import {
  createUserHandler,
  getUserProfileHandler,
  loginUserHandler,
  refreshToken,
  updateUserProfileHandler,
} from "../controllers/auth.controllers";
import {
  signinValidator,
  signupValidator,
} from "../utils/authInputDataValidators";
import validateContentType from "../middlewares/validateContentType";
import { applicationjson } from "../utils/contentTypes";

const router = Router();

router.post(
  "/register",
  validateContentType(applicationjson),
  signupValidator,
  createUserHandler
);
router.post(
  "/login",
  validateContentType(applicationjson),
  signinValidator,
  loginUserHandler
);

router.get("/profile", getUserProfileHandler);
router.put(
  "/profile",
  validateContentType(applicationjson),
  updateUserProfileHandler
);
router.post("/refresh", refreshToken);

export default router;
