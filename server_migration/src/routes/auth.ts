import express, { Request, Response } from "express";
import { passwordMatch, validate, validator } from "../validator";

import { Errors } from "../handlers/Errors";
import { User } from "../models/UserSchema";
import { UserMethods } from "../handlers/UserHandler";
import winston from "winston";

export const authRouter = express.Router();

class Auth {
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

  static async handleReset(req: Request, res: Response) {
    const email = req.header("email");
    UserMethods.resetReq(User, email)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        try {
          Errors.handleJWTError(err, res);
        } catch (err) {
          res.status(500).json(err.message);
        }
      });
  }

  static async handleResetEnd(req: Request, res: Response) {
    const token = req.header("token");
    const { password, password_confirm } = req.body;
    UserMethods.reset(User, token, password)
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

authRouter.post(
  "/register",
  validator("register"),
  validate,
  Auth.handleRegister
);
authRouter.get("/verify", validator("verify"), validate, Auth.handleVerify);
authRouter.post("/login", validator("login"), validate, Auth.handleLogin);
authRouter.get("/confirm", validator("confirm"), validate, Auth.handleConfirm);
authRouter.get("/reset", validator("reset"), validate, Auth.handleReset);
authRouter.post(
  "/reset/end",
  passwordMatch,
  validator("token"),
  validator("resetEnd"),
  validate,
  Auth.handleResetEnd
);
