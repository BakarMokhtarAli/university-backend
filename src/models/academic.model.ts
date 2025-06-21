import mongoose, { Schema, Document } from "mongoose";

export interface IAcademic extends Document {
  academic_id: string;
  academic_year: string;
  semester_id: string; // reference to Semester model
  start_date: Date;
  end_date: Date;
}

const academicSchema: Schema = new Schema(
  {
    academic_id: { type: String, required: true, unique: true },
    academic_year: { type: String, required: true },
    semester_id: {
      type: Schema.Types.ObjectId,
      ref: "Semester", // 👈 points to your Semester model
      required: true,
    },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAcademic>("Academic", academicSchema);
