const mongoose = require("mongoose");

/**
 * Schema for the Post model
 */

const PostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    default: "",
  },
  avatarPath: {
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
    default: [""],
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
});

const Post = mongoose.model("PostData", PostSchema);
module.exports = Post;
