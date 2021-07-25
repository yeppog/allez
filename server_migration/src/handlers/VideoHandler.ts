import { GridFSBucket } from "mongodb";
import { Image } from "../models/ImageSchema";
import { Video } from "../models/VideoSchema";
import mongoose from "mongoose";

export class VideoHandler {
  public static async uploadVideo(
    caption: string,
    filename: string,
    id: string,
    route: string
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const video = new Video({
        caption,
        filename,
        chunkIDRef: id,
      });

      video
        .save()
        .then((data) =>
          resolve(`${process.env.DOMAIN}${route}${data.filename}`)
        )
        .catch((err) => reject(err));
    });
  }
}
