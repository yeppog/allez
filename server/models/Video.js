const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  caption: {
    required: true,
    type: String,
  },
  filename: {
    required: true,
    type: String,
  },
  createdAt: {
    default: Date.now,
    type: Date,
  },
  chunkIDRef: {
    required: true,
    type: String,
  },
});

const Video = mongoose.model("Video", VideoSchema);

module.exports = Video;
