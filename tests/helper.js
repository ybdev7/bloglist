const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "first blog",
    author: "first author",
    url: "first-author.com",
    likes: 17,
  },
  {
    title: "second blog",
    author: "second author",
    url: "second-blog.html",
    likes: 15,
  },
];

const deletedId = async () => {
  const blog = new Blog(initialBlogs[0]);
  await blog.save();
  await blog.deleteOne();

  return blog.id;
};

const numberOfBlogsInDb = async () => {
  const allBlogs = await Blog.find({});
  return allBlogs.length;
};

const existingId = async () => {
  const allBlogs = await Blog.find({});
  const id = allBlogs[0].toJSON().id;
  console.log(id);
  return id;
};

/**Returns a blog object  */
const findBlogById = async (id) => {
  const res = await Blog.findById(id);
  return res.toJSON();
};
module.exports = {
  initialBlogs,
  deletedId,
  numberOfBlogsInDb,
  existingId,
  findBlogById,
};