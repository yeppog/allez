import { GridFsStorage } from "multer-gridfs-storage";
import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import winston from "winston";

dotenv.config();

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => winston.info("MongoDB connection established.")
);
const avatarStorage = new GridFsStorage({
  db: mongoose.connection,
  file: (req: any, file: any) => {
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

const mediaStorage = new GridFsStorage({
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
          case "image/jpeg":
          case "image/gif":
          case "image/png":
            const imgFileInfo = {
              filename: `image_${filename}`,
              bucketName: "images",
            };
            resolve(imgFileInfo);

          default:
            winston.error(
              "File provided to this bucket isn't of the right format of mp4, jpeg, gif or png."
            );
            reject("File type doesnt match");
        }
      });
    });
  },
});

export const uploadAvatar = multer({ storage: avatarStorage });
export const uploadMedia = multer({ storage: mediaStorage });
