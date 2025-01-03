import { Router } from "express";

import {
  createNewProductCategoryHandler,
  getProcuctsCategory,
} from "../controllers/categories.controllers copy";

const router = Router();

router.post("/", createNewProductCategoryHandler);
router.get("/", getProcuctsCategory);

export default router;
