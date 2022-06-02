const express = require('express');
const { celebrate, Joi } = require('celebrate');
const usersRoutes = require('express').Router();
const {
  getMyProfile,
  updateUser,
} = require('../controllers/users');

usersRoutes.get('/users/me', getMyProfile);
usersRoutes.patch('/users/me', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

exports.usersRoutes = usersRoutes;
