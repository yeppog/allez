import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      dropDups: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      dropDups: true,
    },
    password: {
      type: String,
      required: true,
    },
    activated: {
      type: Boolean,
    },
    name: {
      type: String,
    },
    bio: {
      type: String,
    },
    avatarPath: {
      type: String,
    },
    followCount: {
      type: Number,
      required: true,
      default: 0,
    },
    followers: {
      type: [],
      required: true,
      default: [""],
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    following: {
      type: [],
      default: [""],
    },
    posts: {
      type: {},
      default: {},
    },
    postCount: {
      type: Number,
      default: 0,
    },
    taggedPost: {
      type: {},
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { minimize: false }
);

const GymSchema = new mongoose.Schema({
  ...UserSchema.obj,
  routes: {
    type: {},
    default: {},
  },
  address: {
    type: String,
    default: "",
  },
  postalCode: {
    type: Number,
    default: 0,
  },
});

interface IUserDoc extends User, Document {}

export const User = mongoose.model<IUserDoc>("UserData", UserSchema);
export const Gym = mongoose.model("GymData", GymSchema);

export interface User {
  username: string;
  email: string;
  password: string;
  activated: boolean;
  name: string;
  bio: string;
  avatarPath: string;
  followCount: number;
  followers: string[];
  followingCount: number;
  following: string[];
  posts: { [key: string]: string };
  postCount: number;
  taggedPost: { [key: string]: string };
  createdAt: Date;
}

export interface Gym extends User {
  routes: { [key: string]: string };
  address: string;
  postalCode: number;
}
