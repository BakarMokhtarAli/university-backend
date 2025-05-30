import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import Subject from "../models/subject.model";
import { AuthRequest } from "../middleware/protect";

// Create a new subject
export const createSubject = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const subject = new Subject(req.body);
    await subject.save();

    res.status(201).json({
      status: "success",
      message: "Subject created successfully",
      subject,
    });
  }
);

// Get all subjects
export const getAllSubjects = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const subjects = await Subject.find().populate("faculty", "name");
    res.status(200).json({
      status: "success",
      message: "Subjects retrieved successfully",
      subjects,
    });
  }
);

// Get subject by ID
export const getSubjectById = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const subject = await Subject.findById(req.params.id).populate(
      "faculty",
      "name"
    );

    if (!subject) {
      return next(new AppError("Subject not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Subject retrieved successfully",
      subject,
    });
  }
);

// Update a subject
export const updateSubject = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!subject) {
      return next(new AppError("Subject not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Subject updated successfully",
      subject,
    });
  }
);

// Delete a subject
export const deleteSubject = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return next(new AppError("Subject not found", 404));
    }

    res.status(204).json({
      status: "success",
      message: "Subject deleted successfully",
      subject,
    });
  }
);
