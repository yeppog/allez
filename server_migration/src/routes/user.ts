import { IUserDoc, User } from "../models/UserSchema";
import express, { Request, Response } from "express";
import { passwordMatch, validate, validator } from "../validator";

import { Errors } from "../handlers/Errors";
import { ImageHandler } from "../handlers/ImageHandler";
import { UserMethods } from "../handlers/UserHandler";
import { uploadAvatar } from "../store";
import winston from "winston";

export const router = express.Router();

class UserActions {
  static async handleUpdate(req: Request, res: Response) {
    const token = req.header("token");
    const { bio, name } = req.body;
    const file = req.file;
    UserMethods.getUserFromToken(token, User)
      .then(async (user) => {
        // Upload the Avatar
        if (req.file) {
          const caption = `${user.id}_avatar`;
          await ImageHandler.saveAvatar(
            caption,
            file.filename,
            file.id,
            "/api/images/avatar/"
          ).then((url) => (user.avatarPath = url));
        }

        user.bio = bio ? bio : user.bio;
        user.name = name ? name : user.name;

        user
          .save()
          .then((savedUser: IUserDoc) => res.status(200).json(savedUser))
          .catch((err) => {
            res.status(500).json(err.message);
          });
      })
      .catch((err) => res.status(500).json(err.message));
  }

  static async handleFollow(req: Request, res: Response) {
    const token = req.header("token");
    const username = req.body.username;
    UserMethods.getUserFromToken(token, User).then((user) => {
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
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json(err.message));
    });
  }

  static async handleFetchAllUsers(req: Request, res: Response) {
    User.find({})
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json(err.message));
  }
}

router.post("/update", uploadAvatar.single("file"), UserActions.handleUpdate);
router.get("/follow", UserActions.handleFollow);
router.get("/users", UserActions.handleFetchAllUsers);
