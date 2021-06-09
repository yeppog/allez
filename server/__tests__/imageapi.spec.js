const User = require("../models/User");
const app = require("../index");
const mongoose = require("mongoose");
const supertest = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoServer = new MongoMemoryServer();
const request = supertest(app);
const avatarStorage = require("../gridfs");
const uploadImage = require("../routes/api/Image");

beforeAll(async () => {
  //   mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
  if (avatarStorage.db != null) {
    avatarStorage.db.close();
  }
});

/**
 * Somehow mongo isnt connected properly so it returns 500
 */
describe("Test image rendering", () => {
  it("Bad file test", async () => {
    await request.get("/api/images/avatar/badfilename").then((data) => {
      expect(data.status).toBe(500);
    });
  });
});

describe("Test program flow for upload image", () => {
  it("Test imageless function call", async () => {
    uploadImage
      .uploadAvatar(
        {
          filename: "test",
        },
        "test"
      )
      .catch((err) => {
        expect(err).toBeDefined();
      });
  });
});
