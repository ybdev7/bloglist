const mongoose = require("mongoose");
mongoose.set("bufferTimeoutMS", 30000);
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");

const helper = require("./helper");
const api = supertest(app);

let token = "";
beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);

  await User.deleteMany({});

  const passwordHash = await bcryptjs.hash("abcd", 10);
  const user = new User({
    username: "username1",
    name: "Test",
    passwordHash: passwordHash,
  });

  await user.save();

  //get authorization token
  const res = await api.post("/api/login").send({
    username: "username1",
    password: "abcd",
  });

  token = res.body.token;
}, 100000);

// 4.8
test("all blogs are returned", async () => {
  const res = await api.get("/api/blogs");
  expect(res.body).toHaveLength(helper.initialBlogs.length);
}, 100000);
//4.9
test("id property is defined", async () => {
  const res = await api.get("/api/blogs");

  const first = res.body[0];
  expect(first.id).toBeDefined();
}, 100000);
//4.10
test("new blog is saved", async () => {
  const newBlog = {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${token}`)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const res = await api.get("/api/blogs");

  const contents = res.body.map((r) => r.title);

  expect(res.body).toHaveLength(helper.initialBlogs.length + 1);
  expect(contents).toContain("Type wars");
}, 100000);

//4.11
test("new blog is saved with .likes default value set to 0", async () => {
  const newBlog = {
    title: "No Likes",
    author: "Me",
    url: "nothing",
  };

  const res = await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(201);
  expect(res.body.likes).toBe(0);
}, 100000);

//4.12 a;
test("new blog is not saved when missing title", async () => {
  const newBlog = {
    author: "Me",
    url: "nothing",
    likes: 10,
  };

  const res = await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(400);
}, 100000);

//4.12 b;
test("new blog is not saved when missing url", async () => {
  const newBlog = {
    title: "no url",
    author: "Me",
    likes: 10,
  };

  const res = await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(400);
}, 100000);
//4.23 - new blog is not saved without the authorization token
test("new blog is not saved wihtout authorization token-expect status code 401", async () => {
  const newBlog = {
    title: "No Likes",
    author: "Me",
    url: "nothing",
  };

  const res = await api.post("/api/blogs").send(newBlog);

  expect(res.statusCode).toBe(401);
}, 100000);

describe("updating a blog", () => {
  test.only("update blog with existing id, update likes only", async () => {
    const blog = new Blog(helper.initialBlogs[0]);
    blog.user = await helper.userIdExtractor(token);
    await blog.save();
    const numberOfBlogs = await helper.numberOfBlogsInDb();

    const savedRes = await api.get(`/api/blogs/${blog.id}`);
    console.log("savedBlog=", savedRes.body);
    savedRes.body.likes = 100;
    const res = await api
      .put(`/api/blogs/${blog.id}`)
      .send(savedRes.body)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    const numberOfBlogsNow = await helper.numberOfBlogsInDb();
    expect(numberOfBlogsNow).toBe(numberOfBlogs);
    console.log("res.body=", res.body);
  });
}, 100000);
describe("deleting a blog", () => {
  test("delete blog with existing id, returns status 204", async () => {
    const blog = new Blog(helper.initialBlogs[0]);
    blog.user = await helper.userIdExtractor(token);
    await blog.save();
    const numberOfBlogs = await helper.numberOfBlogsInDb();

    const res = await api
      .delete(`/api/blogs/${blog.id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
    const numberOfBlogsNow = await helper.numberOfBlogsInDb();
    expect(numberOfBlogsNow).toBe(numberOfBlogs - 1);
  });

  test("delete blog with non-existing id", async () => {
    const numberOfBlogs = await helper.numberOfBlogsInDb();
    const deletedId = await helper.deletedId();
    const res = await api
      .delete(`/api/blogs/${deletedId}`)
      .set("Authorization", `Bearer ${token}`);
    console.log(res);
    expect(res.statusCode).toBe(204);
    const numberOfBlogsNow = await helper.numberOfBlogsInDb();
    expect(numberOfBlogsNow).toBe(numberOfBlogs);
  }, 100000);
  test("delete blog with invalid id", async () => {
    const numberOfBlogs = await helper.numberOfBlogsInDb();

    const res = await api
      .delete(`/api/blogs/12345678`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    const numberOfBlogsNow = await helper.numberOfBlogsInDb();
    expect(numberOfBlogsNow).toBe(numberOfBlogs);
  }, 100000);
});

describe("updating a blog", () => {
  test("update existing blog's title, author, url, likes", async () => {
    const numberOfBlogs = await helper.numberOfBlogsInDb();
    const updatedBlog = {
      title: "updated blog",
      author: "updated author",
      url: "updated-blog.html",
      likes: 105,
    };
    const existingId = await helper.existingId();
    const res = await api.put(`/api/blogs/${existingId}`).send(updatedBlog);
    expect(res.statusCode).toBe(200);

    const blogResult = await helper.findBlogById(existingId);
    expect(blogResult.likes).toBe(updatedBlog.likes);
    expect(blogResult.title).toBe(updatedBlog.title);
    expect(blogResult.author).toBe(updatedBlog.author);
    expect(blogResult.url).toBe(updatedBlog.url);
    const numberOfBlogsNow = await helper.numberOfBlogsInDb();
    expect(numberOfBlogsNow).toBe(numberOfBlogs);
  }, 100000);

  test("update existing blog's likes", async () => {
    const numberOfBlogs = await helper.numberOfBlogsInDb();
    const updatedBlog = {
      likes: 205,
    };
    const existingId = await helper.existingId();
    const blogResultOld = await helper.findBlogById(existingId);

    const res = await api.put(`/api/blogs/${existingId}`).send(updatedBlog);
    expect(res.statusCode).toBe(200);

    const blogResult = await helper.findBlogById(existingId);
    expect(blogResult.likes).toBe(updatedBlog.likes); //updated likes
    expect(blogResult.title).toBe(blogResultOld.title); //no change
    expect(blogResult.author).toBe(blogResultOld.author);
    expect(blogResult.url).toBe(blogResultOld.url);

    const numberOfBlogsNow = await helper.numberOfBlogsInDb();
    expect(numberOfBlogsNow).toBe(numberOfBlogs); //no change
  }, 100000);

  test("update existing blog with undefined", async () => {
    const numberOfBlogs = await helper.numberOfBlogsInDb();
    const updatedBlog = undefined;
    const existingId = await helper.existingId();
    const blogResultOld = await helper.findBlogById(existingId);

    const res = await api.put(`/api/blogs/${existingId}`).send(updatedBlog);
    expect(res.statusCode).toBe(200);

    const blogResult = await helper.findBlogById(existingId);

    //expect no change
    expect(blogResult.likes).toBe(blogResultOld.likes);
    expect(blogResult.title).toBe(blogResultOld.title);
    expect(blogResult.author).toBe(blogResultOld.author);
    expect(blogResult.url).toBe(blogResultOld.url);

    const numberOfBlogsNow = await helper.numberOfBlogsInDb();
    expect(numberOfBlogsNow).toBe(numberOfBlogs);
  }, 100000);
});

afterAll(async () => {
  await mongoose.connection.close();
});
