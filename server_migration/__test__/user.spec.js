const User = require("../src/models/UserSchema");
const { app } = require("../src/index");
const mongoose = require("mongoose");
const supertest = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoServer = new MongoMemoryServer();
const request = supertest(app);
const multer = require("multer");

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

// describe("Testing /api/users/register endpoint", () => {
//   it("correct fields should give the right response and data", async () => {
//     const response = await request.post("/api/users/register").send({
//       name: "test",
//       username: "test",
//       email: "allez.orbital@gmail.com",
//       password: "test",
//     });
//     expect(response.status).toBe(200);
//     expect(response.body).toBeDefined();
//   });
// });

describe("Fetch all users", () => {
  it("Fetches all users in the database", async () => {
    await request
      .post("/api/users/register")
      .send({
        name: "test",
        username: "test",
        email: "allez.orbital@gmail.com",
        password: "test",
      })
      .then(async (data) => {
        expect(data.status).toBe(200);
        expect(data.body).toBeDefined();
        await request.get("/api/users/users").then((users) => {
          expect(users.status).toBe(200);
        });
      });
  });
});
