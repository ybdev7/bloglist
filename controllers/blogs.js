const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({});

  res.json(blogs);
});

blogsRouter.get("/:id", async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

blogsRouter.post("/", async (req, res, next) => {
  const blog = new Blog(req.body);

  const result = await blog.save();

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
