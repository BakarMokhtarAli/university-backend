import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import Exam from "../models/exam.model";

export const createExam = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, exam_type, date, academic } = req.body;

    if (!title || !exam_type || !date) {
      return next(new AppError("Title, exam type, and date are required", 400));
    }

    if (!["cw1", "cw2", "midterm", "final"].includes(exam_type)) {
      return next(
        new AppError(
          "Invalid exam type. Must be one of: cw1, cw2, midterm, final",
          400
        )
      );
    }

    const exam = await Exam.create({
      title,
      exam_type,
      date,
      academic,
    });

    res.status(201).json({
      status: "success",
      message: "Exam created successfully",
      data: exam,
    });
  }
);

// get all exams
export const getAllExams = catchAsync(async (req: Request, res: Response) => {
  const exams = await Exam.find().populate("academic").populate("results");
  res.status(200).json({
    status: "success",
    message: "Exams retrieved successfully",
    exams,
  });
});

// get exam by id
export const getExamById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const exam = await Exam.findById(req.params.id).populate("academic");
    if (!exam) {
      return next(new AppError("Exam not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Exam retrieved successfully",
      exam,
    });
  }
);
// update exam by id
export const updateExamById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!exam) {
      return next(new AppError("Exam not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Exam updated successfully",
      exam,
    });
  }
);

// delete exam by id
export const deleteExamById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return next(new AppError("Exam not found", 404));
    }

    res.status(204).json({
      status: "success",
      message: "Exam deleted successfully",
      exam,
    });
  }
);
