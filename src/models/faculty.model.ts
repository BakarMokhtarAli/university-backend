import mongoose, { Schema, model, Document } from "mongoose";

export interface IFaculty extends Document {
  name: string;
  arabicName?: string;
  description: string;
  dean: mongoose.Types.ObjectId;
  students: number;
  staff: number;
  established_year: Date;
  departments: string[];
}

const facultySchema = new Schema<IFaculty>({
  name: { type: String, required: true },
  arabicName: { type: String },
  description: { type: String, required: true },
  dean: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  students: { type: Number },
  staff: { type: Number },
  established_year: { type: Date, required: true },
  departments: { type: [String] },
});

const Faculty = model<IFaculty>("Faculty", facultySchema);

export default Faculty;
