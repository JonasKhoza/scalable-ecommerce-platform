import { Router } from "express";
import {
  createUserOrderHandler,
  getUserOrderDetailsHandler,
  getUserOrdersHandler,
  updateUserOrderStatusHandler,
} from "../controllers/order.controllers";
import authenticate from "../middlewares/validateUserAuth";
import validateContentType from "../middlewares/validateContentType";
import { applicationjson } from "../utils/contentTypes";

const router = Router();

router.post(
  "/",
  authenticate,
  validateContentType(applicationjson),
  createUserOrderHandler
);
router.get("/user", authenticate, getUserOrdersHandler);
router.get("/:orderId", authenticate, getUserOrderDetailsHandler);
router.patch(
  "/:orderId/status",
  authenticate,
  validateContentType(applicationjson),
  updateUserOrderStatusHandler
);

export default router;
