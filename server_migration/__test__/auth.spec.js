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

describe("yeet", () => {
  test("yeet2", () => {
    expect(true).toBeTruthy();
  });
});

describe("Testing /api/users/register endpoint", () => {
  it("correct fields should give the right response and data", async () => {
    const response = await request.post("/api/users/register").send({
      name: "test",
      username: "test",
      email: "test@gmail.com",
      password: "test",
    });
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it("missing email should give a http response of 422", async () => {
    const response = await request.post("/api/users/register").send({
      name: "test",
      username: "test",
      password: "test",
    });
    expect(response.status).toBe(422);
    expect(response.body.errors).toBeDefined();
  });

  /**
   * MongoDB currently handles unique indexes in an odd manner. syncIndexes() helps to ensure
   * that the unique indexes are synced up as the process may be asynchronous, currently this isn't
   * a problem in real life when making post requests, hence syncIndexes is temporarily
   * omitted from Users.js in view of performance
   */
  it("duplicate usernames should throw an error", async () => {
    const response1 = await request
      .post("/api/users/register")
      .send({
        name: "test",
        username: "test",
        email: "test@gmail.com",
        password: "test",
      })
      .then(async () => {
        await User.syncIndexes();
        const response2 = await request.post("/api/users/register").send({
          name: "test",
          username: "test",
          email: "test@gmail.com",
          password: "test",
        });
      })

      .catch((err) => expect(err).toBeDefined());
  });
});

describe("Testing Confirm ", () => {
  it("Test confirm with valid token", async () => {
    await request
      .post("/api/users/register")
      .send({
        username: "test2",
        name: "wat",
        email: "test2@gmail.com",
        password: "test1",
      })
      .then(async (data) => {
        expect(data.status).toBe(200);
        await request
          .get("/api/users/confirm")
          .set("token", data.body)
          .then(async (dataConfirm) => {
            expect(dataConfirm.status).toBe(200);
          });
      });
  });
  it("Test confirm with valid token but activated account", async () => {
    await request
      .post("/api/users/register")
      .send({
        username: "test2",
        name: "wat",
        email: "test2@gmail.com",
        password: "test1",
      })
      .then(async (data) => {
        expect(data.status).toBe(200);
        await request
          .get("/api/users/confirm")
          .set("token", data.body)
          .then(async (dataConfirm) => {
            expect(dataConfirm.status).toBe(200);
            await request
              .get("/api/users/confirm")
              .set("token", data.body)
              .then((dataConfirm2) => {
                expect(dataConfirm2.status).toBe(500);
                expect(dataConfirm2.body).toBe("User already activated.");
              });
          });
      });
  });

  it("Test confirm with invalid token", async () => {
    await request
      .get("/api/users/confirm")
      .set(
        "token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      )
      .then((data) => {
        expect(data.status).toBe(400);
        expect(data.body).toBe("invalid signature");
      });
  });
  it("Test confirm with empty token", async () => {
    await request.get("/api/users/confirm").then((data) => {
      expect(data.status).toBe(422);
      expect(data.body.errors).toBeDefined();
    });
  });
});
