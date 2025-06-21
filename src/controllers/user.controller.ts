import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import User, { IUser } from "../models/user.model";
import { AuthRequest } from "../middleware/protect";

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find().select("+password");
  res.status(200).json({
    status: "success",
    message: "Users retrieved successfully",
    users,
  });
});

// get user by id
export const getUserById = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id).select("+password");
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

// create user
export const createUser = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const user = await User.create(req.body);

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      user,
    });
  }
);

//update user
export const updateUser = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      user: updatedUser,
    });
  }
);

//delete user
export const deleteUser = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      user: deletedUser,
    });
  }
);
