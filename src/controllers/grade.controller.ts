import exceljs from "exceljs";
import { NextFunction, Request, Response } from "express";
import Grade from "../models/grade.model";
import Student from "../models/student.model";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";

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

      // Get student IDs
      const students = await Student.find({}, "id_number");
      const studentMap = new Map(students.map((s) => [s.id_number, s._id]));

      console.log("studentsMap", studentMap);

      // Process rows
      for (let i = 2; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i);
        const studentId = row.getCell(1).value?.toString()?.trim();
        const cw1 = parseFloat(row.getCell(3).value?.toString() || "");
        const midterm = parseFloat(row.getCell(4).value?.toString() || "");
        const cw2 = parseFloat(row.getCell(5).value?.toString() || "");
        const final = parseFloat(row.getCell(6).value?.toString() || "");

        // Validate student exists
        if (!studentId || !studentMap.has(studentId)) {
          errors.push(`Row ${i}: Invalid student ID`);
          continue; // Skip entire row
        }
        const studentObjId = studentMap.get(studentId);

        // Validate grade ranges and component limits
        const grades = { cw1, midterm, cw2, final };
        let hasError = false;

        // Component validation
        if (!isNaN(cw1) && (cw1 < 0 || cw1 > 10)) {
          errors.push(`Row ${i}: CW1 must be between 0-10`);
          hasError = true;
        }
        if (!isNaN(midterm) && (midterm < 0 || midterm > 30)) {
          errors.push(`Row ${i}: Midterm must be between 0-30`);
          hasError = true;
        }
        if (!isNaN(cw2) && (cw2 < 0 || cw2 > 10)) {
          errors.push(`Row ${i}: CW2 must be between 0-10`);
          hasError = true;
        }
        if (!isNaN(final) && (final < 0 || final > 60)) {
          errors.push(`Row ${i}: Final must be between 0-60`);
          hasError = true;
        }

        // Only check total if all grades are numbers
        if (!isNaN(cw1) && !isNaN(midterm) && !isNaN(cw2) && !isNaN(final)) {
          const total = cw1 + midterm + cw2 + final;
          if (total > 100) {
            errors.push(`Row ${i}: Total must be <= 100`);
            hasError = true;
          }
        }

        // Skip invalid rows
        if (hasError) continue;

        // Add valid grades to updates
        updates.push({
          student: studentObjId,
          class: classId,
          subject: subjectId,
          cw1: isNaN(cw1) ? undefined : cw1,
          midterm: isNaN(midterm) ? undefined : midterm,
          cw2: isNaN(cw2) ? undefined : cw2,
          final: isNaN(final) ? undefined : final,
        });
      }

      if (errors.length > 0) return next(new AppError(errors.join("\n"), 400));

      // Update database
      if (updates.length > 0) {
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
