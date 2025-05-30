import mongoose from "mongoose";
import { MONGO_URI, DB_PASSWORD } from "./config";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI.replace("<db_password>", DB_PASSWORD));
    console.log("Connected to database");
  } catch (error) {
    console.log(`Error connecting to database: ${error}`);
  }
};
