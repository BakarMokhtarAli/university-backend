import mongoose, { Document, Schema, Types } from "mongoose";
import { IStudent } from "./student.model";
import { IClass } from "./class.model"; // Import your Class model interface
import { ISubject } from "./subject.model";

export type AttendanceStatus = "Present" | "Absent" | "Leave" | "Late";

export interface IAttendance extends Document {
  date: Date;
  status: AttendanceStatus;
  student: Types.ObjectId[];
  class: Types.ObjectId | IClass; // Reference to Class
  subject: Types.ObjectId | ISubject; // Add subject reference
}

const attendanceSchema = new Schema<IAttendance>({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    enum: ["Present", "Absent", "Leave", "Late"],
  },
  student: { type: [Schema.Types.ObjectId], ref: "Student" },
  class: {
    type: Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: "Subject",
    // required: true
  },
});

// Compound index to prevent duplicate attendance for same student+class+date+subject
attendanceSchema.index(
  {
    date: 1,
    student: 1,
    class: 1,
    subject: 1,
  },
  { unique: true }
);

const Attendance = mongoose.model<IAttendance>("Attendance", attendanceSchema);

export default Attendance;
