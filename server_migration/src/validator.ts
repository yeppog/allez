import { Request, Response } from "express";
import { body, header, validationResult } from "express-validator";

import winston from "winston";

export const validator = (method: string) => {
  switch (method) {
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
