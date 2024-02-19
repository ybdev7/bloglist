const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const helper = require("./helper");
const mongoose = require("mongoose");
mongoose.set("bufferTimeoutMS", 50000);
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

describe("add new user without blogs", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcryptjs.hash("password", 10);
    const user = new User({
      username: "existing",
      name: "Test Test",
      passwordHash: passwordHash,
    });

    await user.save();
  }, 100000);

  test("user creation succeeds", async () => {
    const numOFUsersStart = await helper.numberOfUsersInDb();

    const newUser = {
      username: "testuser1",
      name: "Test User",
      password: "password",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const numOFUsersEnd = await helper.numberOfUsersInDb();
    expect(numOFUsersEnd).toBe(numOFUsersStart + 1);
  });

  test("user with non-uniquie username creation fails as expected", async () => {
    const numOFUsersStart = await helper.numberOfUsersInDb();

    const newUser = {
      username: "existing",
      name: "Test Non-unique User",
      password: "password",
    };

    const res = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    // console.log(res.body);
    expect(res.body.error).toContain("expected `username` to be unique");

    const numOFUsersEnd = await helper.numberOfUsersInDb();
    expect(numOFUsersEnd).toBe(numOFUsersStart);
  });

  test("user with too short (less then 3 chars) username creation fails as expected", async () => {
    const numOFUsersStart = await helper.numberOfUsersInDb();

    const newUser = {
      username: "b1",
      name: "Test too short User",
      password: "password",
    };

    const res = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    // console.log(res.body);
    expect(res.body.error).toContain("is shorter than the minimum allowed");

    const numOFUsersEnd = await helper.numberOfUsersInDb();
    expect(numOFUsersEnd).toBe(numOFUsersStart);
  });

  test("user without username creation fails as expected", async () => {
    const numOFUsersStart = await helper.numberOfUsersInDb();

    const newUser = {
      name: "Test too short User",
      password: "password",
    };

    const res = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    // console.log(res.body);
    expect(res.body.error).toContain("`username` is required");

    const numOFUsersEnd = await helper.numberOfUsersInDb();
    expect(numOFUsersEnd).toBe(numOFUsersStart);
  });
  test("user with too short (less then 3 chars) password creation fails as expected", async () => {
    const numOFUsersStart = await helper.numberOfUsersInDb();

    const newUser = {
      username: "test1",
      name: "Test too short pwd",
      password: "pa",
    };

    const res = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    // console.log(res.body);
    expect(res.body.error).toContain("password too short");

    const numOFUsersEnd = await helper.numberOfUsersInDb();
    expect(numOFUsersEnd).toBe(numOFUsersStart);
  });

  test("user without password creation fails as expected", async () => {
    const numOFUsersStart = await helper.numberOfUsersInDb();

    const newUser = {
      username: "test1",
      name: "no pwd",
    };

    const res = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    // console.log(res.body);
    expect(res.body.error).toContain("password missing");

    const numOFUsersEnd = await helper.numberOfUsersInDb();
    expect(numOFUsersEnd).toBe(numOFUsersStart);
  });

  describe("get users", () => {
    test("users get succeeds", async () => {
      const res = await api.get("/api/users");
      expect(res.body.length).toBe(await helper.numberOfUsersInDb());
    }, 100000);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
