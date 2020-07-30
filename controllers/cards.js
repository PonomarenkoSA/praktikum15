const Card = require('../models/card');
const ValidationError = require('../errors/validationErr');
const NotFoundError = require('../errors/notFoundErr');
const PermissionError = require('../errors/permissionErr');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  try {
    Card.create({ name, link, owner: req.user._id })
      .then((card) => res.send({ data: card }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new ValidationError('Ошибка валидации');
        }
        throw new Error();
      });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCard = (req, res, next) => {
  try {
    Card.findById(req.params.cardId).orFail(new NotFoundError(`Карточка c id: ${req.params.cardId} не найдена`))
      .then((card) => {
        if (JSON.stringify(card.owner._id) !== JSON.stringify(req.user._id)) {
          return Promise.reject(new PermissionError('Удаление карточек других пользователей запрещено'));
        }
        return Card.findByIdAndDelete(req.params.cardId)
          .then((cardDel) => res.send({ data: cardDel }))
          .catch(next);
      })
      .catch(next);
  } catch (err) {
    next(err);
  }
};
