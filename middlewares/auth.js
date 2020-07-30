const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authErr');

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.jwtCookie;
    if (!token) {
      throw new AuthError('Необходима авторизация');
    }
    let payload;
    try {
      payload = jwt.verify(token, 'f20109237f18715dfde3b12696c753568eee175cdb71d317271b0cb8fa0376e8');
    } catch (err) {
      throw new AuthError('Необходима авторизация');
    }
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};
