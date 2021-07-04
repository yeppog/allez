import express, { Request, Response } from "express";
import { validate, validator } from "../validator";

import { Errors } from "../handlers/Errors";
import { User } from "../models/UserSchema";
import { User as UserMethods } from "../handlers/UserHandler";
import winston from "winston";

export const userRouter = express.Router();

class Login {
  static async handleRegister(req: Request, res: Response) {
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

  static async handleVerify(req: Request, res: Response) {
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

  static async handleLogin(req: Request, res: Response) {
    const { username, email, password } = req.body;
    UserMethods.login(User, password, email, username)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        if (err === "Account not activated") {
          res.status(403).json(err);
        } else {
          res.status(401).json(err.message);
        }
      });
  }

  static async handleConfirm(req: Request, res: Response) {
    const token = req.header("token");
    UserMethods.confirm(User, token)
      .then((data) => res.status(200).json(data))
      .catch((err) => {
        try {
          Errors.handleJWTError(err, res);
        } catch (err) {
          res.status(500).json(err.message);
        }
      });
  }
}

userRouter.post(
  "/register",
  validator("register"),
  validate,
  Login.handleRegister
);
userRouter.get("/verify", validator("verify"), validate, Login.handleVerify);
userRouter.post("/login", validator("login"), validate, Login.handleLogin);
userRouter.get("/confirm", validator("confirm"), validate, Login.handleConfirm);
