import express from "express";
import {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from "../controllers/class.controller";

import { protect, restrictTo } from "../middleware/protect";
import { getSubjectsByClass } from "../controllers/subject.controller";

const router = express.Router();

router.get("/", getAllClasses);
router.get("/:id", protect, restrictTo("admin"), getClassById);
router.post("/", protect, restrictTo("admin"), createClass);
router.put("/:id", protect, restrictTo("admin"), updateClass);
router.delete("/:id", protect, restrictTo("admin"), deleteClass);

router.get("/subjects/:class_id", getSubjectsByClass);

export default router;
