import express, { Request, Response } from "express";
import { passwordMatch, validate, validator } from "../validator";

import { Errors } from "../handlers/Errors";
import { User } from "../models/UserSchema";
import { UserMethods } from "../handlers/UserHandler";
import { uploadAvatar } from "../store";
import winston from "winston";

export const router = express.Router();

class UserActions {
  static async handleUpdate(req: Request, res: Response) {
    const { token, body } = req.body;
    const file = req.file;
    UserMethods.verifyJWT(token)
      .then((id) => {
        // Upload the Avatar
        winston.info(JSON.stringify(file));
        res.status(200).json(id);
      })
      .catch((err) => res.status(500).json(err.message));
  }
}

router.post("/update", uploadAvatar.single("file"), UserActions.handleUpdate);
