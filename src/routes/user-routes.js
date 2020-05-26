const express = require('express');
const userRoutes = express.Router();
const { celebrate, Joi, Segments } = require('celebrate');

const UserController = require('../controllers/user-controller');


userRoutes.get('/users', UserController.index);

userRoutes.post('/users', celebrate({
  [Segments.BODY]: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().required().email(),
  })
}), UserController.sign );

userRoutes.post('/user/token', celebrate({
  [Segments.BODY]: Joi.object().keys({
    token: Joi.string().required(),
  })
}), UserController.validToken);

userRoutes.post('/user/new', celebrate({
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string().required().max(50),
    password: Joi.string().required(),
    email: Joi.string().required().email()
  })
}) , UserController.create);


userRoutes.delete('/user/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required()
  }).unknown()
}) , UserController.delete);


userRoutes.put('/user/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required()
  }).unknown(),
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string().required().max(50)
  }),
}) , UserController.update);


module.exports = userRoutes;