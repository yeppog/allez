const express = require("express");
const imageRouter = express.Router();
const mongoose = require("mongoose");
const Image = require("../../models/Images");
// const config = require("../config");

const connect = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfsAvatar;
let gfsPhotos;

connect.once("open", () => {
  gfsAvatar = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "avatar",
  });
  gfsPhotos = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "images",
  });
});

imageRouter
  .route("/")
  // .post(upload.single("file"), handleUpload)
  .get((req, res, next) => {
    Image.find({})
      .then((images) => {
        res.status(200).json({
          success: true,
          link: process.env.DOMAIN + "/api/users/images/" + req.file.filename,
          images,
        });
      })
      .catch((err) => res.status(500).json(err));
  });

/**
 * Route for rendering avatar photos
 */
imageRouter.route("/avatar/:filename").get((req, res, next) => {
  gfsAvatar.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files[0] || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No files available",
      });
    }
    if (files[0].contentType === "image/png") {
      gfsAvatar.openDownloadStreamByName(req.params.filename).pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
});

/**
 * Handles the avatar upload function.
 * @param {*} newImage An mongo Image.js Schema object
 * @param {*} caption The submitted caption for the upload request
 * @returns
 */
async function handleAvatarUpload(newImage, caption) {
  let imageURL = "";
  await Image.findOne({ caption: caption })
    .then(async (image) => {
      if (image) {
        // overrides existing image in the DB for that Image Schema
        image.filename = newImage.filename;
        await image
          .save()
          .then((data) => {
            imageURL = `${process.env.domain}/api/images/avatar/${data.filename}`;
          })
          .catch((err) => new Error(err));
      } else {
        await newImage
          .save()
          .then((data) => {
            imageURL = `${process.env.domain}/api/images/avatar/${data.filename}`;
          })
          .catch((err) => new Error(err));
      }
    })
    .catch((err) => new Error(err));
  return imageURL;
}

module.exports = {
  router: imageRouter,
  uploadAvatar: handleAvatarUpload,
};
