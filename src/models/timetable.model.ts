import mongoose, { Schema, Document } from "mongoose";

export interface ITimetable extends Document {
  timetable_id: string; // Custom ID like "TTB01"
  class_id: string;
  subject_id: string;
  faculty_id: string;
  academic_id: string;
  day_of_week: string; // "Monday", etc.
  start_time: string; // "08:00"
  end_time: string; // "09:00"
  date: string; // Optional, if you want to store a specific date
  location: string;
}

const timetableSchema: Schema = new Schema(
  {
    timetable_id: { type: String, unique: true },
    class_id: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    subject_id: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    faculty_id: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    academic_id: {
      type: Schema.Types.ObjectId,
      ref: "Academic",
      required: true,
    },
    day_of_week: { type: String, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITimetable>("Timetable", timetableSchema);
