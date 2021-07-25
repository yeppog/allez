const User = require("../src/models/UserSchema");
const { app } = require("../src/index");
const mongoose = require("mongoose");
const supertest = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoServer = new MongoMemoryServer();
const request = supertest(app);
const multer = require("multer");
const { Route } = require("../src/models/RouteSchema");
const { RouteHandler } = require("../src/handlers/RouteHandler");

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
    // await mongoServer.stop();
  // await mongoServer.stop();
});

// describe("Test route handler", () => {
// //   it("Add slug to a new route", async () => {
// //     const date = new Date();
// //     const dateString = date.toISOString();
// //     const expected = {};
// //     expected[dateString] = "test_slug";
// //     const route = new Route({
// //       gym: "test",
// //       grade: "v1",
// //       color: "orange",
// //       name: "cool orange",
// //     })
// //       .save()
// //       .then((data) => {
// //         RouteHandler.updateRouteTag("cool orange", "test_slug", date)
// //           .then((tagged) => {
// //             expect(tagged).toBeDefined();
// //           })
// //           .catch((err) => expect(err).toBeUndefined());
// //       });
// //   });
// //   it("Invalid route test", async () => {
// //     RouteHandler.updateRouteTag("bad name", "test", new Date())
// //       .catch((err) => {
// //         expect(err.message).toBeDefined();
// //         expect(err.message).toBe("Tagged route not found");
// //       });
// //   });
// //   it("Invalid route test", async () => {
// //     RouteHandler.updateRouteTag("bad name", "test", new Date()).catch((err) => {
// //       expect(err.message).toBeDefined();
// //       expect(err.message).toBe("Tagged route not found");
// //     });
// //   });
// });


describe("??" ,() => {
    test("???", () => {
        expect(true).toBeTruthy();
    })
})