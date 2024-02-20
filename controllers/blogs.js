const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");

// const getTokenFrom = (req) => {
//   const authorization = req.get("authorization");
//   if (authorization && authorization.startsWith("Bearer ")) {
//     return authorization.replace("Bearer ", "");
//   }
//   return null;
// };

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

blogsRouter.post("/", middleware.userExtractor, async (req, res, next) => {
  const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
    user: req.user._id,
  });

  const result = await blog.save();
  req.user.blogs = req.user.blogs.concat(result._id);
  req.user.save();

  res.status(201).json(result);
});

blogsRouter.delete("/:id", middleware.userExtractor, async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (blog.user.toString() === req.user._id.toString()) {
    await Blog.findByIdAndDelete(req.params.id);

    res.status(204).end();
  } else {
    res.status(403).json({
      error: "no permission to delete",
    });
  }
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
