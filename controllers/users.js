const bcryptjs = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
  const blogs = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });

  res.json(blogs);
});

usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;
  if (password === undefined) {
    return res.status(400).json({ error: "password missing" });
  } else if (password.length < 3) {
    return res.status(400).json({ error: "password too short" });
  }

  const saltRounds = 10;
  const passwordHash = await bcryptjs.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
    blogs: [],
  });

  const result = await user.save();

  res.status(201).json(result);
});

module.exports = usersRouter;
