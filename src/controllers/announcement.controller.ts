import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import Announcement from "../models/Announcement.model";

// Create a new announcement
export const createAnnouncement = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, receiver } = req.body;

    if (!title || !description || !receiver) {
      return next(new AppError("All fields are required", 400));
    }

    const announcement = await Announcement.create({
      title,
      description,
      receiver,
    });

    res.status(201).json({
      status: "success",
      message: "Announcement created successfully",
      announcement,
    });
  }
);

// Get all announcements (optionally filter by receiver)
export const getAllAnnouncements = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { receiver } = req.query;
    const filter = receiver ? { receiver } : {};

    
    

    const announcements = await Announcement.find(filter).sort({ _id: -1 });

    res.status(200).json({
      status: "success",
      count: announcements.length,
      announcements,
    });
  }
);

// Get one announcement by ID
export const getAnnouncementById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return next(new AppError("Announcement not found", 404));
    }

    res.status(200).json({
      status: "success",
      announcement,
    });
  }
);

// Update an announcement
export const updateAnnouncement = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return next(new AppError("Announcement not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Announcement updated successfully",
      announcement,
    });
  }
);

// Delete an announcement
export const deleteAnnouncement = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return next(new AppError("Announcement not found", 404));
    }

    res.status(204).json({
      status: "success",
      message: "Announcement deleted successfully",
    });
  }
);
