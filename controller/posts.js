const Post = require('../models/posts');
const User = require('../models/users');
const appError = require('../service/appError');
const successHandle = require('../service/successHandle');

const posts = {
  async getPosts(req, res, next) {
    const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt';
    const search = {};
    search.content = new RegExp(req.query.q);
    const post = await Post.find(search).populate({
      path: 'user',
      select: 'name photo',
    }).sort(timeSort);
    successHandle(res, post, 200);
  },
  async createdPosts(req, res, next) {
    const data = req.body;
    const newPost = await Post.create(data);
    successHandle(res, newPost, 200);
  },
  async deleteAllPosts(req, res, next) {
    const newPost = await Post.deleteMany({});
    const allPost = await Post.find();
    successHandle(res, allPost, 200);
  },
  async deleteOnePosts(req, res, next) {
    const id = req.params.id;
    const newPost = await Post.findByIdAndDelete(id);
    const allPost = await Post.find();
    if (newPost === null) {
      return appError(400, '查無此id', next);
    }
    successHandle(res, allPost, 200);
  },
  async editPosts(req, res, next) {
    const data = req.body;
    const id = req.params.id;
    const newPost = await Post.findByIdAndUpdate(id, data, {
      runValidators: true,
      returnDocument: 'after',
    });
    if (newPost === null) {
      return appError(400, '查無此id', next);
    }
    successHandle(res, newPost, 200);
  },
};

module.exports = posts;