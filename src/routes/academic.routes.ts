import express from "express";
import {
  createAcademic,
  getAllAcademic,
  getAcademicById,
  updateAcademicById,
  deleteAcademicById,
  getAcademicByBatch,
} from "../controllers/academic.controller";
import { protect } from "../middleware/protect";

const router = express.Router();

// router.use(protect); // Protect all routes

// GET all academics and POST a new one
router.route("/").get(getAllAcademic).post(createAcademic);

router.route("/batch/:batch_id").get(getAcademicByBatch);

// GET one, UPDATE, DELETE by ID
router
  .route("/:id")
  .get(getAcademicById)
  .put(updateAcademicById)
  .delete(deleteAcademicById);

export default router;
