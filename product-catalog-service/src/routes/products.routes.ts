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

const router = Router();

router.get("/", getAllProductsHandler);
router.get("/:id", parameterValidator, getProductHandler);
router.post("/", productInfoValidation, createNewProductHandler);
router.put("/:id", productUpdateValidation, updateProductDetails);
router.delete("/:id", parameterValidator, deleteProductHandler);

export default router;
