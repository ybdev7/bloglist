const mongoose = require("mongoose");
mongoose.set("bufferTimeoutMS", 30000);
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
];

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
}, 100000);

// 4.8
test("all blogs are returned", async () => {
  const res = await api.get("/api/blogs");
  expect(res.body).toHaveLength(initialBlogs.length);
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
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const res = await api.get("/api/blogs");

  const contents = res.body.map((r) => r.title);

  expect(res.body).toHaveLength(initialBlogs.length + 1);
  expect(contents).toContain("Type wars");
}, 100000);

//4.11
test("new blog is saved with .likes default value set to 0", async () => {
  const newBlog = {
    title: "No Likes",
    author: "Me",
    url: "nothing",
  };

  const res = await api.post("/api/blogs").send(newBlog);

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

  const res = await api.post("/api/blogs").send(newBlog);

  expect(res.statusCode).toBe(400);
}, 100000);

//4.12 b;
test("new blog is not saved when missing url", async () => {
  const newBlog = {
    title: "no url",
    author: "Me",
    likes: 10,
  };

  const res = await api.post("/api/blogs").send(newBlog);

  expect(res.statusCode).toBe(400);
}, 100000);

afterAll(async () => {
  await mongoose.connection.close();
});
