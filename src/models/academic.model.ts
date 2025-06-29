import mongoose, { Schema, Document } from "mongoose";

export interface IAcademic extends Document {
  academic_id: string;
  academic_year: string;
  batch_id: string;
  start_date: Date;
  end_date: Date;
}

const academicSchema: Schema = new Schema(
  {
    academic_id: { type: String, required: true, unique: true },
    academic_year: { type: String, required: true, unique: true },
    batch_id: { type: String, ref: "Batch", required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAcademic>("Academic", academicSchema);
