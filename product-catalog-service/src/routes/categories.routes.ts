import { Router } from "express";

import {
  createNewProductCategoryHandler,
  getProcuctsCategory,
} from "../controllers/categories.controllers";
import authenticate from "../middleware/validateUserAuth";

const router = Router();

router.get("/", getProcuctsCategory);
router.post("/", authenticate, createNewProductCategoryHandler);

export default router;
