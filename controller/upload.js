const appError = require('../service/appError');
const successHandle = require('../service/successHandle');
// 建立router實體
const sizeOf = require('image-size');
const { ImgurClient } = require('imgur');
const uploads = {
  async postImage(req, res, next) {
    if (!req.files.length) {
      appError(400, '尚未上傳檔案', next);
    }
    const dimensions = sizeOf(req.files[0].buffer);
    if (req.url === '/userPhoto' && dimensions.width !== dimensions.height) {
      appError(400, '圖片長寬不符合 1:1 尺寸。', next);
    }
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENTID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });
    const response = await client.upload({
      // 將圖片轉成base64格式
      image: req.files[0].buffer.toString('base64'),
      type: 'base64',
      // 選擇圖片所放的位置
      album: process.env.IMGUR_ALBUM_ID,
    });
    successHandle(res, response.data.link, 200);
  }
}

module.exports = uploads;