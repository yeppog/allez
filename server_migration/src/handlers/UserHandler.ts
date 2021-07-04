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
              const token = jwt.sign({ id: doc.id }, process.env.JWT_SECRET);
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
          .then((user) => {
            if (!user.activated) {
              reject("Account not activated");
            }
            resolve(user);
          })
          .catch((err) => {
            winston.error(err.message);
            reject(err);
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  static async login(
    document: Model<IUserDoc | IGymDoc>,
    password: string,
    email?: string,
    username?: string
  ): Promise<{ token: string; user: IUserDoc | IGymDoc }> {
    return new Promise((resolve, reject) => {
      let query;
      if (email) {
        query = { email };
      } else {
        query = { username };
      }
      document
        .findOne(query)
        .then((doc) => {
          if (!doc.activated) {
            reject("Account not activated");
          }
          const check = bcrypt.compare(doc.password, password);
          if (check) {
            const token = jwt.sign({ id: doc._id }, process.env.JWT_SECRET);
            resolve({ token, user: doc });
          } else {
            reject("Password incorrect.");
          }
        })
        .catch((err) => reject(err));
    });
  }

  static async confirm(
    document: Model<IUserDoc | IGymDoc>,
    token: string
  ): Promise<IUserDoc | IGymDoc> {
    return new Promise<IUserDoc | IGymDoc>((resolve, reject) => {
      try {
        const payload = jwt.verify(
          token,
          process.env.JWT_SECRET
        ) as jwt.JwtPayload;
        const id = payload.id;
        document.findById({ _id: id }).then((user) => {
          user.activated = true;
          user
            .save()
            .then((data) => resolve(data))
            .catch((err) => reject(err));
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}
