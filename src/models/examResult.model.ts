import mongoose, { Schema, Document, Types } from "mongoose";

export interface IExamResult extends Document {
  exam: Types.ObjectId;
  student: Types.ObjectId;
  subject: Types.ObjectId;
  class: Types.ObjectId;
  marks: number;
  grade?: string;
  remark?: string;
}

const examResultSchema = new Schema<IExamResult>(
  {
    exam: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
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
    marks: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    grade: {
      type: String,
    },
    remark: {
      type: String,
    },
  },
  { timestamps: true }
);

// Optional: prevent duplicate result per subject + student
examResultSchema.index({ subject: 1, student: 1 }, { unique: true });

export default mongoose.model<IExamResult>("ExamResult", examResultSchema);
