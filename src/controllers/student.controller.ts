import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import Student from "../models/student.model";
import { AuthRequest } from "../middleware/protect"; // Assuming you have an AuthRequest type
import { IStudent } from "../models/student.model"; // Import the interface
import Class from "../models/class.model";
import Faculty from "../models/faculty.model";
import Counter from "../models/counter.model";

// Get all students
export const getAllStudents = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const students = await Student.find()
      .populate("class")
      .populate("faculty")
      .sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      message: "Students retrieved successfully",
      students,
    });
  }
);

// Get student by id
export const getStudentById = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const student = await Student.findById(req.params.id).populate("class");
    if (!student) {
      return next(new AppError("Student not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Student retrieved successfully",
      student,
    });
  }
);

// Create a new student
export const createStudent = catchAsync(
  async (req: AuthRequest, res: Response) => {
    // 1. Get the class document
    const classDoc = await Class.findById(req.body.class);
    if (!classDoc) {
      throw new AppError("Class not found", 404);
    }

    // 2. Get the faculty ID from class
    const facultyId = classDoc.faculty;
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      throw new AppError(
        `this class ${classDoc.name} does not have a faculty`,
        404
      );
    }

    const facultyCode = faculty.faculty_id; // e.g., "CIS"

    const year = new Date().getFullYear().toString().slice(-2); // "25"
    const fixed = "05";

    // 3. Get auto-increment number
    const counter = await Counter.findByIdAndUpdate(
      { _id: "studentId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const increment = counter.seq.toString().padStart(2, "0"); // e.g. 01
    const student_id = `${facultyCode}${year}${fixed}${increment}`; // e.g. CIS250501

    // 5. Create student
    const newStudent = new Student({
      ...req.body,
      student_id,
      faculty: facultyId,
      id_number: increment,
    });
    await newStudent.save();

    res.status(201).json({
      status: "success",
      message: "Student created successfully",
      student: newStudent,
    });
  }
);

// Update a student
export const updateStudent = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    // check if class has a faculty
    const classDoc = await Class.findById(req.body.class);
    if (!classDoc) {
      throw new AppError("Class not found", 404);
    }
    const facultyId = classDoc.faculty;
    const faculty = await Faculty.findById(facultyId);
    console.log("facultyId", facultyId);

    if (!faculty) {
      throw new AppError(
        `this class ${classDoc.name} does not have a faculty`,
        404
      );
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { ...req.body, faculty: facultyId },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!student) {
      return next(new AppError("Student not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Student updated successfully",
      student,
    });
  }
);

// Delete a student
export const deleteStudent = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return next(new AppError("Student not found", 404));
    }

    // You might want to send a 204 No Content response for successful deletion
    res.status(204).json({
      status: "success",
      message: "Student deleted successfully",
      data: null,
    });
  }
);

// Get all students by class
export const getAllStudentsByClass = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { class_id } = req.params;
    if (!class_id) {
      return next(new AppError("Class ID is required", 400));
    }
    const students = await Student.find({ class: class_id });
    res.status(200).json({
      status: "success",
      // message: "Students retrieved successfully",
      results: students.length,
      students,
    });
  }
);
