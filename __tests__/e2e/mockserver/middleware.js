module.exports = (req, res, next) => {
  const validTestCredentials = {
    token: 'testToken',
    handle: 'w/testHandle',
  };
  if (
    req.headers.token !== validTestCredentials.token ||
    req.headers.handle !== validTestCredentials.handle
  ) {
    const unauthorized = 401;
    res.sendStatus(unauthorized);
    return;
  }
  next();
};
