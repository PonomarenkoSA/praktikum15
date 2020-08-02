const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getAllUsers, getOneUser } = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getOneUser);

module.exports = usersRouter;
