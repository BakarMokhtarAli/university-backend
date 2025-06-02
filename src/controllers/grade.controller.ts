// import exceljs from "exceljs";
// import { NextFunction, Request, Response } from "express";
// import Grade from "../models/grade.model";
// import Student from "../models/student.model";
// import AppError from "../utils/AppError";
// import catchAsync from "../utils/catchAsync";

// // Upload grades from Excel
// export const uploadGrades = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     if (!req.file) return next(new AppError("No file uploaded", 400));

//     const { classId, subjectId } = req.body;
//     if (!classId || !subjectId) {
//       return next(new AppError("Class ID and Subject ID are required", 400));
//     }

//     try {
//       const workbook = new exceljs.Workbook();
//       await workbook.xlsx.load(req.file.buffer);
//       const worksheet = workbook.worksheets[0];
//       const errors: string[] = [];
//       const updates: any[] = [];

//       // Get student IDs for validation
//       const students = await Student.find({}, "id_number");
//       const studentMap = new Map(students.map((s) => [s.id_number, s._id]));

//       // Process rows (skip header row)
//       for (let i = 2; i <= worksheet.rowCount; i++) {
//         const row = worksheet.getRow(i);
//         const studentId = row.getCell(1).value?.toString()?.trim();
//         const cw1 = parseFloat(row.getCell(3).value?.toString() || "");
//         const midterm = parseFloat(row.getCell(4).value?.toString() || "");
//         const cw2 = parseFloat(row.getCell(5).value?.toString() || "");
//         const final = parseFloat(row.getCell(6).value?.toString() || "");

//         // Validate student
//         if (!studentId || !studentMap.has(studentId)) {
//           errors.push(`Row ${i}: Invalid student ID`);
//           continue;
//         }

//         // Validate grades
//         const grades = { cw1, midterm, cw2, final };
//         for (const [key, value] of Object.entries(grades)) {
//           if (!isNaN(value) && (value < 0 || value > 100)) {
//             errors.push(`Row ${i}: ${key} must be between 0-100`);
//           }
//         }

//         updates.push({
//           student: studentMap.get(studentId),
//           class: classId,
//           subject: subjectId,
//           cw1: isNaN(cw1) ? undefined : cw1,
//           midterm: isNaN(midterm) ? undefined : midterm,
//           cw2: isNaN(cw2) ? undefined : cw2,
//           final: isNaN(final) ? undefined : final,
//         });
//       }

//       // Update database
//       const bulkOps = updates.map((update) => ({
//         updateOne: {
//           filter: {
//             student: update.student,
//             class: update.class,
//             subject: update.subject,
//           },
//           update: { $set: update },
//           upsert: true,
//         },
//       }));

//       if (bulkOps.length > 0) {
//         await Grade.bulkWrite(bulkOps);
//       }

//       res.status(200).json({
//         status: "success",
//         message: "Grades updated successfully",
//         updated: updates.length,
//         errors: errors.length > 0 ? errors : undefined,
//       });
//     } catch (error) {
//       next(new AppError("Error processing Excel file", 400));
//     }
//   }
// );
// // Get grades for class and subject
// export const getClassGrades = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { classId, subjectId } = req.query;

//     if (!classId || !subjectId) {
//       return next(new AppError("Class ID and Subject ID are required", 400));
//     }

//     const grades = await Grade.find({ class: classId, subject: subjectId })
//       .populate({
//         path: "student",
//         select: "fullName id_number",
//       })
//       .sort({ "student.fullName": 1 });

//     res.status(200).json({
//       status: "success",
//       results: grades.length,
//       grades,
//     });
//   }
// );

// grade.controller.ts

import exceljs from "exceljs";
import { NextFunction, Request, Response } from "express";
import Grade from "../models/grade.model";
import Student from "../models/student.model";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";

