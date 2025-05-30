import express from "express";
import mongoose, { Schema } from "mongoose";

export interface IBatch {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const batchSchema = new Schema<IBatch>(
  {
    name: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const Batch = mongoose.model<IBatch>("Batch", batchSchema);

export default Batch;
