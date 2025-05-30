import mongoose, { Document } from "mongoose";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config"; // Assuming JWT_SECRET is in config

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

export interface IStudent extends Document {
  // Personal Information
  fullName: string;
  class: mongoose.Types.ObjectId;
  dateOfBirth?: Date;
  placeOfBirth?: string;
  nationality?: string;
  residency?: string;
  motherName?: string;
  maritalStatus?: "Single" | "Married";
  email?: string;
  mobile?: string;
  address?: string;
  nextOfKin?: string;
  nextOfKinRelationship?: string;
  sex: "Male" | "Female";
  identificationType?: string;
  issueDate?: Date;
  expiryDate?: Date;
  documentNo?: string;
  placeOfIssue?: string;

  // Academic Information
  schoolName?: string;
  graduationYear?: number;
  id_number: string;
  marks?: string; // Or number
  faculty?: mongoose.Types.ObjectId; // Could be mongoose.Types.ObjectId if referencing a Faculty model
  programMode?: "Full Time" | "Part Time";
  studentSignature?: string; // Assuming this is a file path or similar
  academicDate?: Date;

  // Added for student login (WARNING: Storing passwords in plain text is a security risk)
  password?: string;

  // Method to generate JWT
  generateAuthToken(): string;
}

const studentSchema = new mongoose.Schema<IStudent>({
  // Personal Information
  fullName: { type: String, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  dateOfBirth: { type: Date },
  placeOfBirth: { type: String },
  nationality: { type: String },
  residency: { type: String },
  motherName: { type: String },
  maritalStatus: { type: String, enum: ["Single", "Married"] },
  email: { type: String },
  mobile: { type: String },
  address: { type: String },
  nextOfKin: { type: String },
  nextOfKinRelationship: { type: String },
  sex: { type: String, enum: ["Male", "Female"], required: true },
  identificationType: {
    type: String,
  },
  issueDate: { type: Date },
  expiryDate: { type: Date },
  documentNo: { type: String },
  placeOfIssue: { type: String },

  // Academic Information
  schoolName: { type: String },
  graduationYear: { type: Number },
  id_number: {
    type: String,
    // required: true,
    unique: true,
  },
  marks: { type: String }, // Or maybe Number, depending on how marks are stored
  faculty: { type: mongoose.Types.ObjectId, ref: "Faculty" }, // This could be more structured later
  programMode: { type: String, enum: ["Full Time", "Part Time"] },
  studentSignature: { type: String }, // Assuming this is a file path or similar
  academicDate: { type: Date }, // Naming to differentiate from dateOfBirth

  // Added for student login (WARNING: Storing passwords in plain text is a security risk)
  password: { type: String, default: "123" },
});

// Auto-generate ID before save
studentSchema.pre<IStudent>("save", async function (next) {
  if (!this.isNew) return next();

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "studentId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.id_number = `STU${counter.seq.toString().padStart(3, "0")}`;
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to generate JWT
studentSchema.methods.generateAuthToken = function () {
  const payload = {
    id: this._id,
    // Add other necessary student details to payload if needed, e.g., email or roll number
  };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d", // Token expires in 1 day
  });
};

const Student = mongoose.model<IStudent>("Student", studentSchema);

export default Student;
