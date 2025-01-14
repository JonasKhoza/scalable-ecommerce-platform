import { Router } from "express";

import {
  addProductToCartHandler,
  deleteCartHandler,
  retrieveCartHandler,
  updateCartProductQuantHandler,
} from "../controllers/cart.controllers";
import authenticate from "../middleware/validateUserAuth";
import validateContentType from "../middleware/validateContentType";
import { applicationjson } from "../utils/contentTypes";

const router = Router();

router.get("/:cartId", authenticate, retrieveCartHandler);
router.delete("/", authenticate, deleteCartHandler);
router.post(
  "/add",
  authenticate,
  validateContentType(applicationjson),
  addProductToCartHandler
);
router.put(
  "/update",
  authenticate,
  validateContentType(applicationjson),
  updateCartProductQuantHandler
);

export default router;
