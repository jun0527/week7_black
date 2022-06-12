const path = require('path');
const appError = require('./appError');
const handleErrorAsync = require('./handleErrorAsync');
const multer   = require('multer');
const upload = multer({
  limits: {
    // 限制最多只能上傳1MB的圖片
    fileSize: 1*1024*1024,
  },
  filerFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
      cb(appError(400, '檔案錯誤，僅限上傳 jpg、jpeg 與 png 格式。'));
    }
  }
}).any();

module.exports = upload;