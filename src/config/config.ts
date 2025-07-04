import dotenv from "dotenv";

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI as string;
export const DB_PASSWORD = process.env.DB_PASSWORD as string;

export const PORT = process.env.PORT as string;

export const JWT_SECRET = process.env.JWT_SECRET as string;

export const APP_BASE_URL = process.env.APP_BASE_URL as string;

export const CLOUDINARY_CLOUD_NAME = process.env
  .CLOUDINARY_CLOUD_NAME as string;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY as string;
export const CLOUDINARY_API_SECRET = process.env
  .CLOUDINARY_API_SECRET as string;

export const IMGBB_API_KEY = process.env.IMGBB_API_KEY as string;
