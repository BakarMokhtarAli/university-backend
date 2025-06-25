import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import Attendance, {
  IAttendance,
  AttendanceStatus,
} from "../models/attendance.model";
import { AuthRequest } from "../middleware/protect";
import Student from "../models/student.model";
import Class from "../models/class.model"; // Import Class model
import Subject from "../models/subject.model";

// Get all attendance records
export const getAllAttendances = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const attendances = await Attendance.find()
      .populate({
        path: "student",
        select: "fullName sex id_number",
      })
      .populate("class", "name");

    res.status(200).json({
      status: "success",
      message: "Attendance records retrieved successfully",
      attendances,
    });
  }
);

// Get attendance by ID
export const getAttendanceById = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const attendance = await Attendance.findById(req.params.id)
      .populate({
        path: "student",
        select: "fullName sex id_number",
      })
      .populate("class", "name");

    if (!attendance) {
      return next(new AppError("Attendance record not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Attendance record retrieved successfully",
      attendance,
    });
  }
);

// Create multiple attendance records at once
export const createAttendances = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const {
      class: classId,
      subject: subjectId,
      date = new Date(),
      records,
    } = req.body;

    // Validate input
    if (!classId || !subjectId || !records || !Array.isArray(records)) {
      return next(
        new AppError(
          "Class ID, Subject ID, and attendance records array are required",
          400
        )
      );
    }

    // Check if class exists
    const classDoc = await Class.findById(classId).select("students");
    if (!classDoc) {
      return next(new AppError("Class not found", 404));
    }

    // Check if subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return next(new AppError("Subject not found", 404));
    }

    // Prepare attendance records
    const attendanceRecords = [];
    const errors = [];

    for (const record of records) {
      const { student: studentId, status } = record;

      // Validate record
      if (!studentId || !status) {
        errors.push(`Invalid record: ${JSON.stringify(record)}`);
        continue;
      }

      // Check if student exists
      const student = await Student.findById(studentId);
      if (!student) {
        errors.push(`Student not found with ID: ${studentId}`);
        continue;
      }

      // Check if student is enrolled in class
      // const isEnrolled = classDoc.students.some(id =>
      //   id.toString() === student._id.toString()
      // );

      // if (!isEnrolled) {
      //   errors.push(`Student ${studentId} not enrolled in class ${classId}`);
      //   continue;
      // }

      // Check for existing attendance
      const existingAttendance = await Attendance.findOne({
        student: studentId,
        class: classId,
        subject: subjectId,
        date,
      });

      if (existingAttendance) {
        errors.push(
          `Attendance already exists for student ${student.fullName} in subject ${subject.name} on ${date}`
        );
        continue;
      }

      attendanceRecords.push({
        student: studentId,
        class: classId,
        subject: subjectId,
        status,
        date,
      });
    }

    // Save valid records
    const createdAttendances = await Attendance.insertMany(attendanceRecords);

    res.status(201).json({
      status: "success",
      message: "Attendance records created successfully",
      created: createdAttendances.length,
      errors: errors.length > 0 ? errors : undefined,
      attendances: createdAttendances,
    });
  }
);

// Update an attendance record
export const updateAttendance = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("student", "fullName")
      .populate("class", "name");

    if (!attendance) {
      return next(new AppError("Attendance record not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Attendance record updated successfully",
      attendance,
    });
  }
);

// Delete an attendance record
export const deleteAttendance = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return next(new AppError("Attendance record not found", 404));
    }

    res.status(204).json({
      status: "success",
      message: "Attendance record deleted successfully",
      attendance,
    });
  }
);

// Get attendance for a specific class and date
export const getClassAttendance = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { class: classId, date } = req.body;

    // Parse date (format: YYYY-MM-DD)
    const attendanceDate = new Date(date);

    // Check if class exists
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return next(new AppError("Class not found", 404));
    }

    const attendances = await Attendance.find({
      class: classId,
      date: {
        $gte: new Date(attendanceDate.setHours(0, 0, 0, 0)),
        $lt: new Date(attendanceDate.setHours(23, 59, 59, 999)),
      },
    }).populate({
      path: "student",
      select: "fullName sex id_number",
    });

    res.status(200).json({
      status: "success",
      message: "Class attendance retrieved successfully",
      class: classExists.name,
      date,
      count: attendances.length,
      attendances,
    });
  }
);

