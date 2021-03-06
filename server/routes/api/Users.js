const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const detect = require("./routedetect/RouteDetection");
const Post = require("./../../models/Post");
const { handleConfirmError } = require("../../handlers/Error");

/** Used to query by ObjectId */
const ObjectId = require("mongodb").ObjectID;

/** Automailer */
const nodemailer = require("nodemailer");

/** SMTP configuration. TODO: Store real credentials in env */
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    // spoof credentials from ethereal
    // can login from here to access the emails https://ethereal.email/
    user: "malinda66@ethereal.email",
    pass: "mg36XzUWRXTvGN1GGG",
  },
});

// Validate inputs

// User model
const User = require("../../models/User").User;
const Image = require("../../models/Images");

// GridFS Uploads
const uploadAvatar = require("./../../gridfs").uploadAvatar;
const uploadMedia = require("./../../gridfs").uploadMedia;
const Video = require("../../models/Video");
const {
  createUser,
  handleCreateError,
  confirmUser,
  fetchAllUsers,
} = require("../../handlers/User");

/**
 * Handles the POST request of creating a new account.
 *
 * Firstly checks if a user account of given email already exists. Then hashes the password and finally sends a POST request through save()
 *
 *
 * @param {object} req Takes in a request with a body that should contain a Username, Email and Password
 * @param {object} res Server response
 */
async function handleRegister(req, res) {
  const newUser = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    activated: false,
  });
  createUser(newUser)
    .then((data) => res.status(200).json(data))
    .catch((err) => handleCreateError(err, res));
}

/**
 * Asynchronus function that validates a user to login. Compares the provided credentials to the database credentials.
 * Allows username or email login
 *
 * @param {object} req The credentials to be validated.
 * @param {object} res The response from the server
 * @returns A specified response for the different HTTP status to be issued. Returns a JWT token to be stored by the client.
 * HTTP 400: Incomplete credentials
 * HTTP 401: Invalid credentials
 * HTTP 500: Any other error
 * HTTP 200: OK
 */

