const router = require('express').Router();

const { Auth } = require('../middlewares/auth');
const { usersRoutes } = require('./users');
const { moviesRoutes } = require('./movies');
const NotFoundError = require('../errors/not-found-err');
const { NOT_FOUND_ERROR } = require('../utils/constants');

router.use(Auth);

router.use(usersRoutes);
router.use(moviesRoutes);

router.use('*', Auth, () => {
  throw new NotFoundError(NOT_FOUND_ERROR);
});

exports.router = router;
