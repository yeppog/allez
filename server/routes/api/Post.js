const express = require("express");
const postRouter = express.Router();
const mongoose = require("mongoose");
const post = require("./../../models/Post");
const crypto = require("crypto");

postRouter.get("/getpost", (req, res) => {
  if (!req.header("slug")) {
    return res.status(400).json({ message: "Post not specified" });
  } else {
    post
      .findOne({ slug: req.header("slug") })
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((err) => {
        return res.status(403).json(err);
      });
  }
});

async function createPost(post) {
  return new Promise((resolve, reject) => {
    try {
      crypto.randomBytes(16, async (err, buff) => {
        if (err) {
          reject(err);
        } else {
          post.slug = buff.toString("hex");
          const res = await post.save();
          resolve(res);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { postRouter, createPost };
