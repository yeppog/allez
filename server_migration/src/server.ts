import app from "./index";
import mongoose from "mongoose";
import winston from "winston";

const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
  winston.format.align(),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

winston.add(new winston.transports.Console({ format: logFormat }));

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => winston.info("MongoDB connection established.")
);

app.listen(process.env.PORT || 3001, () => {
  winston.info(`Server started on port ${3001}`);
});
