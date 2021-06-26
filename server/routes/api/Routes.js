const express = require("express");
const mongoose = require("mongoose");
const post = require("./../../models/Post");
const crypto = require("crypto");
const ObjectId = require("mongodb").ObjectID;
const jwt = require("jsonwebtoken");
const User = require("./../../models/User").User;
const Post = require("./../../models/Post");
const Comment = require("./../../models/Comment");
const Image = require("./../../models/Images");
const { addPostTagRelation, fetchAllRoutes } = require("../../handlers/Route");
const createUser = require("../../handlers/User").createUser;
const Route = require("../../models/Route");
const { handleJWTError } = require("../../handlers/Error");

const routeRouter = express.Router();

async function handleCreateRoute(req, res) {
  if (!req.header("token")) {
    res.status(404).json({ message: "Missing token" });
  } else if (
    !req.body.gym ||
    !req.body.grade ||
    !req.body.color ||
    !req.body.name
  ) {
    res.status(404).json({ message: "Missing required fields" });
  } else {
    const route = new Route({
      gym: req.body.gym,
      grade: req.body.grade,
      color: req.body.color,
      tags: req.body.tags,
      name: req.body.name,
    });
    try {
      const id = jwt.verify(req.header("token"), process.env.JWT_SECRET).id;
      User.findById(new ObjectId(id))
        .then(() => {
          route
            .save()
            .then((route) => res.status(200).json(route))
            .catch((err) => res.status(403).json(err.message));
        })
        .catch((err) => res.status(403).json(err.message));
    } catch (err) {
      handleJWTError(res, err);
    }
  }
}

async function handleFetchAll(req, res) {
  fetchAllRoutes(Route)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(404).json(err.message));
}

routeRouter.get("/routes", handleFetchAll);
routeRouter.post("/create", handleCreateRoute);

module.exports = routeRouter;
