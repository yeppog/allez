const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  caption: {
    required: true,
    type: String,
  },
  filename: {
    required: true,
    type: String,
  },
  createdAt: {
    default: Date.now(),
    type: Date,
  },
  chunkIDRef: {
    required: true,
    type: String,
  },
});

const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;
