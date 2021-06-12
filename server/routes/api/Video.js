const express = require("express");
const videoRouter = express.Router();
const mongoose = require("mongoose");
const Video = require("../../models/Video");
const upload = require("./../../gridfs").uploadMedia;
let gfsVideo;

mongoose.connection.once("open", async () => {
  gfsVideo = await new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "video",
  });
});

async function handleVideoUpload(caption, filename, chunkIDRef) {
  const newVideo = new Video({
    caption: caption,
    filename: filename,
    chunkIDRef: chunkIDRef,
  });
  return new Promise(async (resolve, reject) => {
    await Video.findOne({ caption: caption })
      .then(async (video) => {
        if (video) {
          // delete the chunk from the GridFS store
          await gfsVideo.delete(
            new mongoose.Types.ObjectId(video.chunkIDRef),
            (err, data) => {
              if (err) {
                reject(err);
              }
            }
          );

          // overrides existing video in the DB for that Image Schema
          video.filename = newVideo.filename;
          // update pointer to the new video chunk
          video.chunkIDRef = newVideo.chunkIDRef;
          await video
            .save()
            .then((data) => {
              resolve(`${process.env.domain}/api/videos/${data.filename}`);
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          await newVideo
            .save()
            .then((data) => {
              resolve(`${process.env.domain}/api/videos/${data.filename}`);
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

videoRouter.route("/:filename").get((req, res, next) => {
  if (!gfsVideo) {
    return res.status(503).json({ message: "Server is not available." });
  }
  gfsVideo.find({ filename: req.params.filename }).toArray((err, files) => {
    if (err) {
      return res.status(400).json(err);
    }
    if (!files[0] || files.length === 0) {
      return res.status(403).json({
        success: false,
        message: "No files available",
      });
    }
    const videoSize = files[0].length;
    const start = 0;
    // Number(range.replace(/\D/g, ""));
    const end = videoSize - 1;
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };
    if (
      files[0].contentType === "video/mp4" ||
      files[0].contentType === "video/x-msvideo"
    ) {
      res.writeHead(206, headers);
      return gfsVideo.openDownloadStreamByName(req.params.filename).pipe(res);
    } else {
      return res.status(404).json({
        err: "Not a video",
      });
    }
  });
});

videoRouter.route("/upload").post(upload.single("file"), (req, res, next) => {
  if (!req.file) {
    return res.status(400);
  } else {
    const video = new Video({
      caption: req.body.caption,
      filename: req.file.filename,
      fileId: req.file.id,
      chunkIDRef: req.file.id,
    });

    video
      .save()
      .then((video) => {
        res.status(200).json({
          message: `${process.env.domain}/api/videos/${video.filename}`,
        });
      })
      .catch((err) => res.status(500).json(err));
  }
});

module.exports = {
  router: videoRouter,
  uploadVideo: handleVideoUpload,
};
