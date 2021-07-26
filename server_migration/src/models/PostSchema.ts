import mongoose from "mongoose";

/**
 * Schema for the Post model
 */

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    postBody: {
      type: String,
      default: "",
    },
    mediaPath: {
      type: String,
      default: "",
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedUsers: {
      type: {},
      default: {},
    },
    comments: {
      type: [],
      default: [],
    },
    slug: {
      type: String,
      required: true,
    },
    createdAt: {
      default: Date.now,
      type: Date,
    },
    tag: {
      default: {},
      type: Object,
    },
    edited: {
      default: false,
      type: Boolean,
    },
  },
  { minimize: false }
);

export interface Post {
  userId: string;
  username: string;
  postBody: string;
  mediaPath: string;
  likes: number;
  likedUsers: { [key: string]: Date };
  comments: string[];
  slug: string;
  createdAt: Date;
  tag: { user: string[]; gym: string[]; route: string[] };
  edited: boolean;
}

export interface IPostDoc extends Post, Document {}

export const Post = mongoose.model<IPostDoc>("PostData", PostSchema);
