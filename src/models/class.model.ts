import mongoose, { Document } from "mongoose";

export interface IClass extends Document {
  name: string;
  faculty: mongoose.Types.ObjectId;
  semester: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  //   students: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const classSchema = new mongoose.Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      //   required: true,
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      //   required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      //   required: true,
    },
    // students: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Student",
    //   },
    // ],
  },

  {
    timestamps: true,
  }
);

classSchema.set("toJSON", { virtuals: true });
classSchema.set("toObject", { virtuals: true });

classSchema.virtual("students", {
  ref: "Student",
  localField: "_id",
  foreignField: "class",
});

const Class = mongoose.model<IClass>("Class", classSchema);

export default Class;
