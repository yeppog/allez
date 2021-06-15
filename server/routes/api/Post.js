const express = require("express");
const postRouter = express.Router();
const mongoose = require("mongoose");
const post = require("./../../models/Post");
const crypto = require("crypto");
const ObjectId = require("mongodb").ObjectID;
const jwt = require("jsonwebtoken");
const User = require("./../../models/User");
const { use } = require("./Users");
const { read } = require("fs");
const Post = require("./../../models/Post");
const uploadMedia = require("./../../gridfs").uploadMedia;
const Comment = require("./../../models/Comment");

/**
 * Fetches a post of a particular slug.
 * @param {Request} req The HTTP request with a header containing a parameter slug.
 * @param {Response} res The HTTP response to output to.
 */

async function handleGetPost(req, res) {
  if (!req.header("slug")) {
    res.status(400).json({ message: "Post not specified" });
  } else {
    post
      .findOne({ slug: req.header("slug") })
      .then((data) => {
        if (data == null) {
          res.status(403).json({ message: "Post not found." });
        } else {
          res.status(200).json(data);
        }
      })
      .catch((err) => {
        rdtaes.status(403).json(err);
      });
  }
}

async function createPost(post) {
  return new Promise((resolve, reject) => {
    try {
      crypto.randomBytes(16, async (err, buff) => {
        if (err) {
          reject(err);
        } else {
          post.slug = buff.toString("hex");
          post
            .save()
            .then((data) => resolve(data))
            .catch((err) => reject(err));
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * @deprecated
 * @param {*} post
 * @returns
 */
// async function editPost(post) {
//   return new Promise((resolve, reject) => {
//     if (!post.slug) {
//       reject("Post doesnt have an existing slug. Post doesn't exist");
//     } else {
//       post
//         .findOne({ slug: post.slug })
//         .then((data) =>
//           post
//             .save()
//             .then((save) => resolve(save))
//             .catch((err) => reject(err))
//         )
//         .catch((err) => reject(err));
//     }
//   });
// }

/**
 * @deprecated
 * @param {*} postinput
 * @returns
 */
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

async function handleCreatePost(req, res, next) {
  if (!req.header("token")) {
    return res.status(403).json({ message: "No user token" });
  } else {
    try {
      const id = jwt.verify(req.header("token"), process.env.JWT_SECRET).id;
      User.findById(new ObjectId(id))
        .then(async (user) => {
          const post = new Post({
            userId: user.id,
            username: user.username,
            body: req.body.body,
            avatarPath: user.avatarPath,
            mediaPath: "",
            tag: user.tag,
          });
          let filePath;
          if (req.file) {
            if (req.file.mimetype == "video/mp4") {
              const upload = require("./Video").uploadVideo;
              const caption = `${user.id}_${req.file.filename}`;

              await upload(caption, req.file.filename, req.file.id)
                .then((data) => (filePath = data))
                .catch((err) =>
                  res
                    .status(500)
                    .json({ message: "Error saving the video", error: err })
                );
            } else if (
              req.file.mimetype == "image/png" ||
              req.file.mimetype == "image/jpeg"
            ) {
              const imgupload = require("./Image").uploadImage;
              const options = "/api/images/media/";
              const imgcaption = `${user.id}_${req.file.filename}`;
              await imgupload(
                imgcaption,
                req.file.filename,
                req.file.id,
                options
              )
                .then((data) => (filePath = data))
                .catch((err) =>
                  res
                    .status(500)
                    .json({ message: "Error saving the image", error: err })
                );
            }
          }
          post.mediaPath = filePath == undefined ? "" : filePath;

          const createPost = require("./Post").createPost;
          createPost(post)
            .then((data) => {
              user.postCount = user.postCount + 1;
              // format date to for query
              const date = `${data.createdAt.getFullYear()}${data.createdAt.getMonth()}${data.createdAt.getDate()}`;
              // only concatenate to the array if the slug id doesnt exist
              const posts = { ...user.posts };
              const datePosts = posts[date];
              if (datePosts) {
                if (!datePosts.includes(data.id)) {
                  posts[date] = [...posts[date], data.id];
                  user.posts = { ...posts };
                }
              } else {
                posts[date] = [data.id];
                user.posts = { ...posts };
              }

              user
                .save()
                .then((updateUser) => res.status(200).json(data))
                .catch((err) =>
                  res.status(400).json({ message: "Error updating the user" })
                );
            })
            .catch((err) =>
              res
                .status(400)
                .json({ message: "Error saving the post", error: err })
            );
        })
        .catch((err) => res.status(403).json(err));
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        res.status(403).json({ message: "Token has expired" });
      } else if (err instanceof jwt.JsonWebTokenError) {
        res.status(403).json({ message: "Invalid JWT" });
      } else {
        res.status(500).json(err);
      }
    }
  }
}

/**
 * Deletes a specified post of a specified user. Updates the user's list of posts.
 * @param {Request} req The HTTP request containing a body with slug and token as parameters.
 * @param {Response} res The response to output to.
 */
async function handleDeletePost(req, res) {
  if (!req.body.slug || !req.body.token) {
    res
      .status(400)
      .json({ message: "Bad request. Missing post slug or user token." });
  } else {
    post
      .findOne({ slug: req.body.slug })
      .then((post) => {
        try {
          const id = jwt.verify(req.body.token, process.env.JWT_SECRET).id;
          const postId = post.id;
          const postDate = post.createdAt;
          post
            .deleteOne({ _id: new ObjectId(post.id) })
            .then(() => {
              User.findById(new ObjectId(id))
                .then(async (user) => {
                  var posts = { ...user.posts };
                  const date = `${postDate.getFullYear()}${postDate.getMonth()}${postDate.getDate()}`;
                  const filtered = posts[date].filter((post) => post != postId);
                  if (filtered.length == 0) {
                    delete posts[date];
                  } else {
                    posts[date] = filtered;
                  }
                  user.posts = { ...posts };
                  user.postCount = user.postCount - 1;
                  await user
                    .save()
                    .then((data) => res.status(200).json(data))
                    .catch((err) =>
                      res.status(403).json({
                        message: "Unable to update user posts",
                        err: err,
                      })
                    );
                })
                .catch((err) =>
                  res
                    .status(403)
                    .json({ message: "Unable to find the user", err: err })
                );
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
        res.status(400).json({ message: "Unable to find the post", err: err })
      );
  }
}

/**
 * Takes in a token, slug and a body to add a comment to a specified post by a specified user.
 * @param {Request} req The HTTP request containing a body with token, slug and body parameters.
 * @param {Response} res The response to output to.
 */
async function addCommentToPost(req, res) {
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
          User.findById(new ObjectId(user.id))
            .then((user) => {
              const comment = new Comment({
                post: post.slug,
                body: req.body.body,
                username: user.username,
                comments: [],
                edited: false,
                avatarPath: user.avatarPath,
                user: user.id,
              });

              comment
                .save()
                .then((savedComment) => {
                  var comments = post.comments;
                  comments = [...comments, savedComment.id];
                  post.comments = comments;
                  post
                    .save()
                    .then((data) => res.status(200).json(savedComment))
                    .catch((err) => res.status(400).json(err));
                })
                .catch((err) =>
                  res.status(400).json({ message: "Could not save comment" })
                );
            })
            .catch((err) =>
              res.status(403).json({ message: "User not found" })
            );
        } catch (err) {
          handleJWTError(res, err);
        }
      })
      .catch((err) => res.status(403).json({ message: "Unable to find post" }));
  }
}

async function addCommentToComment(req, res) {
  if (!req.body.token || !req.body.comment) {
    res.status(400).json({
      message: "Bad request. User token and body slug must be present.",
    });
  } else {
    Comment.findById(new ObjectId(req.body.comment))
      .then((cmt) => {
        console.log(cmt);
        try {
          const user = jwt.verify(req.body.token, process.env.JWT_SECRET);
          User.findById(new ObjectId(user.id))
            .then((user) => {
              const comment = new Comment({
                post: cmt.post,
                body: req.body.body,
                username: user.username,
                comments: [],
                edited: false,
                avatarPath: user.avatarPath,
                user: user.id,
              });

              comment
                .save()
                .then((savedComment) => {
                  var comments = cmt.comments;
                  comments = [...comments, savedComment.id];
                  cmt.comments = comments;
                  cmt
                    .save()
                    .then((data) => res.status(200).json(savedComment))
                    .catch((err) => res.status(400).json(err));
                })
                .catch((err) =>
                  res.status(400).json({ message: "Could not save comment" })
                );
            })
            .catch((err) =>
              res.status(403).json({ message: "User not found" })
            );
        } catch (err) {
          handleJWTError(res, err);
        }
      })
      .catch((err) =>
        res.status(403).json({ message: "Unable to find comment" })
      );
  }
}

/**
 * Takes in a token, slug and date to delete a comment of a specific user that was made at a specific time on a specified post.
 * @param {Request} req The request made to this endpoint. Token, slug and date is required in the body.
 * @param {Response} res The response to output to.
 */

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
          handleJWTError(res, err);
        }
      })
      .catch((err) => res.status(403).json({ message: "Unable to find post" }));
  }
}

async function handleLike(req, res) {
  if (!req.header("slug") || !req.header("token")) {
    res.status(200).json({ message: "Bad request, slug or token not found." });
  } else {
    Post.findOne({ slug: req.header("slug") })
      .then((post) => {
        try {
          const id = jwt.verify(req.header("token"), process.env.JWT_SECRET).id;
          User.findById(new ObjectId(id))
            .then((user) => {
              const postLikes = { ...post.likedUsers };
              const username = user.username;
              if (username in postLikes) {
                delete postLikes[username];
                postLikes.like = postLikes.like - 1;
              } else {
                postLikes[username] = new Date();
                postLikes.like = postLikes.like + 1;
              }
              post.likedUsers = postLikes;
              post
                .save()
                .then((data) => res.status(200).json(data))
                .catch((err) => res.status(403).json(err));
            })
            .catch((err) => res.status(403).json(err));
        } catch (err) {
          handleJWTError(res, err);
        }
      })
      .catch((err) =>
        res.status(403).json({ message: "Post cannot be found." })
      );
  }
}

/**
 * Selectively handles the JWT errors. Else, throw the error back out to be catched by the async pipeline.
 * @param {Response} res The HTTP response to output the response to.
 * @param {Error} err The error received
 */

function handleJWTError(res, err) {
  if (err instanceof jwt.TokenExpiredError) {
    res.status(403).json({ message: "Token has expired" });
  } else if (err instanceof jwt.JsonWebTokenError) {
    res.status(403).json({ message: "Invalid JWT" });
  } else {
    throw err;
  }
}
postRouter.get("/getpost", handleGetPost);
postRouter.post("/deleteComment", deleteComment);
postRouter.post("/addCommentToPost", addCommentToPost);
postRouter.post("/addCommentToComment", addCommentToComment);
postRouter.post("/deletePost", handleDeletePost);
postRouter.get("/like", handleLike);
postRouter.post("/createpost", uploadMedia.single("file"), handleCreatePost);
module.exports = { postRouter, createPost };
