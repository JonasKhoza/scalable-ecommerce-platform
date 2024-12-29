import { Router } from "express";

import {
  createUserHandler,
  getUserProfileHandler,
  loginUserHandler,
  updateUserProfileHandler,
} from "../controllers/auth.controllers";
import { signupValidator } from "../utils/authInputDataValidators";
import validateContentType from "../middlewares/validateContentType";
import { applicationjson } from "../utils/contentTypes";

const router = Router();

router.post(
  "/register",
  validateContentType(applicationjson),
  signupValidator,
  createUserHandler
);
router.post("/login", validateContentType(applicationjson), loginUserHandler);
router.get("/profile", getUserProfileHandler);
router.put(
  "/profile",
  validateContentType(applicationjson),
  updateUserProfileHandler
);

export default router;
