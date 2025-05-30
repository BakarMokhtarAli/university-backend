import express from "express";
import {
  getAllBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
} from "../controllers/batch.controller";

import { protect, restrictTo } from "../middleware/protect";

const router = express.Router();

router.get("/", protect, getAllBatches);
router.get("/:id", protect, restrictTo("admin"), getBatchById);
router.post("/", protect, restrictTo("admin"), createBatch);
router.put("/:id", protect, restrictTo("admin"), updateBatch);
router.delete("/:id", protect, restrictTo("admin"), deleteBatch);

export default router;
