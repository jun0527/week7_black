var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)
mongoose.connect(DB)
  .then(() => {
    console.log('連接成功');
  })
  .catch((err) => {
    console.log(err);
  })

// 捕捉程式錯誤
process.on('uncaughtException', (err) => {
  // 記錄錯誤，等服務處裡完就停掉這個process
  console.log('Uncaught Exception');
  console.log(err);
  process.exit(1);
})

var usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const uploadRouter = require('./routes/upload');
const appError = require('./service/appError');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', postsRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);
// 404錯誤
app.use((req, res, next) => {
  appError(404, '找不到此路由', next);
});
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    // 預期的錯誤
    res.status(err.statusCode).json({
      message: err.message,
    })
  } else {
    // 出現未預期錯誤
    console.log('發生重大錯誤', err);
    res.status(500).json({
      status: 'error',
      message: '系統錯誤，請洽系統管理員。',
    })
  }
};

const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack,
  })
};
// 錯誤處裡
app.use((err, req, res, next) => {
  // dev
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  }
  // 錯誤為mongoose錯誤，且環境為production
  if (err.name === 'ValidationError') {
    err.statusCode = 400;
    err.message = '欄位未填寫正確，請重新輸入！';
    err.isOperational = true;
    return resErrorProd(err, res);
  }
  if (err.name === 'SyntaxError' && err.statusCode === 400) {
    err.isOperational = true;
    return resErrorProd(err, res);
  }
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    err.statusCode = 400;
    err.message = 'id格式錯誤！';
    err.isOperational = true;
    return resErrorProd(err, res);
  }
  if (err.name === 'MongoServerError' && err.code === 11000) {
    err.statusCode = 400;
    err.message = 'email重複註冊';
    err.isOperational = true;
    return resErrorProd(err, res);
  }
  // production
  resErrorProd(err, res);
});
// 捕捉未捕捉到的catch
process.on('unhandledRejection', (err, promise) => {
  console.log('未捕捉到的 rejection：', promise, '原因：', err);
})

module.exports = app;
