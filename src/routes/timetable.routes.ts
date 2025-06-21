import express from "express";
import {
  createTimetable,
  getAllTimetables,
  getTimetableByFilter,
  getTimetableByAcademic,
  updateTimetable,
  deleteTimetable,
} from "../controllers/timetable.controller";

const router = express.Router();

router.route("/").get(getAllTimetables).post(createTimetable);
router.route("/academic/:academic_id").get(getTimetableByAcademic);

router.route("/:timetable_id").patch(updateTimetable);
router.route("/:timetable_id").delete(deleteTimetable);

router.route("/filter").get(getTimetableByFilter);

export default router;
