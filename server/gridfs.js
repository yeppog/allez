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
const postMedia = new GridFsStorage({
  db: mongoose.connection,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buff) => {
        if (err) {
          return reject(err);
        }
        const filename = buff.toString("hex") + path.extname(file.originalname);

        switch (file.mimetype) {
          case "video/mp4":
            const videoFileInfo = {
              filename: `video_${filename}`,
              bucketName: "video",
            };
            resolve(videoFileInfo);
          case "image/png" || "image/jpeg":
            const imgFileInfo = {
              filename: `image_${filename}`,
              bucketName: "images",
            };
            resolve(imgFileInfo);
        }
      });
    });
  },
});

const uploadMedia = multer({ storage: postMedia });
const uploadAvatar = multer({ storage: avatarStorage });
module.exports = { uploadAvatar, uploadMedia };
