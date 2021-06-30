import express, { Request, Response } from "express";
import { validate, validator } from "../validators/UserValidator";

import { User } from "../models/UserSchema";
import { User as UserMethods } from "../handlers/UserHandler";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import winston from "winston";

export const userRouter = express.Router();

async function handleRegister(req: Request, res: Response) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(200).json({ errors: errors.array() });
  }
  const { name, username, email, password } = req.body;

  UserMethods.getPasswordHash(password)
    .then((hash) => {
      const newUser = new User({
        name,
        username,
        email,
        password: hash,
      });
      newUser
        .save()
        .then((user) => {
          winston.info(`User ${user.username} successfully registered.`);
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
          winston.debug("Send email");
          res.status(200).json(token);
        })
        .catch((err) => {
          winston.error(err.message);
          res.status(403).json(err.message);
        });
    })
    .catch((err) => {
      winston.error(err.message);
      res.status(401).json(err.message);
    });
}

userRouter.post("/register", validator("register"), validate, handleRegister);
