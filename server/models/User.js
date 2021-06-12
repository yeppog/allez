const mongoose = require("mongoose");

/**
 * Schema for the user model.
 */

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    dropDups: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    dropDrups: true,
  },
  password: {
    type: String,
    required: true,
  },
  activated: {
    type: Boolean,
  },
  name: {
    type: String,
  },
  bio: {
    type: String,
  },
  avatarPath: {
    type: String,
  },
  followCount: {
    type: Number,
    required: true,
    default: 0,
  },
  followers: {
    type: [],
    required: true,
    default: [""],
  },
  posts: {
    type: {},
    default: [""],
  },
  postCount: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("UserData", UserSchema);
module.exports = User;

// ASSUME post arr

/**
 * 1 post fr ea user => x requests to server
 * x posts => 5 followers => min threshold posts
 * 2nd last post fr ea user => 2x
 *
 *
 *
 * DATE : objectID
 * posts: {date : [objectID]}
 * 12/6 11/6 10/6 9/6
 *
 * 4 [] => 12/6 - 9/6
 * [] => 12/6 - 9/6 => user []
 *
 * users [] => sort(5days)
 *
 * hehehe => hehehe
 *          hehehehhaha
 *
 * hahehehe
 * h
 * afhdefg =>
 *
 * users : [5days sorted, 6-7, 8 - 9,  ] => keep sorting
 *
 *
 *
 */
