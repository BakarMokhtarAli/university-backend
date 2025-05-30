import express from "express";
import {
  getAllFaculties,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from "../controllers/faculty.controller";

import { protect, restrictTo } from "../middleware/protect";

const router = express.Router();

router.get("/", protect, getAllFaculties);
router.get("/:id", protect, restrictTo("admin"), getFacultyById);
router.post("/", protect, restrictTo("admin"), createFaculty);
router.put("/:id", protect, restrictTo("admin"), updateFaculty);
router.delete("/:id", protect, restrictTo("admin"), deleteFaculty);

export default router;
