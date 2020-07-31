const notFoundRouter = require('express').Router();

notFoundRouter.all('/', (req, res) => {
  res.status(404).send({ error: 'Запрашиваемый ресурс не найден' });
});

module.exports = notFoundRouter;
