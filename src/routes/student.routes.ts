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

router.route("/").get(getAllStudents).post(createStudent);
router.route("/class/:class_id").get(getAllStudentsByClass);

router
  .route("/:id")
  .get(getStudentById)
  .patch(updateStudent)
  .delete(deleteStudent);

export default router;
