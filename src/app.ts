import express from "express";
import cors from "cors";

// global error handler
import globalErrorHandler from "./controllers/error.controller";
import AppError from "./utils/AppError";

// import routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import batchRoutes from "./routes/batch.routes";
import semesterRoutes from "./routes/semster.routes";
import studentRoutes from "./routes/student.routes";
import facultyRoutes from "./routes/faculty.routes";
import classRoutes from "./routes/class.routes";
import attendaceRoutes from "./routes/attendance.routes";
import subjectRoutes from "./routes/subject.routes";
import gradeRoutes from "./routes/grade.routes";
import announcementRoutes from "./routes/announcement.routes";
import academicRoutes from "./routes/academic.routes";
import timetableRoutes from "./routes/timetable.routes";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/faculties", facultyRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/attendances", attendaceRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/academics", academicRoutes);
app.use("/api/timetables", timetableRoutes);

// 404 no route found
app.use((req, res, next) => {
  next(
    new AppError(
      `The requested URL ${req.originalUrl} was not found on the server.`,
      404
    )
  );
});

app.use(globalErrorHandler);

export default app;
