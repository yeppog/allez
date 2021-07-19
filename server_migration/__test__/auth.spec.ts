import { Express } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "../src/models/UserSchema";
import app from "../src/index";
import mongoose from "mongoose";
import supertest from "supertest";

const request = supertest(app);
const mongoServer = new MongoMemoryServer();

beforeAll(async () => {
  const uri = await mongoServer.getUri();
  console.log(uri);

  await mongoose.disconnect().then(async () => await mongoose.connect(uri));
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("test", () => {
  it("first test", async () => {
    expect(true).toBeTruthy();
    // const response = await request.post("/api/users/register").send({
    //   name: "test",
    //   username: "test",
    //   email: "test@gmail.com",
    //   password: "test",
    // });
    // expect(response.status).toBe(401);
    // expect(response.body).toHaveProperty("token");
  });
});
