import { Request, Response } from "express";
import { body, validationResult } from "express-validator";

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
