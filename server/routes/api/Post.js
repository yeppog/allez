const express = require("express");
const postRouter = express.Router();
const mongoose = require("mongoose");
const post = require("./../../models/Post");
const crypto = require("crypto");
const ObjectId = require("mongodb").ObjectID;
const jwt = require("jsonwebtoken");
const User = require("./../../models/User");
const { use } = require("./Users");

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

async function editPost(post) {
  return new Promise((resolve, reject) => {
    if (!post.slug) {
      reject("Post doesnt have an existing slug. Post doesn't exist");
    } else {
      post
        .findOne({ slug: post.slug })
        .then((data) =>
          post
            .save()
            .then((save) => resolve(save))
            .catch((err) => reject(err))
        )
        .catch((err) => reject(err));
    }
  });
}

async function deletePost(postinput) {
  return new Promise((resolve, reject) => {
    post
      .findById(new ObjectId(postinput.id))
      .then((data) =>
        post
          .deleteOne({ _id: new ObjectId(postinput.id) })
          .then(() => resolve("Deleted successfully"))
          .catch((err) => reject(err))
      )
      .catch((err) => reject(err));
  });
}

async function handleDeletePost(req, res) {
  if (!req.body.slug || !req.body.token) {
    return res
      .status(400)
      .json({ message: "Bad request. Missing post slug or user token." });
  } else {
    console.log(req.body.slug);
    post
      .findOne({ slug: req.body.slug })
      .then((post) => {
        console.log(post);
        try {
          const id = jwt.verify(req.body.token, process.env.JWT_SECRET).id;
          console.log(id);
          const postId = post.id;
          const postDate = post.createdAt;
          console.log(postId);
          post
            .deleteOne({ _id: new ObjectId(post.id) })
            .then(() => {
              User.findById(new ObjectId(id)).then((user) => {
                var posts = user.posts;
                const date = `${postDate.getFullYear()}${postDate.getMonth()}${postDate.getDate()}`;
                posts = posts[date].filter((post) => post != postId);
                user.posts = posts;
                user.postCount = user.postCount - 1;
                user
                  .save()
                  .then((data) => res.status(200).json(data))
                  .catch((err) =>
                    res.status(403).json({
                      message: "Unable to update user posts",
                      err: err,
                    })
                  );
              });
            })
            .catch((err) =>
              res
                .status(400)
                .json({ message: "Unable to delete the post", err: err })
            );
        } catch (err) {
          handleJWTError(res, err);
        }
      })
      .catch((err) =>
        res.status(400).json({ message: "Unable to find the post.", err: err })
      );
  }
}

async function addComment(req, res) {
  if (!req.body.token || !req.body.slug) {
    res.status(400).json({
      message: "Bad request. User token and body slug must be present.",
    });
  } else {
    post
      .findOne({ slug: req.body.slug })
      .then((post) => {
        try {
          const user = jwt.verify(req.body.token, process.env.JWT_SECRET);
          console.log(new ObjectId(user.id));
          User.findById(new ObjectId(user.id))
            .then((user) => {
              var comments = post.comments;
              comments = [
                ...comments,
                {
                  date: new Date(),
                  user: user.username,
                  body: req.body.body,
                },
              ];
              post.comments = comments;
              post
                .save()
                .then((data) => res.status(200).json(data))
                .catch((err) => res.status(400).json(err));
            })
            .catch((err) =>
              res.status(403).json({ message: "User not found" })
            );
        } catch (err) {
          if (err instanceof jwt.TokenExpiredError) {
            res.status(403).json({ message: "Token has expired" });
          } else if (err instanceof jwt.JsonWebTokenError) {
            res.status(403).json({ message: "Invalid JWT" });
          } else {
            res.status(500).json(err);
          }
        }
      })
      .catch((err) => res.status(403).json({ message: "Unable to find post" }));
  }
}

async function deleteComment(req, res) {
  if (!req.body.token || !req.body.slug || !req.body.date) {
    res.status(400).json({
      message:
        "Bad request. User token and body slug and comment timestamp must be present.",
    });
  } else {
    post
      .findOne({ slug: req.body.slug })
      .then((post) => {
        try {
          const user = jwt.verify(req.body.token, process.env.JWT_SECRET);
          console.log(new ObjectId(user.id));
          User.findById(new ObjectId(user.id))
            .then((user) => {
              var comments = post.comments;
              // filters out the comment by the user and the timestamp of the comment to filter out
              comments = comments.filter(
                (item) =>
                  item.date.toISOString() != req.body.date &&
                  item.user == user.username
              );
              post.comments = comments;
              post
                .save()
                .then((data) => res.status(200).json(data))
                .catch((err) => res.status(400).json(err));
            })
            .catch((err) =>
              res.status(403).json({ message: "User not found" })
            );
        } catch (err) {
          if (err instanceof jwt.TokenExpiredError) {
            res.status(403).json({ message: "Token has expired" });
          } else if (err instanceof jwt.JsonWebTokenError) {
            res.status(403).json({ message: "Invalid JWT" });
          } else {
            res.status(500).json(err);
          }
        }
      })
      .catch((err) => res.status(403).json({ message: "Unable to find post" }));
  }
}

function handleJWTError(res, err) {
  if (err instanceof jwt.TokenExpiredError) {
    res.status(403).json({ message: "Token has expired" });
  } else if (err instanceof jwt.JsonWebTokenError) {
    res.status(403).json({ message: "Invalid JWT" });
  } else {
    throw err;
  }
}

postRouter.post("/deleteComment", deleteComment);
postRouter.post("/addComment", addComment);
postRouter.post("/deletePost", handleDeletePost);
module.exports = { postRouter, createPost };
