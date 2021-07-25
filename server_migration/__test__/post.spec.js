const User = require("../src/models/UserSchema");
const { app } = require("../src/index");
const mongoose = require("mongoose");
const supertest = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoServer = new MongoMemoryServer();
const request = supertest(app);
const multer = require("multer");
const Blob = require("node-blob");
const fs = require("fs");
const { ImageHandler } = require("../src/handlers/ImageHandler");

// mock file
function MockFile() {}

MockFile.prototype.create = function (name, size, mimeType) {
  name = name || "mock.txt";
  size = size || 1024;
  mimeType = mimeType || "plain/txt";

  function range(count) {
    var output = "";
    for (var i = 0; i < count; i++) {
      output += "a";
    }
    return output;
  }

  var blob = new Blob([range(size)], { type: mimeType });
  blob.lastModifiedDate = new Date();
  blob.name = name;

  return blob;
};

beforeAll(async () => {
  const uri = await (await mongoServer).getUri();
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
  await mongoose.connection.close();
  await mongoServer.stop();
  // await mongoServer.stop();
});

describe("Post creation test", () => {
  test("Create post request with a bad token", async () => {
    const taggedGym = "test, test1";
    const taggedUser = "test, test2";
    const taggedRoute = "test, test2";
    await request
      .post("/api/posts/create")
      .set("token", "bad_token")
      .field("body", "Body of the post")
      .field("tagggedGym", taggedGym)
      .field("taggedUser", taggedUser)
      .field("taggedRoute", taggedRoute)
      .then((data) => {
        expect(data.status).toBe(422);
        expect(data.error).toBeDefined();
        expect(data.body).toBe("No file provided!");
      });
  });

  test("Create post with a valid token, but no image", async () => {
    await request
      .post("/api/users/register")
      .send({
        username: "test2",
        name: "lol",
        email: "test2@gmail.com",
        password: "test1",
      })
      .then(async (data) => {
        expect(data.status).toBe(200);
        await request
          .get("/api/users/confirm")
          .set("token", data.body)
          .then(async (data2) => {
            expect(data2.status).toBe(200);
            await request
              .post("/api/users/login")
              .send({
                email: "test2@gmail.com",
                password: "test1",
              })
              .then(async (data3) => {
                expect(data3.status).toBe(200);
                expect(data3.body).toHaveProperty("token");

                const taggedGym = "test, test1";
                const taggedUser = "test, test2";
                const taggedRoute = "test, test2";
                await request
                  .post("/api/posts/create")
                  .set("token", data3.body.token)
                  .field("body", "Body of the post")
                  .field("tagggedGym", taggedGym)
                  .field("taggedUser", taggedUser)
                  .field("taggedRoute", taggedRoute)
                  .then((data) => {
                    expect(data.body).toBe("No file provided!");
                    expect(data.status).toBe(422);
                  });
              });
          });
      });
  });
  test("Create post with a valid token with image", async () => {
    await request
      .post("/api/users/register")
      .send({
        username: "test2",
        name: "lol",
        email: "test2@gmail.com",
        password: "test1",
      })
      .then(async (data) => {
        expect(data.status).toBe(200);
        await request
          .get("/api/users/confirm")
          .set("token", data.body)
          .then(async (data2) => {
            expect(data2.status).toBe(200);
            await request
              .post("/api/users/login")
              .send({
                email: "test2@gmail.com",
                password: "test1",
              })
              .then(async (data3) => {
                expect(data3.status).toBe(200);
                expect(data3.body).toHaveProperty("token");
                var img =
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0" +
                  "NAAAAKElEQVQ4jWNgYGD4Twzu6FhFFGYYNXDUwGFpIAk2E4dHDRw1cDgaCAASFOffhEIO" +
                  "3gAAAABJRU5ErkJggg==";
                // strip off the data: url prefix to get just the base64-encoded bytes
                var data = img.replace(/^data:image\/\w+;base64,/, "");
                var buf = Buffer.from(data, "base64");
                fs.writeFile("image.png", buf, (err) => err);
                const mock = new MockFile();
                const file = mock.create("pic.jpg", "1024x1024", "image/jpeg");
                const taggedGym = "test, test1";
                const taggedUser = "test, test2";
                const taggedRoute = "test, test2";
                await request
                  .post("/api/posts/create")
                  .set("token", data3.body.token)
                  .attach(
                    "file",
                    fs.readFileSync(`image.png`),
                    "tests/file.png"
                  )
                  .field("body", "Body of the post")
                  .field("tagggedGym", taggedGym)
                  .field("taggedUser", taggedUser)
                  .field("taggedRoute", taggedRoute)
                  .then((data) => {
                    expect(data.status).toBe(500);
                  });
              });
          });
      });
  });
});

