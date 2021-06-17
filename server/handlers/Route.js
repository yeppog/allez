const Route = require("../models/Route");
const ObjectId = require("mongodb").ObjectID;

/**
 * Adds the tag relation on the route to the target object.
 * @param {String} route ObjectID of the route to be queried
 * @param {String} target ObjectID of the target to be added
 */
async function addPostTagRelation(route, target) {
  return new Promise((resolve, reject) => {
    if (!route || !target) {
      reject("Missing route or target parameters.");
    } else {
      Route.findOne(new ObjectId(route))
        .then((route) => {
          const taggedPosts = { ...route.taggedPosts };

          taggedPosts[target.createdAt] = [
            ...taggedPosts[target.createdAt],
            target._id,
          ];
          route.taggedPosts = taggedPosts;

          route
            .save()
            .then((data) => resolve(data))
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    }
  });
}

/**
 * Removes the tag relation on the route of the target.
 * @param {String} route ObjectID of the route to be queried
 * @param {String} target ObjectID of the target to be removed.
 */
async function removePostTagRelation(route, target) {
  return new Pormise((resolve, reject) => {
    if (!route || !target) {
      reject("Missing route or target parameters");
    } else {
      Route.findOne(new ObjectId(route))
        .then((route) => {
          const taggedPosts = { ...route.taggedPosts };
          taggedPosts[target.createdAt] = [
            ...taggedPosts[target.createdAt],
          ].filter((x) => x != target._id);
          route.taggedPosts = taggedPosts;
          route
            .save()
            .then((data) => resolve(data))
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    }
  });
}

module.exports = {
  addPostTagRelation: addPostTagRelation,
  removePostTagRelation: removePostTagRelation,
};
