// attendance.routes.ts
import express from "express";
import {
  getAllAttendances,
  getAttendanceById,
  createAttendances,
  updateAttendance,
  deleteAttendance,
  getClassAttendance,
  getClassAttendanceByDateRange,
  getStudentAttendanceByDateRange,
  getTodayAttendance,
  getMonthlyAttendance,
  //   getAttendanceByDate,
} from "../controllers/attendance.controller";
import { protect } from "../middleware/protect";
const router = express.Router();

// router.use(protect); // Protect all routes

// specific route firs
router.get("/today", getTodayAttendance);
router.get("/month", getMonthlyAttendance);

router.route("/").get(getAllAttendances).post(createAttendances);

router
  .route("/:id")
  .get(getAttendanceById)
  .patch(updateAttendance)
  .delete(deleteAttendance);

router.post("/class", getClassAttendance);

// For class attendance by date range
router.post("/class/date-range", getClassAttendanceByDateRange);

// For student attendance by date range
router.post("/student/date-range", getStudentAttendanceByDateRange);

export default router;
