/** Imports for GRIDFS storage */
const methodOverride = require("method-override");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const avatarStorage = new GridFsStorage({
  db: mongoose.connection,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buff) => {
        if (err) {
          return reject(err);
        }
        const filename = buff.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: `avatar_${filename}`,
          bucketName: "avatar",
        };
        resolve(fileInfo);
      });
    });
  },
});
const videoStorage = new GridFsStorage({
  db: mongoose.connection,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buff) => {
        if (err) {
          return reject(err);
        }
        const filename = buff.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: `video_${filename}`,
          bucketName: "video",
        };
        resolve(fileInfo);
      });
    });
  },
});

const uploadVideo = multer({ storage: videoStorage });
const uploadAvatar = multer({ storage: avatarStorage });
module.exports = { uploadAvatar, uploadVideo };
