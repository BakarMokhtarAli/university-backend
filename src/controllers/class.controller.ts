import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import Class, { IClass } from "../models/class.model";
import { AuthRequest } from "../middleware/protect";

export const getAllClasses = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const classes = await Class.find()
      .populate({
        path: "students",
        select: "fullName sex id_number",
      })
      .populate("faculty");
    res.status(200).json({
      status: "success",
      message: "Classes retrieved successfully",
      classes,
    });
  }
);

// get class by id
export const getClassById = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const class_ = await Class.findById(req.params.id)
      .populate("faculty")
      .populate({
        path: "students",
        select: "fullName sex id_number",
      });
    if (!class_) {
      return next(new AppError("Class not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Class retrieved successfully",
      class_,
    });
  }
);

// create a new class
export const createClass = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const class_ = new Class(req.body);
    await class_.save();

    res.status(201).json({
      status: "success",
      message: "Class created successfully",
      class_,
    });
  }
);

// update a class
export const updateClass = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const class_ = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!class_) {
      return next(new AppError("Class not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Class updated successfully",
      class_,
    });
  }
);

// delete a class
export const deleteClass = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const class_ = await Class.findByIdAndDelete(req.params.id);
    if (!class_) {
      return next(new AppError("Class not found", 404));
    }

    res.status(204).json({
      status: "success",
      message: "Class deleted successfully",
      class_,
    });
  }
);
