const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  post: {
    required: true,
    type: String,
  },
  createdAt: {
    default: Date.now(),
    type: Date,
  },
  body: {
    required: true,
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  comments: {
    type: Array,
    default: [],
  },
  edited: {
    type: Boolean,
    default: false,
  },
  avatarPath: {
    required: true,
    type: String,
  },
  user: {
    required: true,
    type: String,
  },
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
