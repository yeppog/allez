const express = require("express");
const imageRouter = express.Router();
const mongoose = require("mongoose");
const Image = require("../../models/Images");
const upload = require("../../gridfs");
// const config = require("../config");

const connect = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;

connect.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "uploads",
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

imageRouter.route("/:filename").get((req, res, next) => {
  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files[0] || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No files available",
      });
    }
    if (files[0].contentType === "image/png") {
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
});

async function handleUpload(newImage, caption) {
  let imageURL = "";
  await Image.findOne({ caption: caption })
    .then(async (image) => {
      if (image) {
        imageURL = `${process.env.DOMAIN}/api/images/${image.filename}`;
        // res.status(400).json({ message: "exists" });
      }
      await newImage
        .save()
        .then((image) => {
          return `${process.env.DOMAIN}/api/images/${newImage.filename}.${req.file.contentType}`;
        })
        .catch((err) => "brr");
      // console.log(imageURL);
    })
    .catch((err) => "brr");
  return imageURL;
}

module.exports = {
  router: imageRouter,
  upload: handleUpload,
};
