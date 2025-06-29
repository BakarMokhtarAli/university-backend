import { NextFunction, Request, Response } from "express";
import Academic from "../models/academic.model";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { AuthRequest } from "../middleware/protect";

// CREATE Academic Year
export const createAcademic = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { academic_year, semester_id, batch_id, start_date, end_date } =
      req.body;

    if (!academic_year || !start_date || !end_date) {
      return next(new AppError("All fields are required", 400));
    }

    const generateacademicId = async () => {
      let academinId = 1;
      let exists = true;

      while (exists) {
        const id = `ACC${academinId}`;
        exists = !!(await Academic.exists({ academic_id: id }));
        if (exists) academinId++;
      }

      return `ACC${academinId}`;
    };
    const academic_id = await generateacademicId();

    const academic = await Academic.create({
      academic_id,
      academic_year,
      batch_id,
      semester_id,
      start_date,
      end_date,
    });

    res.status(201).json({
      status: "success",
      data: academic,
    });
  }
);

// GET all academic sessions
export const getAllAcademic = catchAsync(
  async (req: Request, res: Response) => {
    const academicList = await Academic.find()
      .populate("semester_id")
      .populate("batch_id");

    res.status(200).json({
      status: "success",
      results: academicList.length,
      data: academicList,
    });
  }
);

// GET single academic session
export const getAcademicById = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const academic = await Academic.findOne({
      academic_id: req.params.id,
    }).populate("semester_id");

    if (!academic) {
      return next(new AppError("Academic session not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: academic,
    });
  }
);
