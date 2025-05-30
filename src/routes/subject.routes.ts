import express from "express";
import {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../controllers/subject.controller";
import { protect } from "../middleware/protect";

const router = express.Router();

router.use(protect);

router.route("/").post(createSubject).get(getAllSubjects);

router
  .route("/:id")
  .get(getSubjectById)
  .patch(updateSubject)
  .delete(deleteSubject);

export default router;
