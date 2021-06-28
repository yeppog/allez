const Route = require("../models/Route");
const ObjectId = require("mongodb").ObjectID;
const User = require("../models/User").User;
const Post = require("../models/Post");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/**
 * Adds the post slug of a given post to a user's taggedPost array.
 * @param {Post} post Mongoose post document.
 * @param {string} username Username of user
 */
async function updateUserTag(post, username, document) {
  return new Promise((resolve, reject) => {
    document.findOne({ username: username }).then((doc) => {
      const tags = { ...doc.taggedPost };
      const date = `${post.createdAt.getFullYear()}${post.createdAt.getMonth()}${post.createdAt.getDate()}`;
      if (date in tags) {
        tags[date] = [...tags[date], post.slug];
      } else {
        tags[date] = [post.slug];
      }
      doc.taggedPost = tags;
      doc
        .save()
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  });
}

/**
 * Adds the post to a user's post array.
 * @param {Post} post Mongoose post document.
 * @param {User} user Mongoose user document to add the post slug to the user array.
 */
function updateUserPosts(post, user) {
  user.postCount = user.postCount + 1;
  // format date to for query
  const date = `${post.createdAt.getFullYear()}${post.createdAt.getMonth()}${post.createdAt.getDate()}`;
  // only concatenate to the array if the slug id doesnt exist
  const posts = { ...user.posts };
  const datePosts = posts[date];
  if (datePosts) {
    if (!datePosts.includes(post.id)) {
      posts[date] = [...posts[date], post.id];
      user.posts = { ...posts };
    }
  } else {
    posts[date] = [post.id];
    user.posts = { ...posts };
  }
}

async function createUser(document) {
  return new Promise((resolve, reject) => {
    bcrypt
      .genSalt()
      .then((salt) => {
        bcrypt.hash(document.password, salt, (err, hash) => {
          if (err) {
            reject(err);
          }
          document.password = hash;
          document
            .save()
            .then(async (gym) => {
              const token = jwt.sign({ id: gym.id }, process.env.JWT_SECRET);
              // sends token to the registered email for confirmation;
              // await transporter.sendMail(
              //   {
              //     from: '"Allez" <reset@allez.com>',
              //     to: `${gym.email}`,
              //     subject: "Please confirm your account",
              //     text: `Click here to confirm your account.`,
              //     html: `Click <a href = "${process.env.DOMAIN}/confirm/token=${token}">here</a> to confirm your account.`,
              //   },
              //   (err, info) => {
              //     if (err) {
              //       reject(err)
              //     }
              //     resolve(info)
              //   }
              // );
              resolve({ token: token });
            })
            .catch((err) => reject(err));
        });
      })
      .catch((err) => reject(err));
  });
}

async function confirmUser(document, token) {
  return new Promise((resolve, reject) => {
    try {
      const id = jwt.verify(token, process.env.JWT_SECRET).id;
      document.findOne(new ObjectId(id)).then((doc) => {
        if (doc === null) {
          reject(new Error("User doesn't exist for this token"));
        } else if (doc.activated) {
          reject(new Error("Account already activated"));
        } else {
          doc.activated = true;
          doc
            .save()
            .then(() => resolve("Account successfully activated"))
            .catch((err) => reject(err));
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function fetchAllUsers(document) {
  return new Promise((resolve, reject) => {
    document
      .find({})
      .then((data) => {
        resolve(
          data.map((obj) => {
            return { name: obj.name, username: obj.username };
          })
        );
      })
      .catch((err) => reject(err));
  });
}

async function fetchPostFromArr(posts) {
  return new Promise(async (resolve, reject) => {
    for (const [key, value] of Object.entries(posts)) {
      console.log(key);
      console.log(value);
      if (Array.isArray(value)) {
        const promises = value.map(async (id) => {
          console.log(id);
          return await Post.findById(new ObjectId(id))
            .then((post) => post)
            .catch((err) => reject(err));
        });
        await Promise.all(promises)
          .then((mapped) => {
            posts[key] = [...mapped];
          })
          .catch((err) => reject(err));
      }
      resolve(posts);
    }
  });
}

async function fetchPostFromTagArr(posts) {
  return new Promise(async (resolve, reject) => {
    for (const [key, value] of Object.entries(posts)) {
      console.log(key);
      console.log(value);
      if (Array.isArray(value)) {
        const promises = value.map(async (id) => {
          console.log(id);
          return await Post.findOne({ slug: id })
            .then((post) => post)
            .catch((err) => reject(err));
        });
        await Promise.all(promises)
          .then((mapped) => {
            posts[key] = [...mapped];
          })
          .catch((err) => reject(err));
      }
      resolve(posts);
    }
  });
}

function handleCreateError(err, res) {
  if (err.name == "MongoError") {
    if (err) {
      res.status(403).json({ message: "Email is already taken" });
    } else if (err.keyValue.email) {
      res.status(403).json({ message: "Username is already taken" });
    }
    res.status(500).json(err);
  }
  res.status(500).json(err);
}

module.exports = {
  updateUserPosts: updateUserPosts,
  updateUserTag: updateUserTag,
  handleCreateError: handleCreateError,
  createUser: createUser,
  confirmUser: confirmUser,
  fetchAllUsers: fetchAllUsers,
  fetchPostFromArr: fetchPostFromArr,
  fetchPostFromTagArr: fetchPostFromTagArr,
};
