const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '請輸入您的姓名'],
      minlength: 2,
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true,
      select: false,
    },
    password: {
      type: String,
      required: [true, '請輸入您的密碼'],
      select: false,
    },
    photo: {
      type: String,
      default: '',
    },
    sex: {
      type: String,
      enum: ['male', 'female', ''],
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    }
  },
  {
    versionKey: false,
  }
);
const User = mongoose.model('user', schema);

module.exports = User;