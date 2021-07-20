import { app } from "./index";
import mongoose from "mongoose";
import winston from "winston";

// winston.info(process.env.MONGO_URI);
// mongoose.connect(
//   process.env.MONGO_URI,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//   },
//   () => winston.info("MongoDB connection established.")
// );

app.listen(process.env.PORT || 3001, () => {
  winston.info(`Server started on port ${3001}`);
});
