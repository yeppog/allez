import express, { Request, Response } from "express";
import {
  passwordMatch,
  postValidator,
  validate,
  validateFile,
  validator,
} from "../validator";

import { Errors } from "../handlers/Errors";
import { ImageHandler } from "../handlers/ImageHandler";
import { Post } from "../models/PostSchema";
import { PostHandler } from "../handlers/PostHandler";
import { User } from "../models/UserSchema";
import { UserMethods } from "../handlers/UserHandler";
import { VideoHandler } from "../handlers/VideoHandler";
import crypto from "crypto";
import { uploadMedia } from "../store";
import winston from "winston";

export const postRouter = express.Router();

class PostActions {
  public static async handleCreatePost(req: Request, res: Response) {
    const token = req.header("token");
    UserMethods.getUserFromToken(token, User)
      .then((user) => {
        const post = new Post({
          userId: user.id,
          username: user.username,
          postBody: req.body.body,
          mediaPath: "",
          slug: "",
          tag: { user: [], gym: [], route: [] },
        });
        const filetype = req.file.mimetype;
        const caption = `${user.id}_${req.file.filename}`;
        if (
          filetype === "image/png" ||
          filetype === "image/jpeg" ||
          filetype === "jpg"
        ) {
          // create the image object
          ImageHandler.uploadImage(
            caption,
            req.file.filename,
            req.file.id,
            "/api/images/"
          )
            .then((image) => (post.mediaPath = image))
            .catch((err) => res.status(500).json(err.message));
        } else {
          // create the video object
          VideoHandler.uploadVideo(
            caption,
            req.file.filename,
            req.file.id,
            "/api/videos/"
          )
            .then((video) => (post.mediaPath = video))
            .catch((err) => res.status(500).json(err.message));
        }
        crypto.randomBytes(32, async (err, buff) => {
          if (err) {
            winston.error(err.message);
            res.status(500).json(err.message);
          } else {
            post.slug = buff.toString("hex");
            // settte tagging here with another method

            PostHandler.handleNewTags(
              {
                gym: req.body.taggedGym,
                user: req.body.taggedUser,
                route: req.body.taggedRoute,
              },
              post.slug,
              new Date(post.createdAt)
            ).then((tagged) => {
              post.tag = tagged;
              post
                .save()
                .then((savedPost) => {
                  savedPost.tag = tagged;
                  winston.info(
                    `Post ${process.env.DOMAIN}/post/${savedPost.slug} by user ${savedPost.username} has been successfully created.`
                  );
                  res.status(200).json(savedPost);
                })
                .catch((saveErr) => res.status(500).json(saveErr.message));
            });
          }
        });
      })
      .catch((err) => res.status(403).json(err.message));
  }

  public static async handleEditPost(req: Request, res: Response) {
    const token = req.header("token");
    UserMethods.getUserFromToken(token, User).then((user) => {
      Post.findOne({ slug: req.body.slug }).then((post) => {
        if (!post) {
          res.status(404).json("Unable to find the post.");
        } else {
          post.postBody = req.body.postBody ? req.body.postBody : post.postBody;
          // handle the tagging here
          post.edited = true;
          PostHandler.handleNewTags(
            {
              gym: req.body.taggedGym,
              user: req.body.taggedUser,
              route: req.body.taggedRoute,
            },
            post.slug,
            new Date(post.createdAt)
          ).then((tagged) => {
            post.tag = tagged;
            post
              .save()
              .then((savedPost) => {
                savedPost.tag = tagged;
                winston.info(
                  `Post ${process.env.DOMAIN}/post/${savedPost.slug} by user ${savedPost.username} has been successfully edited.`
                );
                res.status(200).json(savedPost);
              })
              .catch((err) => res.status(500).json(err.message));
          });
        }
      });
    });
  }

  public static async handleFetchFollowPosts(req: Request, res: Response) {
    const token = req.header("token");
    UserMethods.getUserFromToken(token, User).then(async (user) => {
      const dates: number[] = [];
      const posts = user.posts;
      const date = new Date(req.body.date);
      for (let i = 0; i < req.body.duration; i++) {
        const formatted = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`;
        dates.push(parseInt(formatted, 10));
        date.setDate(date.getDate() - 1);
        const newDate = parseInt(formatted, 10);
        if (!(newDate in posts)) {
          posts[newDate] = [];
        }
      }
      for (const i of user.following) {
        const username = i;
        await User.findOne({ username })
          .then((data) => {
            for (const d of dates) {
              if (data) {
                if (data.posts) {
                  const userposts = data.posts[d];
                  if (userposts) {
                    let temp = [...posts[d]];
                    temp = [...temp, ...userposts];
                    posts[d] = [...temp];
                  }
                }
              }
            }
          })
          .catch((err) => console.log("Cant find the user."));
      }
      for (const [key, val] of Object.entries(posts)) {
        const promises = val.map(
          async (x) => await Post.findById({ _id: x }).then((data) => data)
        );
        await Promise.all(promises).then(async (x) => {
          posts[key] = x;
        });
      }
      res.status(200).json(posts);
    });
  }
}

postRouter.post(
  "/create",
  uploadMedia.single("file"),
  validateFile,
  postValidator("token"),
  postValidator("create"),
  PostActions.handleCreatePost
);
postRouter.post(
  "/edit",
  postValidator("token"),
  postValidator("edit"),
  PostActions.handleEditPost
);
postRouter.post("/fetchFollowPosts", PostActions.handleFetchFollowPosts);
