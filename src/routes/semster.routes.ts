import express from "express";
import {
  getAllSemesters,
  getSemesterById,
  createSemester,
  updateSemester,
  deleteSemester,
} from "../controllers/semester.controller";

import { protect, restrictTo } from "../middleware/protect";

const router = express.Router();

router.get("/", protect, getAllSemesters);
router.get("/:id", protect, restrictTo("admin"), getSemesterById);
router.post("/", protect, restrictTo("admin"), createSemester);
router.put("/:id", protect, restrictTo("admin"), updateSemester);
router.delete("/:id", protect, restrictTo("admin"), deleteSemester);

export default router;
