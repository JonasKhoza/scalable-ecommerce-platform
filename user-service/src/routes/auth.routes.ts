import { Router } from "express";

import {
  createUserHandler,
  getUserProfileHandler,
  loginUserHandler,
  updateUserProfileHandler,
} from "../controllers/auth.controllers";

const router = Router();

router.post("/register", createUserHandler);
router.post("/login", loginUserHandler);
router.get("/profile", getUserProfileHandler);
router.put("/profile", updateUserProfileHandler);

export default router;
