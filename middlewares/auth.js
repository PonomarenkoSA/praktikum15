const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authErr');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.jwtCookie;
    if (!token) {
      throw new AuthError('Необходима авторизация');
    }
    let payload;
    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    } catch (err) {
      throw new AuthError('Необходима авторизация');
    }
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};