async function handleLogin(req, res) {
  try {
    const { email, username, password } = req.body;
    if ((!email && !username) || !password) {
      return res
        .status(400)
        .json({ message: "Not all fields have been entered" });
    } else {
      let user;
      // check if user is logging in with username or with email
      if (!email) {
        user = await User.findOne({ username: username });
      } else {
        user = await User.findOne({ email: email });
      }
      if (!user) {
        return res.status(401).json({ message: "Invalid user" });
      } else if (!user.activated) {
        return res.status(403).json({ message: "Account not activated" });
      }
      // use bcrypt to compare crypto hash from db and given password
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      // use jwt to sign our user ID to be decoded later, using the key from the .env file
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      // returns status 200 with the token and the user information
      return res.status(200).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

/**
 * Checks the JWT token given in the header to see if it is a valid JWT token and if it has expired.
 * If the JWT token is valid, return essential user credentials to the client.
 *
 * @param {object} req Contains "auth-token" in the header with the JWT token
 * @param {object} res Returns a JSON with the user credentials if valid, else server response
 * @returns Returns HTTP code with a server response
 * HTTP 400: No token specified
 * HTTP 401: Token is not valid
 * HTTP 500: Any other error
 */

async function handleVerify(req, res) {
  const token = req.header("token");
  if (!token) {
    return res.status(400).json({ message: "No token" });
  } else {
    // decoding the token returns us our objectId that we encoded
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      const userId = jwt.decode(token, process.env.JWT_SECRET).id;
      let user;
      User.findOne(new ObjectId(userId))
        .then((user) => {
          // delete user[password];
          res.status(200).json(user);
        })
        .catch((err) => res.status(403).json(err));
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(403).json(err);
      }
      // return error if we somehow encounter an error finding the user
      return res.status(500).json(err);
    }
  }
}

/**
 * Generates a new password reset token using JWT that holds the user ID in the payload.
 *
 * @param {object} req The HTTP request, containing the user's email account
 * @param {object} res The HTTP response with the token
 * @returns A HTTP response with the token generated from the user's email address.
 */

async function handleResetRequest(req, res) {
  const email = req.body.email;
  // Ensure the email is specified
  if (!email) {
    return res.status(400).json({ message: "Email not specified" });
  } else {
    try {
      // ensure we can find the user
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(401).json({ message: "Invalid user" });
      } else {
        const secret = "password_reset - " + process.env.JWT_TOKEN;
        // currently set the token to expire in 10 minutes
        const token = jwt.sign({ id: user._id }, secret, {
          expiresIn: 600,
        });
        // auto email sender to send recovery link to reset password.
        // await transporter.sendMail(
        //   {
        //     from: '"Allez" <reset@allez.com>',
        //     to: `${req.body.email}`,
        //     subject: "You requested for a password reset",
        //     text: `Click here to reset your account.`,
        //     html: `Click <a href = "${process.env.DOMAIN}/recover/token=${token}">here</a> to confirm your account.`,
        //   },
        //   (err, info) => {
        //     console.log(err);
        //     console.log(info);
        //   }
        // );
        return res.status(200).json({ token: token });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

/**
 * End point for the reset password request. Expects a token, an id and a password to be passed in the request.
 * Token will be verified to check if the token matches the user Id passed back, and its expiry. If all are valid, hash the new password
 * and update the database for the password of that user.
 *
 * @param {*} req The HTTP request, containing the token, id and a new password.
 * @param {*} res THE HTTP response with the result of the request.
 * @returns A HTTP response with the response message.
 */

async function handleReset(req, res) {
  const token = req.body.token;
  if (!token) {
    return res.status(400).json({ message: "No token" });
  } else {
    try {
      const secret = "password_reset - " + process.env.JWT_TOKEN;
      // verify to ensure token has not expired
      jwt.verify(req.body.token, secret);
      // decode to ensure the token matches the userId
      const id = jwt.decode(req.body.token, secret).id;
      const user = await User.findOne(new ObjectId(id));
      let password = "";
      if (!user) {
        return res.status(400).json({ message: "Invalid user ID" });
      } else {
        // generate password hash for the new password
        bcrypt.genSalt().then((salt) =>
          bcrypt.hash(req.body.password, salt, async (err, hash) => {
            if (err) {
              return res.status(500).json({ message: "Password error" });
            } else {
              await User.findByIdAndUpdate(
                new ObjectId(id),
                {
                  password: hash,
                },
                { useFindAndModify: false }
              )
                .then(() => {
                  return res
                    .status(200)
                    .json({ message: "Password successfully updated" });
                })
                .catch((err) => {
                  return res.status(500).json(err);
                });
            }
          })
        );
        // update the password field for this user
      }
    } catch (err) {
      // catch the error thrown if the token has expired.
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token has expired" });
      }
      // console log for now. TODO: implement error handling
      return res.status(500).json(err);
    }
  }
}

/**
 * Hanldes account activation. Sets the activated param in the database to true to allow the account to be used.
 *
 * @param {object} req HTTP request that holds the token in the header as 'token'
 * @param {object} res HTTP response for the request
 * @return Returns the HTTP status and message
 */

async function handleConfirm(req, res) {
  if (!req.header("token")) {
    return res.status(400).json({ message: "Missing token" });
  } else {
    confirmUser(User, req.header("token"))
      .then((data) => res.status(200).json({ message: data }))
      .catch((err) => handleConfirmError(res, err));
  }
}

/**
 * Handles updating of user parameters and supports uploading of images
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function handleUpdateProfile(req, res, next) {
  let id;
  try {
    jwt.verify(req.body.token, process.env.JWT_SECRET);
    id = jwt.decode(req.body.token, process.env.JWT_SECRET).id;
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: "Missing token or invalid token",
      });
    } else if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Unauthorised. Token expired",
      });
    } else {
      return res.status(500).json({ message: err });
    }
  }

  // retrieve the user if verification checks out
  try {
    const user = await User.findOne(new ObjectId(id));
    if (!user) {
      return res.status(401).json({
        message: "User not found. Invalid",
      });
    }
    if (req.file) {
      const caption = `${user.id}_avatar`;
      const upload = require("./Image").uploadImage;
      let imageURL;
      await upload(
        caption,
        req.file.filename,
        req.file.id,
        "/api/images/avatar/"
      )
        .then((data) => (imageURL = data))
        .catch((err) => res.status(403).json(err));

      // check if the
      user.avatarPath = imageURL;
    }

    // assign other fields to update, check if they exist first
    user.name = req.body.name == null ? user.name : req.body.name;
    user.bio = req.body.bio == null ? user.bio : req.body.bio;
    user.posts = req.body.posts == null ? user.posts : req.body.posts;
    user.followCount =
      req.body.followCount == null ? user.followCount : req.body.followCount;

    user
      .save()
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((err) => {
        return res.status(400).json(err);
      });
  } catch (err) {
    return res.status(500).json(err);
  }
}

async function handleGetPublicProfile(req, res) {
  if (!req.header("username")) {
    return res.status(400).json({ message: "No username specified" });
  } else {
    const username = req.header("username");
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }
    return res.status(200).json({
      username: user.username,
      email: user.email,
      avatarPath: user.avatarPath,
      name: user.name,
      bio: user.bio,
      followers: user.followers,
      followCount: user.followCount,
      following: user.following,
      followingCount: user.followingCount,
      posts: user.posts,
      postCount: user.postCount,
    });
  }
}

async function handleFollow(req, res) {
  if (!req.header("token") || !req.header("username")) {
    res.status(400).json({ message: "Bad request, missing token or username" });
  } else {
    try {
      const id = jwt.verify(req.header(token), process.env.JWT_SECRET).id;
      User.findById(new ObjectId(id)).then((user) => {
        const follow = { ...user.followers };
        if (username in follow) {
          delete follow[username];
          user.followCount = user.followCount - 1;
        } else {
          follow[username] = new Date();
          user.followCount = user.followCount + 1;
        }
        user.followers = follow;
        user
          .save()
          .then((data) =>
            res.status(200).json({
              followers: user.followers,
              followCount: user.followCount,
            })
          )
          .catch((err) => res.status(403).message(err));
      });
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        res.status(403).json({ message: "Token has expired" });
      } else if (err instanceof jwt.JsonWebTokenError) {
        res.status(403).json({ message: "Invalid JWT" });
      } else {
        throw err;
      }
    }
  }
}

/**
 * Adds a follow relation. User will "follow" the target. User following array will append target.
 * Target follower array will append the user.
 * @param {Request} req The HTTP request containing the ObjectID of a user and target in the header.
 * @param {Response} res The HTTP Response of the request.
 */
async function addFollowRelation(req, res) {
  if (!req.header("user") || !req.header("target")) {
    res.status(404).json({ message: "Missing user or target user to follow." });
  } else {
    User.findOne({ username: req.header("user") }).then((user) => {
      User.findOne({ username: req.header("target") }).then((target) => {
        const userFollowing = [...user.following];
        const targetFollowers = [...target.followers];
        if (!userFollowing.includes(target.username)) {
          userFollowing.push(target.username);
          user.followingCount = user.followingCount + 1;
        }
        if (!targetFollowers.includes(user.username)) {
          targetFollowers.push(user.username);
          target.followCount = target.followCount + 1;
        }
        user.following = userFollowing;
        target.followers = targetFollowers;

        target
          .save()
          .then(() =>
            user
              .save()
              .then((data) => res.status(200).json(data))
              .catch((err) =>
                res.status(400).json({ message: "Couldn't save the user" })
              )
          )
          .catch((err) =>
            res.status(400).json({ message: "Couldn't save the target." })
          );
      });
    });
  }
}

/**
 * Removes a follow relation from a user to a target user. Updates the follow count if the follow relation exists.
 * @param {Request} req The HTTP request that contains a user and target in the header.
 * @param {Response} res The HTTP respose to output to.
 */

async function removeFollowRelation(req, res) {
  if (!req.header("user") || !req.header("target")) {
    res.status(404).json({ message: "Missing user or target user to follow." });
  } else {
    User.findOne({ username: req.header("user") }).then((user) => {
      User.findOne({ username: req.header("target") }).then((target) => {
        var userFollowing = [...user.following];
        var targetFollowers = [...target.followers];
        userFollowing = userFollowing.filter((x) => {
          if (x == target.username) {
            user.followingCount = user.followCount - 1;
            return false;
          }
          return true;
        });
        targetFollowers = targetFollowers.filter((x) => {
          if (x == user.username) {
            target.followCount = target.followCount - 1;
          }
          return true;
        });
        user.following = userFollowing;
        target.followers = targetFollowers;

        target
          .save()
          .then(() =>
            user
              .save()
              .then((data) => res.status(200).json(data))
              .catch((err) =>
                res.status(400).json({ message: "Couldn't save the user" })
              )
          )
          .catch((err) =>
            res.status(400).json({ message: "Couldn't save the target." })
          );
      });
    });
  }
}

async function handleFetchAll(req, res) {
  fetchAllUsers(User)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(404).json(err.message));
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

router.post("/register", handleRegister);

/** Provides the route for the API at ./login using the handleLogin function */
router.post("/login", handleLogin);

/** Provides the route for the API at ./check, verifies the JWT token for relogins */
router.get("/verify", handleVerify);

/** Provides the route for the API at ./reset, creates a JWT token for a unique reset link */
router.post("/reset", handleResetRequest);

/** Provides the route for the API at ./reset/end, validates a JWT and authorises a password reset */
router.post("/reset/end", handleReset);

/** Provides the route for the API at ./confirm, activates a user account. */
router.get("/confirm", handleConfirm);

/** Provides the route for the API at ./updaetProfile to update a user's profile */
router
  .route("/updateProfile")
  .post(uploadAvatar.single("file"), handleUpdateProfile);

/** Provides the route for the API at ./getPublicProfile to retrieve public user details */
router.get("/getPublicProfile", handleGetPublicProfile);

router.get("/detect", detect);

router.post("/handleFollow", handleFollow);

router.get("/addFollow", addFollowRelation);

router.get("/removeFollow", removeFollowRelation);

router.get("/users", handleFetchAll);

module.exports = router;
