import { Router } from "express";

import {
  createNewProductHandler,
  deleteProductHandler,
  getAllProductsHandler,
  getProductHandler,
  updateProductDetails,
} from "../controllers/products.controllers";

const router = Router();

router.get("/", getAllProductsHandler);
router.get("/:id", getProductHandler);
router.post("/", createNewProductHandler);
router.put("/:id", updateProductDetails);
router.delete(":id", deleteProductHandler);

export default router;
