import mongoose from "mongoose";

const Schema = mongoose.Schema;

const VideoSchema = new Schema({
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

export interface Video {
  caption: string;
  filename: string;
  createdAt: Date;
  chunkIDRef: string;
}

export interface IVideoDoc extends Video, Document {}

export const Video = mongoose.model<IVideoDoc>("Video", VideoSchema);
