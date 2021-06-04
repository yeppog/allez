const mongoose = require("mongoose");

/**
 * Schema for the Post model
 */

const PostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  avatarPath: {
    type: String,
    required: true,
  },
  mediaPath: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
    required: true,
  },
  comments: {
    type: [],
    default: [""],
  },
});

const Post = mongoose.model("PostData", PostSchema);
module.exports = Post;
