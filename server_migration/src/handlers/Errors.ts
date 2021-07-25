import { Request, Response } from "express";

import jwt from "jsonwebtoken";
import winston from "winston";

export class Errors {
  static handleJWTError(err: Error, res: Response): void {
    if (err instanceof jwt.JsonWebTokenError) {
      winston.error(err.message);
      res.status(400).json(err.message);
    } else if (err instanceof jwt.TokenExpiredError) {
      winston.error(err.message);
      res.status(403).json(err.message);
    } else {
      throw err;
    }
  }
}
