import { authRouter } from "./routes/auth";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { google } from "googleapis";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { postRouter } from "./routes/post";
import { router } from "./routes/user";
import swaggerjsdoc from "swagger-jsdoc";
import swaggeruiexpress from "swagger-ui-express";
import { videoRouter } from "./routes/video";
import winston from "winston";

// Load process.env file
dotenv.config();

export const app = express();
const port = 3001; // default port to listen

app.use(
  cors({
    allowedHeaders: [
      "sessionId",
      "Content-Type",
      "token",
      "username",
      "target",
      "user",
      "slug",
    ],
    exposedHeaders: ["sessionId"],
    origin: "*",
    methods: "GET, PUT, PATCH, POST, DELETE",
  })
);

app.use(express.json());
app.use("/api/users", authRouter);
app.use("/api/users", router);
app.use("/api/posts", postRouter);
app.use("/api/videos", videoRouter);

// Nodemailer for google SMTP

const oauth2Client = new google.auth.OAuth2(
  process.env.clientID,
  process.env.clientSecret,
  "https://developers.google.com/oauthplayground"
);
oauth2Client.setCredentials({
  refresh_token: process.env.refreshToken,
});

let accessToken;
oauth2Client
  .getAccessToken()
  .then((data) => (accessToken = data.token))
  .catch((err) => {
    if (err) {
      winston.error(err.message);
    }
  });

export const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "allez.orbital@gmail.com",
    clientId: process.env.clientID,
    clientSecret: process.env.clientSecret,
    refreshToken: process.env.refreshToken,
    accessToken,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
  winston.format.align(),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

winston.add(new winston.transports.Console({ format: logFormat }));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Allez Express API with Swagger",
      version: "1.0.0",
      description:
        "This API serves the entire data system for the Allez social network",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Jonathan Lee & Ng Zi Xuan",
      },
    },
    servers: [
      {
        url: "https://allez-orbital.herokuapp.com",
      },
    ],
  },
  apis: ["**/*.ts"],
};

app.use(
  "/",
  swaggeruiexpress.serve,
  swaggeruiexpress.setup(swaggerjsdoc(options))
);
