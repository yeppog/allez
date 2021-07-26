import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RouteSchema = new Schema(
  {
    gym: {
      type: String,
      required: true,
    },
    taggedPost: {
      type: {},
      default: {},
    },
    grade: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    tags: {
      type: [],
      default: [],
    },
    name: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { minimize: false }
);

export interface Route {
  gym: string;
  taggedPost: { [key: string]: string };
  grade: string;
  color: string;
  tags: string[];
  name: string;
  createdAt: Date;
}

export interface IRouteDocs extends Route, Document {}

export const Route = mongoose.model<IRouteDocs>("Route", RouteSchema);
