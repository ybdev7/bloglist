const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require("./utils/middleware");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(requestLogger);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
