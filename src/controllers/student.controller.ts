import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import Student from "../models/student.model";
import { AuthRequest } from "../middleware/protect"; // Assuming you have an AuthRequest type
import { IStudent } from "../models/student.model"; // Import the interface
import Class from "../models/class.model";
import Faculty from "../models/faculty.model";
import Counter from "../models/counter.model";

// import { uploadImage } from "../utils/uploadImage";

// Get all students
export const getAllStudents = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const students = await Student.find()
      .populate("class")
      .populate("faculty")
      .sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      message: "Students retrieved successfully",
      students,
    });
  }
);

// Get student by id
export const getStudentById = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const student = await Student.findById(req.params.id)
      .populate("class")
      .populate({
        path: "results",
        select: "marks exam subject class",
        populate: [
          {
            path: "subject",
            select: "name code",
          },
          {
            path: "exam",
            select: "title exam_type date",
          },
          {
            path: "class",
            select: "name",
          },
        ],
      });
    if (!student) {
      return next(new AppError("Student not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Student retrieved successfully",
      student,
    });
  }
);

// Create a new student
export const createStudent = catchAsync(
  async (req: AuthRequest, res: Response) => {
    // 1. Get the class document
    const classDoc = await Class.findById(req.body.class);
    if (!classDoc) {
      throw new AppError("Class not found", 404);
    }

    // 2. Get the faculty ID from class
    const facultyId = classDoc.faculty;
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      throw new AppError(
        `this class ${classDoc.name} does not have a faculty`,
        404
      );
    }

    const facultyCode = faculty.faculty_id; // e.g., "CIS"

    const year = new Date().getFullYear().toString().slice(-2); // "25"
    const fixed = "05";

    // 3. Get auto-increment number
    const counter = await Counter.findByIdAndUpdate(
      { _id: "studentId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const increment = counter.seq.toString().padStart(2, "0"); // e.g. 01
    const student_id = `${facultyCode}${year}${fixed}${increment}`; // e.g. CIS250501

    // ⬇️ Image Handling with Multer
    // let imageUrl = "";
    // if (req.file) {
    //   imageUrl = await uploadImage(req.file.buffer, req.body.fullName);
    // }
    // If file was uploaded, build public URL
    if (req.file) {
      req.body.image = req.file.path;
    }

    // 5. Create student
    const newStudent = new Student({
      ...req.body,
      student_id,
      faculty: facultyId,
      id_number: increment,
    });
    await newStudent.save();

    res.status(201).json({
      status: "success",
      message: "Student created successfully",
      student: newStudent,
    });
  }
);

// Update a student
// export const updateStudent = catchAsync(
//   async (req: AuthRequest, res: Response, next: NextFunction) => {
//     let facultyId;
//     // check if class has a faculty
//     if (req.body.class) {
//     const classDoc = await Class.findById(req.body.class);
//     if (!classDoc) {
//       throw new AppError("Class not found", 404);
//     }
//     facultyId = classDoc.faculty;

//     const faculty = await Faculty.findById(facultyId);

//     if (!faculty) {
//       throw new AppError(
//         `this class ${classDoc.name} does not have a faculty`,
//         404
//       );
//     }
//   }

//     // prepare update payload
//     const updatePayload: any = {
//       ...req.body,
//       faculty: facultyId,
//     };

//     // handle image upload if file exists
//     if (req.file) {
//       const imageUrl = await uploadImage(
//         req.file.buffer,
//         req.body.name || "student"
//       );
//       updatePayload.image = imageUrl;
//     }

//     const student = await Student.findByIdAndUpdate(
//       req.params.id,
//       updatePayload,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//     if (!student) {
//       return next(new AppError("Student not found", 404));
//     }

//     res.status(200).json({
//       status: "success",
//       message: "Student updated successfully",
//       student,
//     });
//   }
// );

export const updateStudent = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    // const updatePayload: any = {
    //   ...req.body,
    // };
    const student = await Student.findById(req.params.id);
    if (!student) throw new AppError("Student not found", 404);

    // 🔒 Only handle faculty update if class is being updated
    if (req.body.class) {
      const classDoc = await Class.findById(req.body.class);
      if (!classDoc) {
        throw new AppError("Class not found", 404);
      }

      const facultyId = classDoc.faculty;
      const faculty = await Faculty.findById(facultyId);
      if (!faculty) {
        throw new AppError(
          `This class ${classDoc.name} does not have a valid faculty`,
          404
        );
      }

      req.body.faculty = facultyId;
    }

    // // 🔄 Handle image upload if file exists
    // if (req.file) {
    //   const imageUrl = await uploadImage(
    //     req.file.buffer,
    //     req.body.fullName || "student"
    //   );
    //   updatePayload.image = imageUrl;
    // }
    // Attach image URL if file exists
    // 🔁 Delete old image if a new one is uploaded
    if (req.file) {
      req.body.image = req.file.path;
    }

    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return next(new AppError("Student not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Student updated successfully",
      student: updated,
    });
  }
);

// Delete a student
export const deleteStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const student = await Student.findById(req.params.id);

    if (!student) return next(new AppError("Student not found", 404));
    // 🧹 Delete image if exists

    await student.deleteOne();

    res.status(204).json({ status: "success", data: null });
  }
);

// Get all students by class
export const getAllStudentsByClass = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { class_id } = req.params;
    if (!class_id) {
      return next(new AppError("Class ID is required", 400));
    }
    const students = await Student.find({ class: class_id });
    res.status(200).json({
      status: "success",
      // message: "Students retrieved successfully",
      results: students.length,
      students,
    });
  }
);
