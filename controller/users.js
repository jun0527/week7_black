const User = require('../models/users');
const appError = require('../service/appError');
const successHandle = require('../service/successHandle');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { generateSendJWT } = require('../service/auth');

const users = {
  async postSignUp(req, res, next) {
    const { name, email, password, confirmPassword } = req.body;
    // 內容不為空
    if (!name || !email || !password || !confirmPassword) {
      return appError(400, '欄位未正確填寫', next);
    }
    // 暱稱是否兩個字以上
    if (!validator.isLength(name, {min: 2})) {
      return appError(400, '暱稱至少要兩個字', next);
    }
    // email格式是否正確
    if (!validator.isEmail(email)) {
      return appError(400, 'email格式錯誤', next);
    }
    // 密碼是否正確
    if (confirmPassword !== password) {
      return appError(400, '密碼不一致', next);
    }
    // 密碼是否8碼以上
    if (!validator.isLength(password, {min: 8})) {
      return appError(400, '密碼長度小於8碼', next);
    }
    // 密碼是否英數混合
    const regExp = new RegExp('(?=.*?[a-zA-Z])(?=.*?[0-9])');
    if (!regExp.test(password) || !validator.isAlphanumeric(password)) {
      return appError(400, '密碼非英數混合', next);
    }
    // 加密密碼
    const newPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password: newPassword,
    });
    generateSendJWT(newUser, 201, res);
  },
  async postSignIn(req, res, next) {
    const { email, password } = req.body;
    // 內容不為空
    if (!email || !password) {
      return appError(400, '欄位未正確填寫', next);
    }
    // email格式是否正確
    if (!validator.isEmail(email)) {
      return appError(400, 'email格式錯誤', next);
    }
    // 密碼是否正確
    const user = await User.findOne({ email }).select('+password');
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return appError(400, '密碼錯誤', next);
    }
    generateSendJWT(user, 200, res);
  },
  async postProfile(req, res, next) {
    const { name, photo, sex } = req.body;
    // 暱稱是否兩個字以上
    if (!validator.isLength(name, {min: 2})) {
      return appError(400, '暱稱至少要兩個字', next);
    }
    const values = ['male', 'female', ''];
    if (!validator.isIn(sex, values)) {
      return appError(400, '性別資料不正確', next);
    }
    const body = req.body;
    const newUser = await User.findByIdAndUpdate(req.user.id, body, {
      returnDocument: 'after',
    });
    successHandle(res, newUser, 200);
  },
  async postUpdatePassword(req, res, next) {
    const { password, confirmPassword } = req.body;
    // 內容不為空
    if (!password || !confirmPassword) {
      return appError(400, '欄位未正確填寫', next);
    }
    // 密碼是否正確
    if (confirmPassword !== password) {
      return appError(400, '密碼不一致', next);
    }
    // 密碼是否8碼以上
    if (!validator.isLength(password, {min: 8})) {
      return appError(400, '密碼長度小於8碼', next);
    }
    // 密碼是否英數混合
    const regExp = new RegExp('(?=.*?[a-zA-Z])(?=.*?[0-9])');
    if (!regExp.test(password) || !validator.isAlphanumeric(password)) {
      return appError(400, '密碼非英數混合', next);
    }
    // 加密密碼
    const newPassword = await bcrypt.hash(password, 12);
    const user = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword,
    })
    generateSendJWT(user, 200, res);
  },
}

module.exports = users;