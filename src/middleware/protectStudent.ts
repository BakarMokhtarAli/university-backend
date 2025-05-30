import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import Student, { IStudent } from "../models/student.model";
import { JWT_SECRET } from "../config"; // Assuming JWT_SECRET is in config

// Extend the Request interface to include the student property
export interface StudentAuthRequest extends Request {
  student?: IStudent; // Optional for now, will be set by middleware
}

export const protectStudent = catchAsync(
  async (req: StudentAuthRequest, res: Response, next: NextFunction) => {
    let token;
    // Check if token is in the Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Token")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // You could also check for a token in cookies if that's how you send it after login
    // else if (req.cookies.token) {
    //   token = req.cookies.token;
    // }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    // Verify token
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Find student by ID from token payload
    const currentStudent = await Student.findById(decoded.id);

    if (!currentStudent) {
      return next(
        new AppError(
          "The student belonging to this token does no longer exist.",
          401
        )
      );
    }

    // Attach the student to the request object
    req.student = currentStudent;
    next();
  }
);
