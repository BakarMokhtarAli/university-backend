import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import Student from "../models/student.model";
import { AuthRequest } from "../middleware/protect"; // Assuming you have an AuthRequest type
import { IStudent } from "../models/student.model"; // Import the interface

// Get all students
export const getAllStudents = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const students = await Student.find();
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
    const student = await Student.findById(req.params.id);
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
    const newStudent = new Student(req.body);
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
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
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
