const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  res.json(blogs);
});

blogsRouter.get("/:id", async (req, res, next) => {
  const blog = await Blog.findById(req.params.id).populate("user", {
    username: 1,
    name: 1,
  });

  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

blogsRouter.post("/", async (req, res, next) => {
  console.log(req.body.userId);
  const user = await User.findById(req.body.userId);
  console.log(user);
  const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
    user: user.id,
  });

  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  user.save();

  res.status(201).json(result);
});

blogsRouter.delete("/:id", async (req, res, next) => {
  await Blog.findByIdAndDelete(req.params.id);

  res.status(204).end();
});

blogsRouter.put("/:id", async (req, res, next) => {
  const blog = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  });

  res.json(updatedBlog);
});

module.exports = blogsRouter;
