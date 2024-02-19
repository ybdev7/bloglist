const bcryptjs = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
  const blogs = await User.find({});

  res.json(blogs);
});

usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;

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
