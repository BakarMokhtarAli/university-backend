import { NextFunction, Request, Response } from "express";
import Timetable from "../models/timetable.model";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { AuthRequest } from "../middleware/protect";

// CREATE Timetable Entry
export const createTimetable = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const {
      class_id,
      subject_id,
      faculty_id,
      academic_id,
      day_of_week,
      start_time,
      end_time,
      location,
      date,
    } = req.body;

    if (
      !class_id ||
      !subject_id ||
      !faculty_id ||
      !academic_id ||
      !day_of_week ||
      !start_time ||
      !end_time ||
      !location ||
      !date
    ) {
      return next(new AppError("All fields are required", 400));
    }

    // Generate a unique timetable_id (e.g., TTB01, TTB02, etc.)
    const generateTimetableId = async () => {
      let timetableId = 1;
      let exists = true;

      while (exists) {
        const id = `TTB${timetableId}`;
        exists = !!(await Timetable.exists({ timetable_id: id }));
        if (exists) timetableId++;
      }

      return `TTB${timetableId}`;
    };

    const timetable_id = await generateTimetableId();
    const timetable = await Timetable.create({
      timetable_id,
      class_id,
      subject_id,
      faculty_id,
      academic_id,
      day_of_week,
      start_time,
      end_time,
      location,
      date,
    });

    res.status(201).json({
      status: "success",
      data: timetable,
    });
  }
);

// GET all timetable entries
export const getAllTimetables = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const timetables = await Timetable.find()
      .populate("class_id")
      .populate("subject_id")
      .populate("faculty_id")
      .populate("academic_id");

    res.status(200).json({
      status: "success",
      results: timetables.length,
      data: timetables,
    });
  }
);

// update timetable
export const updateTimetable = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { timetable_id } = req.params;

    const timetableToUpdate = await Timetable.findById(timetable_id);

    if (!timetableToUpdate)
      return next(new AppError("Timetable not found", 404));
    const updatedTimeTable = await Timetable.findByIdAndUpdate(
      timetable_id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    console.log("updatedTimeTable", updatedTimeTable);

    res.status(200).json({
      status: "success",
      message: "Timetable updated successfully",
      timetable: updatedTimeTable,
    });
  }
);

// delete a timetable
export const deleteTimetable = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { timetable_id } = req.params;
    const deletedTimeTable = await Timetable.findByIdAndDelete(timetable_id);
    res.status(204).json({
      status: "success",
      message: "Timetable deleted successfully",
    });
  }
);

// OPTIONAL: GET timetable for a specific class or faculty
export const getTimetableByFilter = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { class_id, faculty_id, academic_id } = req.query;

    const filter: any = {};
    if (class_id) filter.class_id = class_id;
    if (faculty_id) filter.faculty_id = faculty_id;
    if (academic_id) filter.academic_id = academic_id;

    const timetables = await Timetable.find(filter)
      .populate("class_id")
      .populate("subject_id")
      .populate("faculty_id")
      .populate("academic_id");

    res.status(200).json({
      status: "success",
      results: timetables.length,
      data: timetables,
    });
  }
);

// GET timetable by academic year
export const getTimetableByAcademic = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { academic_id } = req.params;

    if (!academic_id) {
      return next(new AppError("Academic ID is required", 400));
    }

    const timetables = await Timetable.find({ academic_id })
      .populate("subject_id", "name code")
      .populate("faculty_id", "name")
      .populate("class_id", "name");

    res.status(200).json({
      status: "success",
      results: timetables.length,
      data: timetables,
    });
  }
);
