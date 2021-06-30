import express, { Request, Response } from "express";
import mongoose, { Document } from "mongoose";

import bcrypt from "bcrypt";
import { body } from "express-validator";
import winston from "winston";

// const logger = winston.loggers.get("logger");

export class User {
  static validate = (method: string) => {
    switch (method) {
      case "register": {
        return [
          body("name", "Name doesn't exist on the body.").exists(),
          body("username", "Username doesn't exist on the body."),
          body("email", "Invalid email.").exists().isEmail(),
          body("password", "Password doesn't exist on the body.").exists(),
        ];
      }
    }
  };

  static getPasswordHash(password: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      bcrypt.genSalt().then((salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            winston.error("Error generating password hash.");
            reject("Error generating password hash.");
          }
          resolve(hash);
        });
      });
    });
  }
}
