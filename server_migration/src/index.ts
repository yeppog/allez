import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { userRouter } from "./routes/user";

// Load process.env file
dotenv.config();

const app = express();
const port = 3001; // default port to listen

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use(express.json());
app.use("/api/users", userRouter);

export default app;
