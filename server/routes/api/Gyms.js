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
const { addPostTagRelation } = require("../../handlers/Route");
const createUser = require("../../handlers/User").createUser;
const {
  handleCreateError,
  confirmUser,
  fetchAllUsers,
} = require("../../handlers/User");
const Gym = require("./../../models/User").Gym;
const { handleConfirmError } = require("../../handlers/Error");

const gymRouter = express.Router();

async function handleRegister(req, res) {
  const newUser = new Gym({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    address: req.body.address,
    postalCode: req.body.postalCode,
    activated: false,
  });
  createUser(newUser)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      handleCreateError(err, res);
    });
}

async function handleConfirm(req, res) {
  if (!req.header("token")) {
    return res.status(400).json({ message: "Missing token" });
  } else {
    confirmUser(Gym, req.header("token"))
      .then((data) => res.status(200).json({ message: data }))
      .catch((err) => handleConfirmError(res, err));
  }
}

async function handleFetchAll(req, res) {
  fetchAllUsers(Gym)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(404).json(err.message));
}

gymRouter.post("/register", handleRegister);
gymRouter.get("/confirm", handleConfirm);
gymRouter.get("/gyms", handleFetchAll);

module.exports = gymRouter;
