import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import Faculty, { IFaculty } from "../models/faculty.model";
import { AuthRequest } from "../middleware/protect";

export const getAllFaculties = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const faculties = await Faculty.find().populate("dean");
    res.status(200).json({
      status: "success",
      message: "Faculties retrieved successfully",
      faculties,
    });
  }
);

// get faculty by id
export const getFacultyById = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return next(new AppError("Faculty not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Faculty retrieved successfully",
      faculty,
    });
  }
);

// create a new faculty
export const createFaculty = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const faculty = new Faculty(req.body);
    await faculty.save();

    res.status(201).json({
      status: "success",
      message: "Faculty created successfully",
      faculty,
    });
  }
);

// update a faculty
export const updateFaculty = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faculty) {
      return next(new AppError("Faculty not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Faculty updated successfully",
      faculty,
    });
  }
);

// delete a faculty
export const deleteFaculty = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) {
      return next(new AppError("Faculty not found", 404));
    }

    res.status(204).json({
      status: "success",
      message: "Faculty deleted successfully",
      faculty,
    });
  }
);
