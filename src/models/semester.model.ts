import mongoose, { Schema } from "mongoose";

type Status = "running" | "completed" | "cancelled";

export interface ISemester {
  department: string;
  name: string;
  title: string;
  status: Status;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const semesterSchema = new Schema<ISemester>(
  {
    department: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["running", "completed", "cancelled"],
      default: "running",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const Semester = mongoose.model<ISemester>("Semester", semesterSchema);

export default Semester;
