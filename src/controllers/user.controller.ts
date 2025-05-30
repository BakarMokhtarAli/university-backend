import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import User, { IUser } from "../models/user.model";
import { AuthRequest } from "../middleware/protect";

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    message: "Users retrieved successfully",
    users,
  });
});

// get user by id
export const getUserById = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "User retrieved successfully",
      user,
    });
  }
);
