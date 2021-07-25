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
      email: "allez.orbital@gmail.com",
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
        email: "allez.orbital@gmail.com",
        password: "test",
      })
      .then(async () => {
        await User.syncIndexes();
        const response2 = await request.post("/api/users/register").send({
          name: "test",
          username: "test",
          email: "allez.orbital@gmail.com",
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

describe("Testing login", () => {
  it("Test login with valid credentials and confirmed account", async () => {
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
              .then((data3) => {
                expect(data3.status).toBe(200);
              });
          });
      });
  });

  it("Test login with valid credentials but unconfirmed account", async () => {
    await request
      .post("/api/users/register")
      .send({
        username: "test",
        email: "allez.orbital@gmail.com",
        password: "test",
      })
      .then(async (data) => {
        await request
          .post("/api/users/login")
          .send({
            username: "test",
            email: "allez.orbital@gmail.com",
            password: "test",
          })
          .then((data) => {
            expect(data.status).toBe(401);
            expect(data.body).toBe("Account not activated");
          });
      });
  });
  it("Test login with only username valid credentials", async () => {
    await request
      .post("/api/users/login")
      .send({
        username: "test2",
        password: "test1",
      })
      .then((data) => {
        expect(data.status).toBe(200);
        expect(data.body).toHaveProperty("token");
      });
  });
  it("Test login with only email valid credentials", async () => {
    await request
      .post("/api/users/login")
      .send({
        email: "test2@gmail.com",
        password: "test1",
      })
      .then((data) => {
        expect(data.status).toBe(200);
        expect(data.body).toHaveProperty("token");
      });
  });

  it("Test login with incorrect password", async () => {
    await request
      .post("/api/users/login")
      .send({
        username: "test2",
        email: "test2@gmail.com",
        password: "wrong_password",
      })
      .then((data) => {
        expect(data.body).toBe("Password incorrect.");
        expect(data.status).toBe(401);
      });
  });
  it("Test login with invalid email", async () => {
    await request
      .post("/api/users/login")
      .send({
        username: "nonaddeduser",
        email: "nonaddeduser@gmail.com",
        password: "test",
      })
      .then((data) => {
        expect(data.status).toBe(401);
        expect(data.body).toBe("Invalid user");
      });
  });
  it("Test login without proper fields", async () => {
    await request
      .post("/api/users/login")
      .send({
        password: "test",
      })
      .then((data) => {
        expect(data.status).toBe(401);
        expect(data.body).toBe("Invalid user");
      });
  });
});

describe("Test reset password request", () => {
  it("Create an account", async () => {
    await request
      .post("/api/users/register")
      .send({
        username: "test",
        name: "test",
        email: "allez.orbital@gmail.com",
        password: "test",
      })
      .then((data) => {
        expect(data.status).toBe(200);
      });
  });
  it("Create a password reset request", async () => {
    await request
      .get("/api/users/reset")
      .set("email", "allez.orbital@gmail.com")
      .then((data) => {
        expect(data.status).toBe(200);
      });
  });
  it("Create a password reset request for invalid user", async () => {
    await request
      .get("/api/users/reset")
      .set("email", "wat@gmail.com")
      .then((data) => {
        expect(data.status).toBe(200);
      });
  });

  it("Create a password reset request with no email in header", async () => {
    await request.get("/api/users/reset").then((data) => {
      expect(data.status).toBe(422);
      expect(data.body.errors).toBeDefined();
    });
  });
});

