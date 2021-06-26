const User = require("../models/User").User;
const app = require("../index");
const mongoose = require("mongoose");
const supertest = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoServer = new MongoMemoryServer();
const request = supertest(app);
const multer = require("multer");
const avatarStorage = require("../gridfs");

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
        email: "test2",
        password: "test1",
      })
      .then(async (data) => {
        expect(data.body).toHaveProperty("token");
        expect(data.status).toBe(200);
        await request
          .get("/api/users/confirm")
          .set("token", data.body.token)
          .then(async (dataConfirm) => {
            expect(dataConfirm.status).toBe(200);
          });
      });
  });
  it("Test confirm with valid token but activated account", async () => {
    await request
      .post("/api/users/register")
      .send({
        username: "test",
        email: "test",
        password: "test",
      })
      .then(async (data) => {
        expect(data.body).toHaveProperty("token");
        expect(data.status).toBe(200);
        await request
          .get("/api/users/confirm")
          .set("token", data.body.token)
          .then(async (dataConfirm) => {
            expect(dataConfirm.status).toBe(200);
            await request
              .get("/api/users/confirm")
              .set("token", data.body.token)
              .then((dataConfirm2) => {
                expect(dataConfirm2.status).toBe(403);
                expect(dataConfirm2.body.message).toBe(
                  "Account already activated"
                );
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
        expect(data.status).toBe(403);
        expect(data.body.message).toBe(
          "Invalid or expired token. Unauthorised"
        );
      });
  });
  it("Test confirm with empty token", async () => {
    await request.get("/api/users/confirm").then((data) => {
      expect(data.status).toBe(400);
      expect(data.body.message).toBe("Missing token");
    });
  });
});

describe("Testing login", () => {
  it("Test login with valid credentials and confirmed account", async () => {
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

  it("Test login with valid credentials but unconfirmed account", async () => {
    await request
      .post("/api/users/register")
      .send({
        username: "test",
        email: "test@gmail.com",
        password: "test",
      })
      .then(async (data) => {
        await request
          .post("/api/users/login")
          .send({
            username: "test",
            email: "test@gmail.com",
            password: "test",
          })
          .then((data) => {
            expect(data.status).toBe(403);
            expect(data.body.message).toBe("Account not activated");
          });
      });
  });
  it("Test login with only email valid credentials", async () => {
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
  it("Test login with only username valid credentials", async () => {
    await request
      .post("/api/users/login")
      .send({
        email: "test2",
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
        email: "test2",
        password: "wrong_password",
      })
      .then((data) => {
        expect(data.status).toBe(401);
        expect(data.body.message).toBe("Invalid credentials");
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
        expect(data.body.message).toBe("Invalid user");
      });
  });
  it("Test login without proper fields", async () => {
    await request
      .post("/api/users/login")
      .send({
        password: "test",
      })
      .then((data) => {
        expect(data.status).toBe(400);
        expect(data.body.message).toBe("Not all fields have been entered");
      });
  });
});

describe("Test reset password request", () => {
  it("Create an account", async () => {
    await request
      .post("/api/users/register")
      .send({
        username: "test",
        email: "test@gmail.com",
        password: "test",
      })
      .then((data) => {
        expect(data.status).toBe(200);
      });
  });
  it("Create a password reset request", async () => {
    await request
      .post("/api/users/reset")
      .send({
        email: "test@gmail.com",
      })
      .then((data) => {
        expect(data.status).toBe(200);
        expect(data.body).toHaveProperty("token");
      });
  });
  it("Create a password reset request for invalid user", async () => {
    await request
      .post("/api/users/reset")
      .send({
        email: "wat@gmail.com",
      })
      .then((data) => {
        expect(data.status).toBe(401);
        expect(data.body.message).toBe("Invalid user");
      });
  });

  it("Create a password reset request with no body", async () => {
    await request
      .post("/api/users/reset")
      .send({})
      .then((data) => {
        expect(data.status).toBe(400);
        expect(data.body.message).toBe("Email not specified");
      });
  });
});

describe("Test reset password reset", () => {
  it("Create an account", async () => {
    await request
      .post("/api/users/register")
      .send({
        username: "test",
        email: "test@gmail.com",
        password: "test",
      })
      .then((data) => {
        expect(data.status).toBe(200);
      });
  });
  it("Reset password with correct body", async () => {
    await request
      .post("/api/users/reset")
      .send({
        email: "test@gmail.com",
      })
      .then(async (data) => {
        expect(data.status).toBe(200);
        expect(data.body).toHaveProperty("token");
        await request
          .post("/api/users/reset/end")
          .send({
            token: data.body.token,
            password: "12345678",
          })
          .then((data2) => {
            expect(data2.status).toBe(200);
            expect(data2.body.message).toBe("Password successfully updated");
          });
      });
  });

  it("Reset password with invalid token", async () => {
    await request
      .post("/api/users/reset/end")
      .send({
        token: "wrong_token",
        password: "test",
      })
      .then((data) => {
        expect(data.status).toBe(500);
      });
  });

  it("Reset password with invalid fields", async () => {
    await request
      .post("/api/users/reset/end")
      .send({
        password: "test",
      })
      .then((data) => {
        expect(data.status).toBe(400);
        expect(data.body.message).toBe("No token");
      });
  });
});

describe("Test verify", () => {
  it("Test verify with correct token", async () => {
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
        expect(dataVerify.status).toBe(403);
      });
  });

  it("Test verify with no token", async () => {
    await request.get("/api/users/verify").then((dataVerify) => {
      expect(dataVerify.status).toBe(400);
    });
  });
});

describe("Test user update profile", () => {
  it("Test update profile without images", async () => {
    await request
      .post("/api/users/register")
      .send({
        username: "test",
        email: "test",
        password: "test",
      })
      .then(async (data) => {
        await request
          .get("/api/users/confirm")
          .set("token", data.body.token)
          .then(async (confirm) => {
            expect(confirm.status).toBe(200);
            await request
              .post("/api/users/login")
              .send({
                username: "test",
                email: "test",
                password: "test",
              })
              .then(async (data) => {
                expect(data.status).toBe(200);
                await request
                  .post("/api/users/updateProfile")
                  .send({
                    token: data.body.token,
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
      .post("/api/users/updateProfile")
      .send({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        bio: "tester",
        name: "name",
      })
      .then((receive) => {
        expect(receive.status).toBe(400);
        expect(receive.body.message).toBe("Missing token or invalid token");
      });
  });
});

describe("Test public profile", () => {
  it("Test valid profile search", async () => {
    await request
      .post("/api/users/register")
      .send({
        username: "test",
        email: "test",
        password: "test",
      })
      .then(async (data) => {
        await request
          .get("/api/users/getPublicProfile")
          .set("username", "test")
          .then((test) => {
            expect(test.status).toBe(200);
            expect(test.body).toHaveProperty("username");
          });
      });
  });
  it("Test invalid profile search (invalid username)", async () => {
    await request
      .post("/api/users/register")
      .send({
        username: "test",
        email: "test",
        password: "test",
      })
      .then(async (data) => {
        await request
          .get("/api/users/getPublicProfile")
          .set("username", "test1")
          .then((test) => {
            expect(test.status).toBe(403);
            expect(test.body.message).toBe("User not found");
          });
      });
  });
  it("Test invalid profile search (no username)", async () => {
    await request.get("/api/users/getPublicProfile").then((test) => {
      expect(test.status).toBe(400);
      expect(test.body.message).toBe("No username specified");
    });
  });
});
