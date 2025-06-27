import mongoose, { Schema, Document } from "mongoose";

export interface IExam extends Document {
  _id: string;
  title: string;
  exam_type: "cw1" | "cw2" | "midterm" | "final";
  date: Date;
  academic?: mongoose.Types.ObjectId;
}

const examSchema = new Schema<IExam>(
  {
    title: { type: String, required: true },
    exam_type: {
      type: String,
      enum: ["cw1", "cw2", "midterm", "final"],
      required: true,
    },
    date: { type: Date, required: true },
    academic: {
      type: Schema.Types.ObjectId,
      ref: "Academic",
    },
  },
  { timestamps: true }
);

// virtuals
examSchema.virtual("results", {
  ref: "ExamResult",
  localField: "_id",
  foreignField: "exam",
});

export default mongoose.model<IExam>("Exam", examSchema);
