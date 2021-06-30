const mongoose = require("mongoose");

/**
 * Schema for the user model.
 */

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
      dropDrups: true,
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
    type: String,
    default: "",
  },
});

const User = mongoose.model("UserData", UserSchema);
const Gym = mongoose.model("GymData", GymSchema);
module.exports = { User, Gym };
