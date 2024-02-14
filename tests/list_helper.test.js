const blog = require("../models/blog");
const listHelper = require("../utils/list_helper");

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});
describe("totalLikes", () => {
  test("totalLikes for [] is 0", () => {
    const blogs = [];

    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(0);
  });

  test("totalLikes for [a] is the number of likes of a", () => {
    const blogs = [
      {
        _id: "65c5278f3f99112a4eda80c8",
        title: "Uptest13a",
        author: "Uptest13a",
        url: "test4",
        likes: 12,
        __v: 0,
      },
    ];

    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(12);
  });

  test("totalLikes [a,b,c] for with 1,2,3 likes is 6", () => {
    const blogs = [
      {
        _id: "65c5278f3f99112a4eda80c8",
        title: "Uptest13a",
        author: "Uptest13a",
        url: "test4",
        likes: 1,
        __v: 0,
      },
      {
        _id: "65c5278f3f99112a4eda80b9",
        title: "Uptest13a",
        author: "Uptest13a",
        url: "test4",
        likes: 2,
        __v: 0,
      },
      {
        _id: "65c5278f3f99112a4eda80d0",
        title: "Uptest13a",
        author: "Uptest13a",
        url: "test4",
        likes: 3,
        __v: 0,
      },
    ];

    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(6);
  });
});

describe("favoriteBlog", () => {
  test("favoriteBlog for [] is null", () => {
    const res = listHelper.favoriteBlog([]);
    expect(res).toEqual(null);
  });

  test("favoriteBlog for [a] is a", () => {
    const blogs = [
      {
        _id: "65c5278f3f99112a4eda80c8",
        title: "Uptest13a",
        author: "Uptest13a",
        url: "test4",
        likes: 12,
        __v: 0,
      },
    ];

    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual({
      title: "Uptest13a",
      author: "Uptest13a",
      likes: 12,
    });
  });

  test("favoriteBlog for [a,b,c] where b has the most likes is b", () => {
    const blogs = [
      {
        _id: "65c5278f3f99112a4eda80c8",
        title: "Uptest13a",
        author: "Uptest13a",
        url: "test4",
        likes: 1,
        __v: 0,
      },
      {
        _id: "65c5278f3f99112a4eda80b9",
        title: "Uptest14a",
        author: "Uptest14a",
        url: "test4",
        likes: 12,
        __v: 0,
      },
      {
        _id: "65c5278f3f99112a4eda80d0",
        title: "Uptest13a",
        author: "Uptest13a",
        url: "test4",
        likes: 3,
        __v: 0,
      },
    ];

    const result = listHelper.favoriteBlog(blogs);
    //  console.log(result);
    expect(result).toEqual({
      title: blogs[1].title,
      author: blogs[1].author,
      likes: blogs[1].likes,
    });
  });

  test("favoriteBlog for [blogs] is { title: Canonical string reduction,  author: Edsger W. Dijkstra,  likes: 12", () => {
    const res = listHelper.favoriteBlog(blogs);
    expect(res).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});

describe("mostBlogs", () => {
  test("mostBlogs for [] is null", () => {
    const blogs = [];

    const result = listHelper.mostBlogs(blogs);
    expect(result).toBe(null);
  });

  test("mostBlogs for [a] is the author of a with number of blogs equal to 1", () => {
    const blogs = [
      {
        _id: "65c5278f3f99112a4eda80c8",
        title: "Uptest13a",
        author: "Uptest13a",
        url: "test4",
        likes: 12,
        __v: 0,
      },
    ];

    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({ author: "Uptest13a", blogs: 1 });
  });

  test("mostBlogs for [a, b, c, d] is the author of a with number of blogs equal to 3", () => {
    const blogs = [
      {
        _id: "65c5278f3f99112a4eda80c8",
        title: "Uptest13a",
        author: "Uptest13a",
        url: "test4",
        likes: 12,
        __v: 0,
      },

      {
        _id: "65c5278f3f99112a4eda80c8",
        title: "Uptest13a",
        author: "Uptest13a",
        url: "test4",
        likes: 12,
        __v: 0,
      },
      {
        _id: "65c5278f3f99112a4eda80c8",
        title: "Uptest13a",
        author: "Uptest12",
        url: "test4",
        likes: 12,
        __v: 0,
      },
      {
        _id: "65c5278f3f99112a4eda80c8",
        title: "Uptest13a",
        author: "Uptest13a",
        url: "test4",
        likes: 12,
        __v: 0,
      },
    ];

    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({ author: "Uptest13a", blogs: 3 });
  });

  test("mostBlogs for [blogs] is {author: Robert C. Martin, blogs: 3}", () => {
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({ author: "Robert C. Martin", blogs: 3 });
  });
});

describe("mostLikes", () => {
  test("mostLikes for [] is null", () => {
    const blogs = [];

    const result = listHelper.mostLikes(blogs);
    expect(result).toBe(null);
  });

  test("mostLikes for [a] is the author of a with number of blogs equal to 1", () => {
    const blogs1 = [
      {
        _id: "65c5278f3f99112a4eda80c8",
        title: "Uptest13a",
        author: "Uptest13a",
        url: "test4",
        likes: 12,
        __v: 0,
      },
    ];

    const result = listHelper.mostLikes(blogs1);
    expect(result).toEqual({ author: "Uptest13a", likes: 12 });
  });

  test("mostLikes for [blogs] is {Edsger W. Dijkstra, 17} ", () => {
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({ author: "Edsger W. Dijkstra", likes: 17 });
  });
});
