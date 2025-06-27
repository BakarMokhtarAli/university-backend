import express from "express";
import {
  createExam,
  getAllExams,
  getExamById,
  updateExamById,
  deleteExamById,
} from "../controllers/exam.controller";
import { protect } from "../middleware/protect";

const router = express.Router();

// router.use(protect);

router.route("/").get(getAllExams).post(createExam);
router
  .route("/:id")
  .get(getExamById)
  .patch(updateExamById)
  .delete(deleteExamById);
export default router;
