const User = require("../models/User");
const Post = require("../models/Post");
const app = require("../index");
const mongoose = require("mongoose");
const supertest = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoServer = new MongoMemoryServer();
const request = supertest(app);
const multer = require("multer");
const avatarStorage = require("../gridfs");
const jwt = require("jsonwebtoken");

beforeAll(async () => {
  const uri = await mongoServer.getUri();
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  };
  // ensure we close the original db connection
  await mongoose
    .disconnect()
    .then(async () => await mongoose.connect(uri, mongooseOpts));
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  if (avatarStorage.db != null) {
    avatarStorage.db.close();
  }
});

describe("Test get post", () => {
  it("Create a fake post", async () => {
    const post = new Post({
      userId: "test",
      username: "test",
      body: "Test post",
      avatarPath: "avatar",
      mediaPath: "media",
      likes: 15,
      likedUsers: ["test", "test2"],
      comments: ["60d381a2874cfb0640249c52"],
      slug: "3490283fn3fndsjkfbdnsf7f23",
    });
    await post
      .save()
      .then((data) => expect(data).toBeDefined())
      .catch((err) => expect(err).toBeUndefined());
  });
  it("Test retrieve fake post", async () => {
    await request
      .get("/api/posts/getpost")
      .set("slug", "3490283fn3fndsjkfbdnsf7f23")
      .then((data) => expect(data.status).toBe(200));
  });
  it("Test no slug", async () => {
    await request
      .get("/api/posts/getpost")
      .then((data) => expect(data.status).toBe(400));
  });
  it("Test bad slug", async () => {
    await request
      .get("/api/posts/getpost")
      .set("slug", "3490283fn3fejf9rewfhwe98fh4")
      .then((data) => expect(data.status).toBe(403));
  });
});

describe("Test delete post", () => {
  const currentDate = new Date();
  it("Create a new post", async () => {
    const post = new Post({
      userId: "test",
      username: "test",
      body: "Test post",
      avatarPath: "avatar",
      mediaPath: "media",
      likes: 15,
      likedUsers: ["test", "test2"],
      comments: ["60d381a2874cfb0640249c52"],
      slug: "testpostslug",
      createdAt: currentDate,
    });
    await post
      .save()
      .then(async (data) => {
        const datefix = `${currentDate.getFullYear()}${currentDate.getMonth()}${currentDate.getDate()}`;

        const posts = {};
        posts[datefix] = [`${data._id}`];
        const user = new User({
          username: "test",
          email: "test@gmail.com",
          password: "test",
          activated: true,
          posts: { ...posts },
        });
        await user
          .save()
          // .then((data) => expect(data.posts).toBe(45))
          .catch((err) => expect(err).toBeUndefined());
      })
      .catch((err) => expect(err).toBeUndefined());
  });

  it("Test post deletion", async () => {
    // find user id to generate JWT token
    await User.findOne({ username: "test" })
      .then(async (data) => {
        const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET);
        await request
          .post("/api/posts/deletePost")
          .send({
            token: token,
            slug: "testpostslug",
          })
          .then(async (data) => {
            expect(data.status).toBe(200);
            expect(data.body.posts).toBeUndefined();
            expect(data).toBeDefined();
            await User.findOne({ username: "test" })
              .then((data) => {
                expect(data.posts).toStrictEqual({});
              })
              .catch((err) => expect(err).toBeUndefined());
          });
      })
      .catch((err) => expect(err).toBeUndefined());
  });

  it("Create a new post", async () => {
    const post = new Post({
      userId: "test1",
      username: "test1",
      body: "Test post2",
      avatarPath: "avatar",
      mediaPath: "media",
      likes: 15,
      likedUsers: ["test", "test2"],
      comments: ["60d381a2874cfb0640249c52"],
      slug: "newslug",
      createdAt: currentDate,
    });
    await post
      .save()
      .then(async (data) => {
        const datefix = `${currentDate.getFullYear()}${currentDate.getMonth()}${currentDate.getDate()}`;

        const posts = {};
        posts[datefix] = [`${data._id}`];
        const user = new User({
          username: "test1",
          email: "test1@gmail.com",
          password: "test1",
          activated: true,
          posts: { ...posts },
        });
        await user
          .save()
          // .then((data) => expect(data.posts).toBe(45))
          .catch((err) => expect(err).toBeUndefined());
      })
      .catch((err) => expect(err).toBeUndefined());
  });
  it("Test bad post slug", async () => {
    // find user id to generate JWT token
    await User.findOne({ username: "test1" })
      .then(async (data) => {
        const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET);
        await request
          .post("/api/posts/deletePost")
          .send({
            token: token,
            slug: "newslugg",
          })
          .then(async (data) => {
            expect(data.status).toBe(400);
            expect(data.body.message).toBe("Unable to find the post");
          });
      })
      .catch((err) => expect(err).toBeUndefined());
  });
  it("Test bad post slug", async () => {
    // find user id to generate JWT token
    await User.findOne({ username: "test1" })
      .then(async (data) => {
        const token = jwt.sign(
          { id: "60c528794fe8c006a8610bca" },
          process.env.JWT_SECRET
        );
        await request
          .post("/api/posts/deletePost")
          .send({
            token: token,
            slug: "newslug",
          })
          .then(async (data) => {
            expect(data.status).toBe(403);
            expect(data.body.message).toBe("Unable to find the user");
          });
      })
      .catch((err) => expect(err).toBeUndefined());
  });
});
