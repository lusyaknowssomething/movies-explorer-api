const express = require('express');
const usersRoutes = require('express').Router();
const {
  getMyProfile,
  updateUser,
} = require('../controllers/users');
const { updateUserValidation } = require('../middlewares/validation');

usersRoutes.get('/users/me', getMyProfile);
usersRoutes.patch('/users/me', express.json(), updateUserValidation, updateUser);

exports.usersRoutes = usersRoutes;