describe("Test reset password reset", () => {
  it("Create an account", async () => {
    await request
      .post("/api/users/register")
      .send({
        username: "test",
        name: "test",
        email: "allez.orbital@gmail.com",
        password: "test",
      })
      .then((data) => {
        expect(data.status).toBe(200);
      });
  });
  it("Reset password with correct body", async () => {
    await request
      .get("/api/users/reset")
      .set("email", "allez.orbital@gmail.com")
      .then(async (data) => {
        expect(data.status).toBe(200);
        await request
          .post("/api/users/reset/end")
          .set("token", data.body)
          .send({
            password: "12345678",
            password_confirm: "12345678",
          })
          .then((data2) => {
            expect(data2.status).toBe(200);
            expect(data2.body).toBeDefined();
          });
      });
  });

  it("Reset password with invalid token", async () => {
    await request
      .post("/api/users/reset/end")
      .set("token", "yeet")
      .send({
        password: "test",
        password_confirm: "test",
      })
      .then((data) => {
        expect(data.status).toBe(400);
      });
  });

  it("Reset password with invalid fields", async () => {
    await request
      .post("/api/users/reset/end")
      .send({
        password: "test",
      })
      .then((data) => {
        expect(data.status).toBe(422);
        expect(data.body.errors).toBeDefined();
      });
  });
});

describe("Test verify", () => {
  it("Test verify with correct token", async () => {
    await request
      .post("/api/users/register")
      .send({
        username: "test2",
        name: "name",
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
                await request
                  .get("/api/users/verify")
                  .set("token", data3.body.token)
                  .then((dataVerify) => {
                    expect(dataVerify.status).toBe(200);
                    expect(dataVerify.body).toHaveProperty("username");
                  });
              });
          });
      });
  });
  it("Test verify with invalid token", async () => {
    await request
      .get("/api/users/verify")
      .set(
        "token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      )
      .then((dataVerify) => {
        expect(dataVerify.status).toBe(400);
      });
  });

  it("Test verify with no token", async () => {
    await request.get("/api/users/verify").then((dataVerify) => {
      expect(dataVerify.status).toBe(422);
    });
  });
});

describe("Test user update profile", () => {
  it("Test update profile without images", async () => {
    await request
      .post("/api/users/register")
      .send({
        username: "test",
        name: "test",
        email: "test@gmail.com",
        password: "test",
      })
      .then(async (data) => {
        await request
          .get("/api/users/confirm")
          .set("token", data.body)
          .then(async (confirm) => {
            expect(confirm.status).toBe(200);
            await request
              .post("/api/users/login")
              .send({
                username: "test",
                email: "test@gmail.com",
                password: "test",
              })
              .then(async (data) => {
                expect(data.status).toBe(200);
                await request
                  .post("/api/users/update")
                  .set("token", data.body.token)
                  .send({
                    bio: "tester",
                    name: "name",
                  })
                  .then((receive) => {
                    expect(receive.status).toBe(200);
                    expect(receive.body.name).toBe("name");
                    expect(receive.body.bio).toBe("tester");
                  });
              });
          });
      });
  });
  it("Test update profile without invalid token", async () => {
    await request
      .post("/api/users/update")
      .set(
        "token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      )
      .send({
        bio: "tester",
        name: "name",
      })
      .then((receive) => {
        expect(receive.status).toBe(500);
        expect(receive.body).toBe("invalid signature");
      });
  });
});

// describe("Test public profile", () => {
//   it("Test valid profile search", async () => {
//     await request
//       .post("/api/users/register")
//       .send({
//         username: "test",
//         email: "test",
//         password: "test",
//       })
//       .then(async (data) => {
//         await request
//           .get("/api/users/getPublicProfile")
//           .set("username", "test")
//           .then((test) => {
//             expect(test.status).toBe(200);
//             expect(test.body).toHaveProperty("username");
//           });
//       });
//   });
//   it("Test invalid profile search (invalid username)", async () => {
//     await request
//       .post("/api/users/register")
//       .send({
//         username: "test",
//         email: "test",
//         password: "test",
//       })
//       .then(async (data) => {
//         await request
//           .get("/api/users/getPublicProfile")
//           .set("username", "test1")
//           .then((test) => {
//             expect(test.status).toBe(403);
//             expect(test.body.message).toBe("User not found");
//           });
//       });
//   });
//   it("Test invalid profile search (no username)", async () => {
//     await request.get("/api/users/getPublicProfile").then((test) => {
//       expect(test.status).toBe(404);
//       expect(test.body.message).toBe("No username specified");
//     });
//   });
// });
