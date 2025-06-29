import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import Exam from "../models/exam.model";
import ExamResult from "../models/examResult.model";
import Student from "../models/student.model";

const MAX_MARKS_MAP: Record<string, number> = {
  cw1: 10,
  cw2: 10,
  midterm: 30,
  final: 50,
};

export const submitExamResults = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { exam, subject, class: classId, results } = req.body;

    if (!exam || !subject || !classId || !Array.isArray(results)) {
      return next(
        new AppError(
          "Exam ID, subject, class, and an array of results are required",
          400
        )
      );
    }

    // Load all student names involved in the submission
    const studentIds = results.map((r) => r.student);
    const students = await Student.find({ _id: { $in: studentIds } }).select(
      "_id fullName"
    );

    //: Helper to get full name by ID
    const getStudentName = (studentId: string) => {
      const student = students.find((s) => s._id?.toString() === studentId);
      return student?.fullName || `Student(${studentId})`;
    };

    const examDoc = await Exam.findById(exam);
    if (!examDoc) {
      return next(new AppError("Exam not found", 404));
    }

    const examType = examDoc.exam_type;
    const maxAllowed = MAX_MARKS_MAP[examType];

    if (!maxAllowed) {
      return next(new AppError("Invalid exam type in exam record", 400));
    }

    const errors: string[] = [];
    const validUpdates = [];

    for (const entry of results) {
      const { student, marks } = entry;

      if (!student || marks === undefined || marks === null) {
        errors.push(`Missing student or marks`);
        // return next(new AppError("Missing student or marks", 400));
      }

      if (typeof marks !== "number" || marks < 0 || marks > maxAllowed) {
        errors.push(
          `Marks for student ${getStudentName(
            student
          )} must be between 0 and ${maxAllowed}`
        );
        continue;
        // return next(
        //   new AppError(
        //     `Marks for student ${getStudentName(
        //       student
        //     )} must be between 0 and ${maxAllowed}`,
        //     400
        //   )
        // );
      }
      const existing = await ExamResult.findOne({ exam, student, subject });
      if (existing) {
        errors.push(
          `Result already exists for student ${getStudentName(student)}`
        );
        continue;
        // return next(
        //   new AppError(
        //     `Result already exists for student ${getStudentName(student)}`,
        //     400
        //   )
        // );
      }

      // ✅ Stop and return if any error is found BEFORE saving
      if (errors.length > 0) {
        return res.status(200).json({
          status: "error",
          message: "Validation failed. No exam results were saved.",
          errors,
        });
      }

      validUpdates.push({
        updateOne: {
          filter: { exam, student, subject, class: classId },
          update: { $set: { exam, student, subject, class: classId, marks } },
          upsert: true,
        },
      });
    }

    if (validUpdates.length > 0) {
      await ExamResult.bulkWrite(validUpdates);
    }

    res.status(200).json({
      status: "success",
      errors: errors.length > 0 ? errors : undefined,
      message: `Saved ${validUpdates.length} exam result(s)`,
    });
  }
);

// get exams

// export const getExamResultsByType = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { exam_type } = req.query;

//     if (!exam_type) {
//       return next(new AppError("exam_type query param is required", 400));
//     }

//     // const allowedTypes = ["cw1", "cw2", "midterm", "final"];

//     // if (exam_type && !allowedTypes.includes(exam_type as string)) {
//     //   return next(new AppError("Invalid exam type", 400));
//     // }

//     const allowedTypes = ["cw1", "cw2", "midterm", "final"];
//     if (!allowedTypes.includes(exam_type as string)) {
//       return next(new AppError("Invalid exam type", 400));
//     }

//     // Fetch and populate exams
//     const results = await ExamResult.find()
//       .populate("exam")
//       .populate("student", "fullName student_id")
//       .populate("subject")
//       .populate("class");

//     // Filter by exam.exam_type
//     const filtered = exam_type
//       ? results.filter((r: any) => r.exam && r.exam.exam_type === exam_type)
//       : results;

//     res.status(200).json({
//       status: "success",
//       count: filtered.length,
//       data: filtered,
//     });
//   }
// );

export const getExamResultsByType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { exam_type, subject, class: classId } = req.query;

    const allowedTypes = ["cw1", "cw2", "midterm", "final"];

    if (!exam_type || !allowedTypes.includes(exam_type as string)) {
      return next(new AppError("Invalid or missing exam type", 400));
    }

    // Fetch and populate related documents
    const results = await ExamResult.find()
      .populate("exam")
      .populate("student", "fullName student_id")
      .populate("subject")
      .populate("class");

    // Filter by exam_type
    let filtered = results.filter(
      (r: any) => r.exam && r.exam.exam_type === exam_type
    );

    // Optional subject filter
    if (subject) {
      filtered = filtered.filter(
        (r: any) => r.subject && r.subject._id.toString() === subject
      );
    }

    // Optional class filter
    if (classId) {
      filtered = filtered.filter(
        (r: any) => r.class && r.class._id.toString() === classId
      );
    }

    res.status(200).json({
      status: "success",
      count: filtered.length,
      data: filtered,
    });
  }
);

export const updateStudentMark = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { student, exam, subject, marks } = req.body;

    if (!student || !exam || !subject || marks === undefined) {
      return next(
        new AppError("Student, exam, subject, and marks are required", 400)
      );
    }

    if (typeof marks !== "number" || marks < 0) {
      return next(new AppError("Marks must be a positive number", 400));
    }

    // Get exam to determine max allowed marks
    const examDoc = await Exam.findById(exam);
    if (!examDoc) {
      return next(new AppError("Exam not found", 404));
    }

    const maxAllowed = MAX_MARKS_MAP[examDoc.exam_type];
    if (marks > maxAllowed) {
      return next(
        new AppError(
          `Marks for "${examDoc.exam_type}" cannot exceed ${maxAllowed}`,
          400
        )
      );
    }

    // Find result by exam + student + subject
    const result = await ExamResult.findOneAndUpdate(
      { exam, student, subject },
      { $set: { marks } },
      { new: true }
    );

    if (!result) {
      return next(
        new AppError("Exam result for this student and subject not found", 404)
      );
    }

    res.status(200).json({
      status: "success",
      message: "Student mark updated successfully",
      data: result,
    });
  }
);

// get student exam results
export const getStudentExamResults = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentId } = req.params;
    const { subject, academic, exam_type } = req.query;

    if (!studentId) {
      return next(new AppError("Student ID is required", 400));
    }

    const results = await ExamResult.find({ student: studentId })
      .populate("exam")
      .populate("subject", "name code")
      .populate("class", "name");

    let filtered = results;

    // Filter by subject
    if (subject) {
      filtered = filtered.filter(
        (r) => r.subject && r.subject._id.toString() === subject
      );
    }

    // Filter by academic year
    if (academic) {
      filtered = filtered.filter(
        (r: any) =>
          r.exam && r.exam.academic && r.exam.academic.toString() === academic
      );
    }

    // Filter by exam_type
    if (exam_type) {
      filtered = filtered.filter(
        (r: any) => r.exam && r.exam.exam_type === exam_type
      );
      console.log("Filtered by exam_type:", exam_type);
    }

    res.status(200).json({
      status: "success",
      count: filtered.length,
      data: filtered,
    });
  }
);
