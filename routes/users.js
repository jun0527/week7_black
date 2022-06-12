var express = require('express');
var router = express.Router();
const User = require('../models/users');
const handleErrorAsync = require('../service/handleErrorAsync');
const successHandle = require('../service/successHandle');
const { isAuth } = require('../service/auth');
const { postSignUp, postSignIn, postProfile, postUpdatePassword } = require('../controller/users');

router.post('/sign_up', handleErrorAsync(async (req, res, next) => {
  await postSignUp(req, res, next);
}))
router.post('/sign_in', handleErrorAsync(async (req, res, next) => {
  await postSignIn(req, res, next);
}))
// 取得個人資料
router.get('/profile', isAuth, handleErrorAsync(async (req, res, next) => {
  successHandle(res, req.user, 200);
}))
// 修改個人資料
router.post('/profile', isAuth, handleErrorAsync(async (req, res, next) => {
  await postProfile(req, res, next);
}))
// 修改密碼
router.post('/updatePassword', isAuth, handleErrorAsync(async (req, res, next) => {
  await postUpdatePassword(req, res, next);
}))


module.exports = router;
