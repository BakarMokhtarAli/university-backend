import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary";
import AppError from "../utils/AppError";

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "students",
      format: "jpg", // convert to jpg (optional)
      public_id: `${file.originalname.split(".")[0]}-${Date.now()}`,
      transformation: [{ width: 1000, height: 1000, crop: "limit" }],
    };
  },
});

// Filter to allow only images
const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Only JPEG and PNG image files are allowed", 400));
  }
};

// Setup multer with size limit and file type filter
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // ✅ 2MB limit
  },
  fileFilter,
});

export default upload;