// Get attendance for a class by date range
export const getClassAttendanceByDateRange = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { class: classId, subject: subjectId, startDate, endDate } = req.body;

    // Validate parameters
    if (!classId || !startDate || !endDate) {
      return next(
        new AppError("Class ID, startDate, and endDate are required", 400)
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Set time boundaries
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // Validate dates
    if (isNaN(start.getTime())) {
      return next(new AppError("Invalid startDate format", 400));
    }

    if (isNaN(end.getTime())) {
      return next(new AppError("Invalid endDate format", 400));
    }

    if (start > end) {
      return next(new AppError("startDate must be before endDate", 400));
    }

    // Check if class exists
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return next(new AppError("Class not found", 404));
    }

    // Check if subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return next(new AppError("Subject not found", 404));
    }

    const attendances = await Attendance.find({
      class: classId,
      subject: subjectId,
      date: { $gte: start, $lte: end },
    })
      .populate({
        path: "student",
        select: "fullName sex id_number",
      })
      .populate("subject", "name code") // Populate subject details
      .sort({ date: 1 }); // Sort by date ascending

    // Calculate attendance summary
    const summary = {
      total: attendances.length,
      present: attendances.filter((a) => a.status === "Present").length,
      absent: attendances.filter((a) => a.status === "Absent").length,
      late: attendances.filter((a) => a.status === "Late").length,
      leave: attendances.filter((a) => a.status === "Leave").length,
    };

    res.status(200).json({
      status: "success",
      message: "Class attendance retrieved by date range",
      class: {
        id: classId,
        name: classExists.name,
      },
      subject: {
        id: subjectId,
        name: subject.name,
        code: subject.code,
      },
      startDate: start,
      endDate: end,
      count: attendances.length,
      summary,
      attendances,
    });
  }
);

// Get attendance for a student by date range
export const getStudentAttendanceByDateRange = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { student: studentId, startDate, endDate } = req.body;

    // Validate parameters
    if (!studentId || !startDate || !endDate) {
      return next(
        new AppError("Student ID, startDate, and endDate are required", 400)
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Set time boundaries
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // Validate dates
    if (isNaN(start.getTime())) {
      return next(new AppError("Invalid startDate format", 400));
    }

    if (isNaN(end.getTime())) {
      return next(new AppError("Invalid endDate format", 400));
    }

    if (start > end) {
      return next(new AppError("startDate must be before endDate", 400));
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return next(new AppError("Student not found", 404));
    }

    const attendances = await Attendance.find({
      student: studentId,
      date: { $gte: start, $lte: end },
    })
      .populate({
        path: "class",
        select: "name",
      })
      .sort({ date: 1 }); // Sort by date ascending

    // Calculate attendance summary
    const summary = {
      total: attendances.length,
      present: attendances.filter((a) => a.status === "Present").length,
      absent: attendances.filter((a) => a.status === "Absent").length,
      late: attendances.filter((a) => a.status === "Late").length,
      leave: attendances.filter((a) => a.status === "Leave").length,
    };

    res.status(200).json({
      status: "success",
      message: "Student attendance retrieved by date range",
      student: {
        id: studentId,
        name: student.fullName,
        id_number: student.id_number,
      },
      startDate: start,
      endDate: end,
      count: attendances.length,
      summary,
      attendances,
    });
  }
);

// get today's attendance

export const getTodayAttendance = catchAsync(
  async (req: Request, res: Response) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const filter: any = {
      date: { $gte: today, $lt: tomorrow },
    };

    if (req.query.subject) {
      filter.subject = req.query.subject;
    }

    if (req.query.student) {
      filter.student = req.query.student;
    }

    const records = await Attendance.find(filter)
      .populate("student", "fullName student_id")
      .populate("class", "name")
      .populate("subject", "name code");

    res.status(200).json({
      status: "success",
      date: today.toISOString().split("T")[0],
      total: records.length,
      data: records,
    });
  }
);

// get attendance by current month
export const getMonthlyAttendance = catchAsync(
  async (req: Request, res: Response) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const filter: any = {
      date: { $gte: startOfMonth, $lte: endOfMonth },
    };

    if (req.query.subject) {
      filter.subject = req.query.subject;
    }

    if (req.query.student) {
      filter.student = req.query.student;
    }

    const records = await Attendance.find(filter)
      .populate("student", "fullName student_id")
      .populate("class", "name")
      .populate("subject", "name code");

    res.status(200).json({
      status: "success",
      month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}`,
      total: records.length,
      data: records,
    });
  }
);
