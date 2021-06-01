/** Imports for GRIDFS storage */
const methodOverride = require("method-override");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");

const avatarStorage = new GridFsStorage({
  url: process.env.MONGO_URI,
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

const uploadAvatar = multer({ storage: avatarStorage });
module.exports = uploadAvatar;
