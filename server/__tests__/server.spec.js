const User = require("../models/User");
const app = require("../index");
const mongoose = require("mongoose");
const supertest = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoServer = new MongoMemoryServer();
const request = supertest(app);

beforeEach(async () => {
  const uri = await mongoServer.getUri();
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateNewIndex: true,
  };
  // ensure we close the original db connection
  await mongoose.connection
    .close()
    .then(async () => await mongoose.connect(uri, mongooseOpts));
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
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
    expect(response.body).toHaveProperty("token");
  });

  it("missing email should give a http response of 500", async () => {
    const response = await request.post("/api/users/register").send({
      name: "test",
      username: "test",
      password: "test",
    });
    expect(response.status).toBe(500);
    expect(response.body.name).toBe("ValidationError");
    expect(response.body.errors.email.name).toBeDefined();
  });

  /**
   * MongoDB currently handles unique indexes in an odd manner. syncIndexes() helps to ensure
   * that the unique indexes are synced up as the process may be asynchronous, currently this isn't
   * a problem in real life when making post requests, hence syncIndexes is temporarily
   * omitted from Users.js in view of performance
   *
   *

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
describe("Testing Confirm and Login", () => {
  it("", async () => {
    await request
      .post("/api/users/register")
      .send({
        username: "test2",
        email: "test2",
        password: "test1",
      })
      .then(async (data) => {
        expect(data.body).toHaveProperty("token");
        expect(data.status).toBe(200);
        await request
          .get("/api/users/confirm")
          .set("token", data.body.token)
          .then(async (data2) => {
            expect(data2.status).toBe(200);
            await request
              .post("/api/users/login")
              .send({
                email: "test2",
                password: "test1",
              })
              .then((data3) => {
                expect(data3.status).toBe(200);
              });
          });
      });
  });
});
