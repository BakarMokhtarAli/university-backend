import express from "express";
import {
  uploadGrades,
  getClassGrades,
  deleteGrades,
} from "../controllers/grade.controller";
import { protect } from "../middleware/protect";
import multer from "multer";

const router = express.Router();

// Protect all routes
// router.use(protect);

const upload = multer();

// router.post("/template", downloadGradeTemplate);
router.post("/upload", upload.single("file"), uploadGrades);
router.get("/", getClassGrades);
router.delete("/", deleteGrades);

export default router;
