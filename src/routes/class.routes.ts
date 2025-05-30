import express from "express";
import {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from "../controllers/class.controller";

import { protect, restrictTo } from "../middleware/protect";

const router = express.Router();

router.get("/", protect, getAllClasses);
router.get("/:id", protect, restrictTo("admin"), getClassById);
router.post("/", protect, restrictTo("admin"), createClass);
router.put("/:id", protect, restrictTo("admin"), updateClass);
router.delete("/:id", protect, restrictTo("admin"), deleteClass);

export default router;
