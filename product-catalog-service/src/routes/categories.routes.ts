import { Router } from "express";

import {
  createNewProductCategoryHandler,
  getProcuctsCategory,
} from "../controllers/categories.controllers";

const router = Router();

router.get("/", getProcuctsCategory);
router.post("/", createNewProductCategoryHandler);

export default router;
