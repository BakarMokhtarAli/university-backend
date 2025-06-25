import mongoose, { Schema, Document } from "mongoose";

export interface ISubject extends Document {
  name: string;
  code: string;
  faculty?: mongoose.Types.ObjectId;
  classes: mongoose.Types.ObjectId[];
}

const subjectSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    // faculty: { type: Schema.Types.ObjectId, ref: "Faculty" },
    classes: [{ type: Schema.Types.ObjectId, ref: "Class" }],
  },
  { timestamps: true }
);

export default mongoose.model<ISubject>("Subject", subjectSchema);
