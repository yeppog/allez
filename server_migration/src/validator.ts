import { Request, Response } from "express";
import { body, header, validationResult } from "express-validator";

import winston from "winston";

export const validator = (method: string) => {
  switch (method) {
    case "token": {
      return [header("token", "Token doesn't exist on the header.").exists()];
    }
    case "register": {
      return [
        body("name", "Name doesn't exist on the body.").exists(),
        body("username", "Username doesn't exist on the body.").exists(),
        body("email", "Invalid email.").exists().isEmail(),
        body("password", "Password doesn't exist on the body.").exists(),
      ];
    }
    case "verify": {
      return [header("token", "Token doesn't exist on the header.").exists()];
    }
    case "login": {
      return [
        body(
          ["username", "email"],
          "Email or username doesn't exist on the body."
        ).if((value: string[]) => value[0] || value[1]),
        body("password", "password doesn't exist on the body.").exists(),
      ];
    }
    case "confirm": {
      return [header("token", "Token doesn't exist on the header.").exists()];
    }
    case "reset": {
      return [header("email", "Email doesn't exist on the header.").exists()];
    }
    case "resetEnd": {
      return [
        body("password", "Password doesn't exist on the body.").exists(),
        body(
          "password_confirm",
          "Password confirm doesn't exist on the body."
        ).exists(),
      ];
    }
  }
};

export const postValidator = (method: string) => {
  switch (method) {
    case "token": {
      return [header("token", "Token doesn't exist on the header.").exists()];
    }
    case "create": {
      return [
        body("body", "Post body doesn't exist on the request body.").exists(),
      ];
    }
    case "edit": {
      return [
        body("body", "Post body doesn't exist on the request body.").exists(),
      ];
    }
  }
};

export const validate = (req: Request, res: Response, next: () => any) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [] as { [key: string]: string }[];
  errors.array().map((err) => {
    winston.error(`VALIDATION ERROR: ${err.msg}`);
    extractedErrors.push({ [err.param]: err.msg });
  });

  return res.status(422).json({
    errors: extractedErrors,
  });
};
export const passwordMatch = body("password_confirm").custom(
  (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords does not match");
    }
    return true;
  }
);

export const validateFile = (req: Request, res: Response, next: () => any) => {
  if (!req.file) {
    res.status(422).json("No file provided!");
  } else {
    return next();
  }
};
