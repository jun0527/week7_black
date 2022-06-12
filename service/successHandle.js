const successHandle = (res, data, statusCode) => {
  res.status(statusCode).json({
    'status': 'success',
    'data': data,
  });
};

module.exports = successHandle;