import express from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getAllStudentsByClass,
} from "../controllers/student.controller";

const router = express.Router();
import upload from "../middleware/upload";
import { imageUpload } from "../middleware/imageUpload.middleware";

router
  .route("/")
  .get(getAllStudents)
  .post(upload.single("image"), createStudent);
router.route("/class/:class_id").get(getAllStudentsByClass);

router
  .route("/:id")
  .get(getStudentById)
  .patch(upload.single("image"), updateStudent)
  .delete(deleteStudent);

export default router;
