import multer from "multer";
import AppError from "../utils/AppError";

const storage = multer.memoryStorage(); // store file in memory

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new AppError("Only image files are allowed!", 400));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
    files: 1, // Limit to 1 file
  },
});

export default upload;
