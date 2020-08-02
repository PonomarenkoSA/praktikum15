const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundErr');
const AuthError = require('../errors/authErr');
const ValidationError = require('../errors/validationErr');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  User.validate({ password }, ['password'])
    .then(() => {
      try {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name,
            about,
            avatar,
            email,
            password: hash,
          }))
          .then(() => res.status(201).send({
            name,
            about,
            avatar,
            email,
          }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              throw new ValidationError(err.message);
            } else {
              throw new Error();
            }
          })
          .catch((err) => {
            next(err);
          });
      } catch (err) {
        next(err);
      }
    })
    .catch(() => {
      throw new ValidationError('Пароль должен быть не менее 8 символов');
    })
    .catch(next);
};

module.exports.getOneUser = (req, res, next) => {
  try {
    User.findById(req.params.userId)
      .orFail(new NotFoundError(`Пользователь c id: ${req.params.userId} не найден`))
      .then((user) => res.send({ data: user }))
      .catch(next);
  } catch (err) {
    next(err);
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res
        .cookie('jwtCookie', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        });
      res.send({ message: 'Авторизация успешно пройдена' });
    })
    .catch((err) => {
      throw new AuthError(err.message);
    })
    .catch(next);
};
