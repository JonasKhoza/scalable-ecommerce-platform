import { Router } from "express";

import {
  createNewProductHandler,
  deleteProductHandler,
  getAllProductsHandler,
  getProductHandler,
  updateProductDetails,
} from "../controllers/products.controllers";
import {
  parameterValidator,
  productInfoValidation,
  productUpdateValidation,
} from "../utils/validateProductInfo";
import authenticate from "../middleware/validateUserAuth";

const router = Router();

router.get("/", getAllProductsHandler);
router.get("/:id", parameterValidator, getProductHandler);
router.post("/", authenticate, productInfoValidation, createNewProductHandler);
router.put("/:id", authenticate, productUpdateValidation, updateProductDetails);
router.delete("/:id", authenticate, parameterValidator, deleteProductHandler);

export default router;
