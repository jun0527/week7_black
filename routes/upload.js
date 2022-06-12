const express = require('express');
const appError = require('../service/appError');
const successHandle = require('../service/successHandle');
const handleErrorAsync = require('../service/handleErrorAsync');
// 建立router實體
const router = express.Router();
const upload = require('../service/image');
const { isAuth } = require('../service/auth');
const { postImage } = require('../controller/upload');
router.post('/image', isAuth, upload, handleErrorAsync(async (req, res, next) => {
  await postImage(req, res, next);
}))
router.post('/userPhoto', isAuth, upload, handleErrorAsync(async (req, res, next) => {
  await postImage(req, res, next);
}))

module.exports = router;