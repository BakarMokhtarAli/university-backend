import { Request, Response, NextFunction, CookieOptions } from "express";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import User, { IUser } from "../models/user.model";
import Student from "../models/student.model";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "mechanic" | "customer";
}

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body as RegisterInput;

  const user = await User.create({
    name,
    email,
    password,

    role,
  });

  res.status(201).json({
    status: "success",
    message: "User created successfully!",
    user,
  });
});

// login
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as LoginInput;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Invalid email or password", 401));
    }
    if (!user.is_active) {
      return next(
        new AppError(
          "Your account is not active yet. Please contact the admin.",
          401
        )
      );
    }
    // sendTokenResponse(user, 200, res);
    const token = user.generateAuthToken();
    res.status(200).json({
      status: "success",
      message: "Logged in successfully",
      token,
      user,
    });
  }
);

export const studentLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { student_id, password } = req.body;

    if (!student_id || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    // Find the student by email and select the password field
    const student = await Student.findOne({ student_id });

    // Check if the student exists and the plain text password matches
    // WARNING: Comparing plain text passwords is a security risk
    if (!student || student.password !== password) {
      return next(new AppError("Invalid student ID or password", 401));
    }

    // Generate JWT token
    const token = student.generateAuthToken();

    res.status(200).json({
      status: "success",
      message: "Student logged in successfully",
      student: student,
      token,
    });
  }
);
