import mongoose, { Document, Schema, Types } from "mongoose";
import { IStudent } from "./student.model";
import { IClass } from "./class.model";
import { ISubject } from "./subject.model";

export interface IGrade extends Document {
  student: Types.ObjectId | IStudent;
  class: Types.ObjectId | IClass;
  subject: Types.ObjectId | ISubject;
  cw1?: number;
  midterm?: number;
  cw2?: number;
  final?: number;
  total?: number;
}

const gradeSchema = new Schema<IGrade>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    cw1: { type: Number, min: 0, max: 100 },
    midterm: { type: Number, min: 0, max: 100 },
    cw2: { type: Number, min: 0, max: 100 },
    final: { type: Number, min: 0, max: 100 },
    total: { type: Number, min: 0, max: 400 }, // Max 400 (100*4)
  },
  { timestamps: true }
);

// Calculate total before saving
gradeSchema.pre<IGrade>("save", function (next) {
  this.total =
    (this.cw1 || 0) + (this.midterm || 0) + (this.cw2 || 0) + (this.final || 0);
  next();
});

// Prevent duplicate grades for same student+class+subject
gradeSchema.index({ student: 1, class: 1, subject: 1 }, { unique: true });

const Grade = mongoose.model<IGrade>("Grade", gradeSchema);
export default Grade;
