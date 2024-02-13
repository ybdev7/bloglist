const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (!blogs) return 0;
  return blogs.reduce((sum, item) => sum + item.likes, 0);
};
/**4.5 */
const favoriteBlog = (blogs) => {
  if (!blogs || blogs.length === 0) return null;
  const favorite = blogs.reduce(
    (prev, item) => (item.likes > prev.likes ? item : prev),
    blogs[0]
  );

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

/**4.6 */
const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) return null;
  const map = new Map();
  blogs.map((item) => {
    if (!map.has(item.author)) {
      map.set(item.author, 1);
    } else {
      map.set(item.author, map.get(item.author) + 1);
    }
  });

  //console.log("here1", map);
  const array = Array.from(map, ([key, value]) => ({
    author: key,
    blogs: value,
  }));

  let sorted = _.orderBy(array, ["blogs"], ["desc"]);
  return sorted[0];
};

/**4.7 */
const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) return null;
  const map = new Map();
  blogs.map((item) => {
    if (!map.has(item.author)) {
      map.set(item.author, item.likes);
    } else {
      map.set(item.author, map.get(item.author) + item.likes);
    }
  });
  const array = Array.from(map, ([key, value]) => ({
    author: key,
    likes: value,
  }));

  let sorted = _.orderBy(array, ["likes"], ["desc"]);
  return sorted[0];
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
