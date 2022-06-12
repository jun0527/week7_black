const User = require('../models/users');
const handleErrorAsync = require('../service/handleErrorAsync');
const appError = require('../service/appError');
const successHandle = require('../service/successHandle');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const isAuth = async (req, res, next) => {
  // 驗證headers是否夾帶token
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return appError(400, '帳號未登入', next);
  }
  // 驗證 token 正確性
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        return appError(400, 'token錯誤', next);
      } else {
        resolve(payload);
      }
    })
  })
  const currentUser = await User.findById(decoded.id);
  req.user = currentUser;
  next();
}

const generateSendJWT = (user, statusCode, res) => {
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign({id: user.id}, secret, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  user.password = undefined;
  successHandle(res, {
    token,
    name: user.name,
  },
  statusCode);
}

module.exports = {
  isAuth,
  generateSendJWT,
};