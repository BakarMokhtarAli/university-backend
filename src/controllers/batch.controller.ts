import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import Batch from "../models/batch.model";
import { AuthRequest } from "../middleware/protect";

export const getAllBatches = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const batches = await Batch.find();
    res.status(200).json({
      status: "success",
      message: "Batches retrieved successfully",
      batches,
    });
  }
);

// get batch by id
export const getBatchById = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return next(new AppError("Batch not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Batch retrieved successfully",
      batch,
    });
  }
);

// create a new batch
export const createBatch = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const batch = new Batch(req.body);
    await batch.save();

    res.status(201).json({
      status: "success",
      message: "Batch created successfully",
      batch,
    });
  }
);

// update a batch
export const updateBatch = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!batch) {
      return next(new AppError("Batch not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Batch updated successfully",
      batch,
    });
  }
);

// delete a batch
export const deleteBatch = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) {
      return next(new AppError("Batch not found", 404));
    }

    res.status(204).json({
      status: "success",
      message: "Batch deleted successfully",
      batch,
    });
  }
);
