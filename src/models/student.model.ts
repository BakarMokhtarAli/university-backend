import mongoose, { Document } from "mongoose";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config"; // Assuming JWT_SECRET is in config

export interface IStudent extends Document {
  // Personal Information
  fullName: string;
  class: mongoose.Types.ObjectId;
  image: string | null;
  dateOfBirth?: Date;
  placeOfBirth?: string;
  motherName?: string;
  maritalStatus?: "Single" | "Married";
  email?: string;
  mobile?: string;
  address?: string;
  sex: "Male" | "Female";
  id_number: string;
  student_id: string;
  marks?: string; // Or number
  faculty?: mongoose.Types.ObjectId; // Could be mongoose.Types.ObjectId if referencing a Faculty model
  // Added for student login (WARNING: Storing passwords in plain text is a security risk)
  password?: string;

  // Method to generate JWT
  generateAuthToken(): string;
}

const studentSchema = new mongoose.Schema<IStudent>(
  {
    // Personal Information
    student_id: { type: String, unique: true }, // Unique student identifier
    fullName: { type: String, required: true },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    image: { type: String },
    dateOfBirth: { type: Date },
    placeOfBirth: { type: String },

    motherName: { type: String },
    email: { type: String },
    mobile: { type: String },
    address: { type: String },

    sex: { type: String, enum: ["Male", "Female"], required: true },

    id_number: {
      type: String,
      // required: true,
      unique: true,
    },
    marks: { type: String }, // Or maybe Number, depending on how marks are stored
    faculty: { type: mongoose.Types.ObjectId, ref: "Faculty" }, // This could be more structured later
    // Added for student login (WARNING: Storing passwords in plain text is a security risk)
    password: { type: String, default: "123" },
  },
  { timestamps: true }
);

// Auto-generate ID before save
// studentSchema.pre<IStudent>("save", async function (next) {
//   if (!this.isNew) return next();

//   try {
//     const counter = await Counter.findByIdAndUpdate(
//       { _id: "studentId" },
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true }
//     );
//     this.id_number = counter.seq.toString(); // Use the sequence number as the student ID
//     next();
//   } catch (error: any) {
//     next(error);
//   }
// });

// Method to generate JWT
studentSchema.methods.generateAuthToken = function () {
  const payload = {
    id: this._id,
    // Add other necessary student details to payload if needed, e.g., email or roll number
  };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d", // Token Expires in 1 day
  });
};

studentSchema.set("toJSON", { virtuals: true });
studentSchema.set("toObject", { virtuals: true });

studentSchema.virtual("results", {
  ref: "ExamResult", // Assuming you have a Result model
  localField: "_id",
  foreignField: "student",
});

const Student = mongoose.model<IStudent>("Student", studentSchema);

export default Student;
