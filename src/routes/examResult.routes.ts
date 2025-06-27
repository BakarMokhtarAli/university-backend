import express from "express";
import {
  submitExamResults,
  getExamResultsByType,
  updateStudentMark,
  getStudentExamResults,
} from "../controllers/examResult.controller";
import { protect } from "../middleware/protect";

const router = express.Router();

// router.use(protect);

router.route("/").post(submitExamResults).get(getExamResultsByType);

router.route("/student").patch(updateStudentMark);
router.get("/student/:studentId", getStudentExamResults);

export default router;
