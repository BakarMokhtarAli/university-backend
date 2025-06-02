// src/models/Announcement.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  description: string;
  receiver: "teachers" | "students";
}

const AnnouncementSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    enum: ["teachers", "students"],
    required: true,
  },
});

const Announcement = mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);
export default Announcement; 
