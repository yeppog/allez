import { IGymDoc, IUserDoc } from "../models/UserSchema";
import mongoose, { Document, Model } from "mongoose";

import { GymHandler } from "./GymHandler";
import { RouteHandler } from "./RouteHandler";
import { UserMethods } from "./UserHandler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import winston from "winston";

interface TagObj {
  gym: string;
  user: string;
  route: string;
}

interface Tags {
  gym: string[];
  user: string[];
  route: string[];
}
export class PostHandler {
  public static async handleNewTags(
    tagsObj: TagObj,
    slug: string,
    date: Date
  ): Promise<Tags> {
    return new Promise((resolve, reject) => {
      const gymSplit = tagsObj.gym.split(",");
      const userSplit = tagsObj.user.split(",");
      const routeSplit = tagsObj.route.split(",");
      const output: Tags = { gym: null, user: null, route: null };
      if (gymSplit.length > 0) {
        gymSplit.forEach(async (tag, index) => {
          await GymHandler.updateGymTag(tag, slug, date).catch((err) => {
            gymSplit.splice(index, 1);
          });
        });
        output.gym = gymSplit;
      }
      if (routeSplit.length > 0) {
        routeSplit.forEach(async (tag, index) => {
          await RouteHandler.updateRouteTag(tag, slug, date).catch((err) => {
            if (err) {
              routeSplit.splice(index, 1);
            }
          });
        });
        output.route = routeSplit;
      }
      if (userSplit.length > 0) {
        userSplit.forEach(async (tag, index) => {
          await UserMethods.updateUserTag(tag, slug, date).catch((err) => {
            if (err) {
              userSplit.splice(index, 1);
            }
          });
        });
        output.user = userSplit;
      }
      console.log(output);
      winston.info(output);
      Promise.all([output.gym, output.user, output.route]).then((data) => {
        resolve({ gym: data[0], user: data[1], route: data[2] });
      });
    });
  }
}
