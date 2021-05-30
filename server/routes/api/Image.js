const express = require("express");
const imageRouter = express.Router();
const mongoose = require("mongoose");
const Image = require("../../models/Images");
// const config = require("../config");

module.exports = (upload) => {
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

  // imageRouter.get("/test", (req, res) =>
  //   res.send(200).json({ message: "test" })
  // );

  imageRouter
    .route("/")
    .post(upload.single("file"), (req, res, next) => {
      console.log(req.body);
      Image.findOne({ caption: req.body.caption })
        .then((image) => {
          if (image) {
            return res.status(200).json({
              success: false,
              message: "Image already exists",
            });
          }

          let newImage = new Image({
            caption: req.body.caption,
            filename: req.file.filename,
            fileId: req.file.id,
          });

          newImage
            .save()
            .then((image) => {
              res.status(200).json({ message: "Successful" });
            })
            .catch((err) => res.status(500).json(err));
        })
        .catch((err) => res.status(500).json(err));
    })
    .get((req, res, next) => {
      Image.find({})
        .then((images) => {
          res.status(200).json({
            success: true,
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

  return imageRouter;
};
