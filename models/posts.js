const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, '請輸入貼文內容']
    },
    image: {
      type:String,
      default:""
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, '請輸入貼文創建者ID'],
    },
    likes: {
        type:Number,
        default: 0
      }
  },
  {
    versionKey: false,
  }
);
const Post = mongoose.model('post', schema);

module.exports = Post;