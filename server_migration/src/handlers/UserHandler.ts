import { IGymDoc, IUserDoc } from "../models/UserSchema";
import mongoose, { Document, Model } from "mongoose";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import winston from "winston";

export class User {
  static async createUser(
    document: (IUserDoc | IGymDoc) & Document<any, any>
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      bcrypt.genSalt().then((salt) => {
        bcrypt.hash(document.password, salt, (err, hash) => {
          if (err) {
            winston.error("Error generating password hash.");
            reject("Error generating password hash.");
          }
          document.password = hash;
          document
            .save()
            .then((doc) => {
              winston.info(
                `User ${document.username} successfully registered.`
              );
              const token = jwt.sign(hash, process.env.JWT_SECRET);
              // TODO: send email here
              resolve(token);
            })
            .catch((error) => {
              reject(error);
            });
        });
      });
    });
  }
  static async verifyToken(
    token: string,
    document: Model<IUserDoc | IGymDoc>
  ): Promise<IUserDoc | IGymDoc> {
    return new Promise((resolve, reject) => {
      try {
        const payload = jwt.verify(
          token,
          process.env.JWT_SECRET
        ) as jwt.JwtPayload;
        const id = payload.id;
        document
          .findById({ _id: id })
          .then((user) => resolve(user))
          .catch((err) => {
            winston.error(err.message);
            reject(err);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
}
