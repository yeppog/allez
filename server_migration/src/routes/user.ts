import express, { Request, Response } from "express";
import { validate, validator } from "../validator";

import { Errors } from "../handlers/Errors";
import { User } from "../models/UserSchema";
import { User as UserMethods } from "../handlers/UserHandler";
import winston from "winston";

export const userRouter = express.Router();

async function handleRegister(req: Request, res: Response) {
  const { name, username, email, password } = req.body;

  const newUser = new User({
    name,
    username,
    email,
    password,
  });
  UserMethods.createUser(newUser)
    .then((token) => res.status(200).json(token))
    .catch((err) => {
      winston.error(err.message);
      res.status(401).json(err.message);
    });
}

async function handleVerify(req: Request, res: Response) {
  const token = req.header("token");
  console.log(token);
  UserMethods.verifyToken(token, User)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      try {
        Errors.handleJWTError(err, res);
      } catch (err) {
        res.status(500).json(err.message);
      }
    });
}

userRouter.post("/register", validator("register"), validate, handleRegister);
userRouter.get("/verify", validator("verify"), validate, handleVerify);
