const mongoose = require("mongoose");

const pwd = process.argv[2];

const get_conn_str = (pwd) => {
  return `mongodb+srv://course7:${pwd}@cluster0.goh54gk.mongodb.net/?retryWrites=true&w=majority`;
};

const url = get_conn_str(pwd);

mongoose.set("strictQuery", false);
mongoose.connect(url);

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

if (process.argv.length === 7) {
  const blog = new Blog({
    title: process.argv[3],
    author: process.argv[4],
    url: process.argv[5],
    likes: process.argv[6],
  });

  blog.save().then((res) => {
    console.log(`Added ${blog.title} by ${blog.author} to blogs`);
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
  Blog.find({}).then((result) => {
    console.log("Blogs:");
    result.forEach((blog) => {
      console.log(`${blog.title} ${blog.likes}`);
    });
    mongoose.connection.close();
  });
} else {
  console.log("Please provide a password for MongoDB");
  process.exit(1);
}