// Upload grades from Excel
export const uploadGrades = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next(new AppError("No file uploaded", 400));

    const { classId, subjectId } = req.body;
    if (!classId || !subjectId) {
      return next(new AppError("Class ID and Subject ID are required", 400));
    }

    try {
      const workbook = new exceljs.Workbook();
      await workbook.xlsx.load(req.file.buffer);
      const worksheet = workbook.worksheets[0];
      const errors: string[] = [];
      const updates: any[] = [];

      // Get student IDs for validation
      const students = await Student.find({}, "id_number");
      const studentMap = new Map(students.map((s) => [s.id_number, s._id]));

      // Process rows (skip header row)
      for (let i = 2; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i);
        const studentId = row.getCell(1).value?.toString()?.trim();
        const cw1 = parseFloat(row.getCell(3).value?.toString() || "");
        const midterm = parseFloat(row.getCell(4).value?.toString() || "");
        const cw2 = parseFloat(row.getCell(5).value?.toString() || "");
        const final = parseFloat(row.getCell(6).value?.toString() || "");

        // Validate student
        if (!studentId || !studentMap.has(studentId)) {
          errors.push(`Row ${i}: Invalid student ID`);
          continue;
        }

        // Validate grades
        const grades = { cw1, midterm, cw2, final };
        for (const [key, value] of Object.entries(grades)) {
          if (!isNaN(value) && (value < 0 || value > 100)) {
            errors.push(`Row ${i}: ${key} must be between 0-100`);
          }
        }

        updates.push({
          student: studentMap.get(studentId),
          class: classId,
          subject: subjectId,
          cw1: isNaN(cw1) ? undefined : cw1,
          midterm: isNaN(midterm) ? undefined : midterm,
          cw2: isNaN(cw2) ? undefined : cw2,
          final: isNaN(final) ? undefined : final,
        });
      }

      // Update database
      const bulkOps = updates.map((update) => ({
        updateOne: {
          filter: {
            student: update.student,
            class: update.class,
            subject: update.subject,
          },
          update: { $set: update },
          upsert: true,
        },
      }));

      if (bulkOps.length > 0) {
        await Grade.bulkWrite(bulkOps);
      }

      res.status(200).json({
        status: "success",
        message: "Grades updated successfully",
        updated: updates.length,
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (error) {
      next(new AppError("Error processing Excel file", 400));
    }
  }
);

// Get grades for class and subject (compute total & average server-side)
export const getClassGrades = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { classId, subjectId } = req.query;

    if (!classId || !subjectId) {
      return next(new AppError("Class ID and Subject ID are required", 400));
    }

    const grades = await Grade.find({ class: classId, subject: subjectId })
      .populate({
        path: "student",
        select: "fullName id_number",
      })
      .sort({ "student.fullName": 1 });

    const gradesWithComputed = grades.map((g) => {
      const cw1 = g.cw1 ?? 0;
      const midterm = g.midterm ?? 0;
      const cw2 = g.cw2 ?? 0;
      const final = g.final ?? 0;

      let total = cw1 + midterm + cw2 + final;
      if (total > 100) total = 100;

      const average = Math.round(total / 4);

      return {
        id: g._id,
        student: g.student, // { _id, fullName, id_number }
        cw1: g.cw1,
        midterm: g.midterm,
        cw2: g.cw2,
        final: g.final,
        total,
        average,
      };
    });

    res.status(200).json({
      status: "success",
      results: gradesWithComputed.length,
      grades: gradesWithComputed,
    });
  }
);

// Delete grades by class and subject
export const deleteGrades = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { classId, subjectId } = req.body;
    if (!classId || !subjectId) {
      return next(new AppError("Class ID and Subject ID are required", 400));
    }

    const result = await Grade.deleteMany({
      class: classId,
      subject: subjectId,
    });
    res.status(200).json({
      status: "success",
      message: `Deleted ${result.deletedCount} grades for class ${classId} and subject ${subjectId}`,
    });
  }
);
