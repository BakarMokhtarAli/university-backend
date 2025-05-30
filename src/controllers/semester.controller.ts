import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import Semester, { ISemester } from "../models/semester.model";
import { AuthRequest } from "../middleware/protect";

export const getAllSemesters = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const semesters = await Semester.find();
    res.status(200).json({
      status: "success",
      message: "Semesters retrieved successfully",
      semesters,
    });
  }
);

// get semester by id
export const getSemesterById = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const semester = await Semester.findById(req.params.id);
    if (!semester) {
      return next(new AppError("Semester not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Semester retrieved successfully",
      semester,
    });
  }
);

// create a new semester
export const createSemester = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const semester = new Semester(req.body);
    await semester.save();

    res.status(201).json({
      status: "success",
      message: "Semester created successfully",
      semester,
    });
  }
);

// update a semester
export const updateSemester = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const semester = await Semester.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!semester) {
      return next(new AppError("Semester not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Semester updated successfully",
      semester,
    });
  }
);

// delete a semester
export const deleteSemester = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const semester = await Semester.findByIdAndDelete(req.params.id);
    if (!semester) {
      return next(new AppError("Semester not found", 404));
    }

    res.status(204).json({
      status: "success",
      message: "Semester deleted successfully",
      semester,
    });
  }
);
