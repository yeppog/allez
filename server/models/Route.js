const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RouteSchema = new Schema({
  gym: {
    type: String,
    required: true,
  },
  taggedPosts: {
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
});

const Route = mongoose.model("Route", RouteSchema);

module.exports = Route;
