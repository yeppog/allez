import { IVideoDoc, Video } from "../models/VideoSchema";
import express, { Request, Response } from "express";
import { passwordMatch, validate, validator } from "../validator";

import { Errors } from "../handlers/Errors";
import { GridFSBucket } from "mongodb";
import { ImageHandler } from "../handlers/ImageHandler";
import { UserMethods } from "../handlers/UserHandler";
import mongoose from "mongoose";
import { uploadAvatar } from "../store";
import winston from "winston";

export const videoRouter = express.Router();

let gfsVideo: GridFSBucket;

mongoose.connection.once("open", async () => {
  gfsVideo = await new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "video",
  });
});

class VideoActions {
  static async getVideo(req: Request, res: Response) {
    if (!gfsVideo) {
      res.status(503).json({ message: "Server is not available." });
    } else {
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
          return gfsVideo
            .openDownloadStreamByName(req.params.filename)
            .pipe(res);
        } else {
          return res.status(404).json({
            err: "Not a video",
          });
        }
      });
    }
  }
}

videoRouter.get("/:filename", VideoActions.getVideo);
