const Route = require("../models/Route");
const ObjectId = require("mongodb").ObjectID;
const User = require("../models/User");
const Post = require("../models/Post");

/**
 * Adds the post slug of a given post to a user's taggedPost array.
 * @param {Post} post Mongoose post document.
 * @param {User} user Mongoose user document to add the tag to.
 */
function updateUserTag(post, user) {
  const tags = { ...user.taggedPost };
  const date = `${post.createdAt.getFullYear()}${post.createdAt.getMonth()}${post.createdAt.getDate()}`;
  if (date in tags) {
    tags[date] = [...tags[date], post.slug];
  } else {
    tags[date] = [post.slug];
  }
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

module.exports = {
  updateUserPosts: updateUserPosts,
  updateUserTag: updateUserTag,
};
