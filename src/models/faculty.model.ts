import mongoose, { Schema, model, Document } from "mongoose";

export interface IFaculty extends Document {
  name: string;
  arabicName?: string;
  description: string;
  dean: mongoose.Types.ObjectId;
  faculty_id: string;
  established_year: Date;
  departments: string[];
}

const facultySchema = new Schema<IFaculty>({
  name: { type: String, required: true },
  arabicName: { type: String },
  description: { type: String, required: true },
  dean: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  faculty_id: { type: String },
  established_year: { type: Date, required: true },
  departments: { type: [String] },
});

const Faculty = model<IFaculty>("Faculty", facultySchema);

export default Faculty;
