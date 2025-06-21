import express from "express";
import {
  createAcademic,
  getAllAcademic,
  getAcademicById,
} from "../controllers/academic.controller";
import { protect } from "../middleware/protect";

const router = express.Router();

// router.use(protect); // Protect all routes

// GET all academics and POST a new one
router.route("/").get(getAllAcademic).post(createAcademic);

// GET one, UPDATE, DELETE by ID
router.route("/:id").get(getAcademicById);
//   .patch(updateAcademic)
//   .delete(deleteAcademic);

export default router;
