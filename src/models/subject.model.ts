import mongoose, { Document, Schema } from "mongoose";

export interface ISubject extends Document {
  name: string;
  code: string;
  description?: string;
  faculty?: mongoose.Types.ObjectId; // Reference to Faculty model
  classes: mongoose.Types.ObjectId[]; // Reference to Class model
}

const subjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    classes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
  },
  { timestamps: true }
);

const Subject = mongoose.model<ISubject>("Subject", subjectSchema);

export default Subject;
