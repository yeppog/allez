import { IGymDoc, IUserDoc, User } from "../models/UserSchema";
import mongoose, { Document, Model } from "mongoose";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { transport } from "../index";
import winston from "winston";

export class UserMethods {
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
            .then(async (doc) => {
              winston.info(
                `User ${document.username} successfully registered.`
              );
              const token = jwt.sign({ id: doc.id }, process.env.JWT_SECRET);
              await transport.sendMail(
                {
                  from: '"Allez" <allez.orbital@gmail.com>',
                  to: `${doc.email}`,
                  subject: "Welcome to Allez. Confirm your account now!",
                  text: `Click here to confirm your account.`,
                  html: `Click <a href = "${process.env.APPDOMAIN}/confirm/token=${token}">here</a> to confirm your account.`,
                },
                (error: any, info: any) => {
                  if (error) {
                    winston.error(error);
                  }
                  if (info) {
                    winston.info(
                      `Email sent to ${doc.email}. Contents: ${JSON.stringify(
                        info
                      )}`
                    );
                  }
                  reject(error);
                }
              );
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
            if (user) {
              if (!user.activated) {
                reject("Account not activated");
              } else {
                resolve(user);
              }
            } else {
              reject("User not found.");
            }
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
        .then(async (doc) => {
          if (!doc) {
            reject({ message: "Invalid user" });
            winston.info("User does not exist");
          }
          if (!doc.activated) {
            reject({ message: "Account not activated" });
          }
          const check = await bcrypt.compare(password, doc.password);
          if (check === true) {
            const token = jwt.sign({ id: doc._id }, process.env.JWT_SECRET);
            resolve({ token, user: doc });
          } else {
            winston.info(
              `Password is incorrect for user ${email} / ${username}`
            );
            reject({ message: "Password incorrect." });
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
          if (user) {
            if (user.activated) {
              reject({ message: "User already activated." });
            }
            user.activated = true;
            user
              .save()
              .then((data) => resolve(data))
              .catch((err) => reject(err));
          } else {
            reject({ message: "User not found." });
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  static async resetReq(
    document: Model<IUserDoc | IGymDoc>,
    email: string
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      document
        .findOne({ email })
        .then(async (data) => {
          if (data) {
            const resetToken = jwt.sign(
              { id: data.id },
              `password_reset-${process.env.JWT_SECRET}`
            );
            await transport.sendMail(
              {
                from: '"Allez" <allez.orbital@gmail.com>',
                to: `${email}`,
                subject: "Allez: Password Reset Request",
                text: `Click here to reset your password.`,
                html: `Click <a href = "${process.env.APPDOMAIN}/reset/token=${resetToken}">here</a> to reset your account.`,
              },
              (error: any, info: any) => {
                if (error) {
                  winston.error(error);
                }
                if (info) {
                  winston.info(
                    `Email sent to ${email}. Contents: ${JSON.stringify(info)}`
                  );
                }
                reject(error);
              }
            );
            resolve(resetToken);
          } else {
            winston.info(`User ${email} is not found. Faking 200 response.`);
            resolve("bad token");
          }
        })
        .catch((err) => reject(err));
    });
  }

  static async reset(
    document: Model<IUserDoc | IGymDoc>,
    token: string,
    password: string
  ): Promise<IUserDoc | IGymDoc> {
    return new Promise((resolve, reject) => {
      const payload = jwt.verify(
        token,
        `password_reset-${process.env.JWT_SECRET}`
      ) as jwt.JwtPayload;
      const id = payload.id;
      document
        .findById({ _id: id })
        .then((user) => {
          bcrypt
            .genSalt()
            .then((salt) => {
              bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                  winston.error("Error generating password hash.");
                  reject("Error generating password hash.");
                }
                user.password = hash;
                user
                  .save()
                  .then((doc) => {
                    winston.info(
                      `User ${user.username} password successfully reset.`
                    );
                    resolve(user);
                  })
                  .catch((error) => {
                    reject(error);
                  });
              });
            })
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  }

  static async verifyJWT(token: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        const id = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
        resolve(id.id);
      } catch (err) {
        reject(err);
      }
    });
  }

  static async getUserFromToken(
    token: string,
    document: Model<IUserDoc | IGymDoc>
  ): Promise<(IUserDoc | IGymDoc) & mongoose.Document> {
    return new Promise<(IUserDoc | IGymDoc) & mongoose.Document>(
      (resolve, reject) => {
        try {
          const id = jwt.verify(
            token,
            process.env.JWT_SECRET
          ) as jwt.JwtPayload;
          document
            .findById({ _id: id.id })
            .then((user) => resolve(user))
            .catch((err) => reject(err));
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  public static async updateUserTag(tag: string, slug: string, date: Date) {
    return new Promise((resolve, reject) => {
      User.findOne({ username: tag }).then((user) => {
        if (!user) {
          reject("Tagged user not found");
        } else {
          if (user.taggedPost[date.toISOString()]) {
            user.taggedPost[date.toISOString()] = [
              ...user.taggedPost[date.toISOString()],
              slug,
            ];
          } else {
            user.taggedPost[date.toISOString()] = [slug];
          }
          user
            .save()
            .then((data) => resolve(data))
            .catch((err) => reject(err));
        }
      });
    });
  }

  public static async updateFollowed(username: string, followedUser: string) {
    return new Promise((resolve, reject) => {
      User.findOne({ username: followedUser }).then((user) => {
        const followers = [...user.followers];
        if (followers.includes(username)) {
          const index = followers.indexOf(username);
          followers.splice(index, 1);
          user.followCount -= 1;
        } else {
          followers.push(username);
          user.followCount += 1;
        }
        user.followers = followers;
        user
          .save()
          .then((data) => resolve(data))
          .catch((err) => reject(err));
      });
    });
  }
}
