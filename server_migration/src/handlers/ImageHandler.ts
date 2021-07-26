import { GridFSBucket } from "mongodb";
import { Image } from "../models/ImageSchema";
import mongoose from "mongoose";

let gfsAvatar: GridFSBucket;
let gfsPhotos: GridFSBucket;

mongoose.connection.once("open", () => {
  gfsAvatar = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "avatar",
  });
  gfsPhotos = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "images",
  });
});

export class ImageHandler {
  static async saveAvatar(
    caption: string,
    filename: string,
    id: string,
    route: string
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      // delete existing image if it exists
      Image.findOne({ caption })
        .then((image) => {
          if (image) {
            gfsAvatar.delete(
              new mongoose.Types.ObjectId(image.chunkIDRef),
              (err, data) => {
                if (err) {
                  reject(err);
                }
              }
            );

            image.filename = filename;
            image.chunkIDRef = id;
            image
              .save()
              .then((data) =>
                resolve(`${process.env.DOMAIN}${route}${data.filename}`)
              )
              .catch((err) => reject(err));
          } else {
            const newImage = new Image({
              caption,
              filename,
              chunkIDRef: id,
            });
            newImage
              .save()
              .then((data) => {
                resolve(`${process.env.DOMAIN}${route}${data.filename}`);
              })
              .catch((err) => {
                reject(err);
              });
          }
        })
        .catch((err) => reject(err));
    });
  }

  public static async uploadImage(
    caption: string,
    filename: string,
    id: string,
    route: string
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const image = new Image({
        caption,
        filename,
        chunkIDRef: id,
      });

      image
        .save()
        .then((data) =>
          resolve(`${process.env.DOMAIN}${route}${data.filename}`)
        )
        .catch((err) => reject(err));
    });
  }
}
