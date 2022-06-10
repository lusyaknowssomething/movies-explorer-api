const router = require('express').Router();
const express = require('express');
const { Auth } = require('../middlewares/auth');
const { usersRoutes } = require('./users');
const { moviesRoutes } = require('./movies');
const NotFoundError = require('../errors/not-found-err');
const { NOT_FOUND_ERROR } = require('../utils/constants');
const { createUser, login } = require('../controllers/users');
const { signInValidation, signUpValidation } = require('../middlewares/validation');

router.post('/signin', express.json(), signInValidation, login);
router.post('/signup', express.json(), signUpValidation, createUser);

router.use(Auth);

router.use(usersRoutes);
router.use(moviesRoutes);

router.use('*', Auth, () => {
  throw new NotFoundError(NOT_FOUND_ERROR);
});

exports.router = router;
