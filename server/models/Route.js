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
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
});

const Route = mongoose.model("Route", RouteSchema);

module.exports = Route;
