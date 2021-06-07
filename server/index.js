/** Imports for express */
const express = require("express");
const app = express();

/** Imports for mongoDB */
const mongoose = require("mongoose");

/** Imports for CORS policy */
const cors = require("cors");

/** Import for swagger API docs */
swaggerJsdoc = require("swagger-jsdoc");
swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Allez Express API with Swagger",
      version: "0.1.0",
      description:
        "This API serves the entire data system for the Allez social network",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Jonathan Lee & Ng Zi Xuan",
        // url: "https://logrocket.com",
        // email: "info@email.com",
      },
    },
    servers: [
      {
        url: "https://allez-orbital.herokuapp.com",
      },
    ],
  },
  apis: ["./routes/api/Users.apidocs.js"],
};

require("dotenv").config();

app.use(express.json());
app.use(
  cors({
    allowedHeaders: ["sessionId", "Content-Type", "token"],
    exposedHeaders: ["sessionId"],
    origin: "*",
    methods: "GET, PUT, PATCH, POST, DELETE",
  })
);

/** Import User API */
const users = require("./routes/api/Users");
const { config } = require("dotenv");

/** Import Images API */
const images = require("./routes/api/Image");

/**
 * Route for User API
 */
app.use("/api/users", users);

const upload = require("./gridfs");
app.use("/api/images", images.router);
app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsdoc(options), { explorer: true })
);

/**
 * Connects to the MongoDB atlas server. Only starts the server if the connection to the DB is successful.
 */
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     app.listen(process.env.PORT || 3001, () => {
//       console.log("Server started on port 3001");
//     });
//   });

// app.listen(process.env.PORT || 3001, () => {
//   console.log("Server started on port 3001");
//   mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//   });
// });

/**
 * Boilerplate GET request to test root.
 */

app.get("/", async (req, res) => {
  res.json("test");
});

module.exports = app;
