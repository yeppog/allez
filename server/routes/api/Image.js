const express = require("express");
const imageRouter = express.Router();
const mongoose = require("mongoose");
const Image = require("../../models/Images");
// const config = require("../config");

let gfsAvatar;
let gfsPhotos;

mongoose.connection.once("open", () => {
  gfsAvatar = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "avatar",
  });
  gfsPhotos = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "images",
  });
});

// imageRouter
//   .route("/")
//   // .post(upload.single("file"), handleUpload)
//   .get((req, res, next) => {
//     Image.find({})
//       .then((images) => {
//         res.status(200).json({
//           success: true,
//           link: process.env.DOMAIN + "/api/users/images/" + req.file.filename,
//           images,
//         });
//       })
//       .catch((err) => res.status(500).json(err));
//   });

/**
 * Route for rendering avatar photos
 */
imageRouter.route("/avatar/:filename").get((req, res, next) => {
  gfsAvatar.find({ filename: req.params.filename }).toArray((err, files) => {
    if (err) {
      return res.status(400).json(err);
    }
    if (!files[0] || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No files available",
      });
    }
    if (
      files[0].contentType === "image/png" ||
      files[0].contentType === "image/jpeg"
    ) {
      return gfsAvatar.openDownloadStreamByName(req.params.filename).pipe(res);
    } else {
      return res.status(404).json({
        err: "Not an image",
      });
    }
  });
});

imageRouter.route("/media/:filename").get((req, res, next) => {
  gfsPhotos.find({ filename: req.params.filename }).toArray((err, files) => {
    if (err) {
      return res.status(400).json(err);
    }
    if (!files[0] || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No files available",
      });
    }
    if (
      files[0].contentType === "image/png" ||
      files[0].contentType === "image/jpeg"
    ) {
      return gfsPhotos.openDownloadStreamByName(req.params.filename).pipe(res);
    } else {
      return res.status(404).json({
        err: "Not an image",
      });
    }
  });
});

/**
 * Handles the creation of an Image or Avatar object for the file that was uploaded.
 * @param {string} caption The caption of the file
 * @param {string} filename The name of the file
 * @param {string} chunkIDRef The objectID of the file
 * @param {string} options Slug of the image file stored at
 * @returns {Promise<string>} Promise of the string of the image url.
 */

async function handleImageUpload(caption, filename, chunkIDRef, options) {
  return new Promise(async (resolve, reject) => {
    await Image.findOne({ caption: caption })
      .then(async (image) => {
        if (image) {
          // delete the chunk from the GridFS store
          await gfsAvatar.delete(
            new mongoose.Types.ObjectId(image.chunkIDRef),
            (err, data) => {
              if (err) {
                reject(err);
              }
            }
          );

          // overrides existing image in the DB for that Image Schema
          image.filename = filename;
          // update pointer to the new image chunk
          image.chunkIDRef = chunkIDRef;
          await image
            .save()
            .then((data) => {
              resolve(`${process.env.domain}${options}${data.filename}`);
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          const newImage = new Image({
            caption: caption,
            filename: filename,
            chunkIDRef: chunkIDRef,
          });
          await newImage
            .save()
            .then((data) => {
              resolve(`${process.env.domain}${options}${data.filename}`);
            })
            .catch((err) => {
              reject(err);
            });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  router: imageRouter,
  uploadImage: handleImageUpload,
};
