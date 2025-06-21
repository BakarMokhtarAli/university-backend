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
    cw1: {
      type: Number,
      min: 0,
      max: 10,
      validate: {
        validator: function (value) {
          return value >= 0 && value <= 10;
        },
        message: "{VALUE} must be between 0 and 10 for CW1",
      },
    },
    midterm: {
      type: Number,
      min: 0,
      max: 30,
      validate: {
        validator: function (value) {
          return value >= 0 && value <= 30;
        },
        message: "{VALUE} must be between 0 and 30 for Midterm",
      },
    },
    cw2: {
      type: Number,
      min: 0,
      max: 10,
      validate: {
        validator: function (value) {
          return value >= 0 && value <= 10;
        },
        message: "{VALUE} must be between 0 and 10 for CW2",
      },
    },
    final: {
      type: Number,
      min: 0,
      max: 60,
      validate: {
        validator: function (value) {
          return value >= 0 && value <= 60;
        },
        message: "{VALUE} must be between 0 and 60 for Final",
      },
    },
    total: {
      type: Number,
      min: 0,
      max: 100,
      validate: {
        validator: function (value) {
          return value >= 0 && value <= 100;
        },
        message: "{VALUE} must be between 0 and 100 for Total",
      },
    },
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
