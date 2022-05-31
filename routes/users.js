const express = require('express');
const { celebrate, Joi } = require('celebrate');
const usersRoutes = require('express').Router();
const {
  getMyProfile,
  updateUser,
} = require('../controllers/users');
//  const { urlValidation } = require('../middlewares/urlValidation');

usersRoutes.get('/users/me', getMyProfile);
usersRoutes.patch('/users/me', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

exports.usersRoutes = usersRoutes;
