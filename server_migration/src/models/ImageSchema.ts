import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  caption: {
    required: true,
    type: String,
  },
  filename: {
    required: true,
    type: String,
  },
  createdAt: {
    default: Date.now,
    type: Date,
  },
  chunkIDRef: {
    required: true,
    type: String,
  },
});

export interface Image {
  caption: string;
  filename: string;
  createdAt: Date;
  chunkIDRef: string;
}

export interface IImageDoc extends Image, Document {}

export const Image = mongoose.model<IImageDoc>("ImageData", ImageSchema);
