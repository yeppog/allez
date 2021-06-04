const mongoose = require("mongoose");

/**
 * Schema for the user model.
 */

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
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
  posts: {
    type: [],
    default: [""],
  },
});

const User = mongoose.model("UserData", UserSchema);
module.exports = User;
