const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const BadRequestError = require('../errors/bad-request-err');
const {
  CONFLICT_ERROR_USER,
  NOT_FOUND_ERROR_USER,
  BAD_REQUEST_ERROR_USER,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

exports.getMyProfile = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => res.send(user))
    .catch(next);
};

exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      },
    }))
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictError(CONFLICT_ERROR_USER));
      } else {
        next(error);
      }
    });
};

exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((userData) => {
      if (userData) {
        res.send({ data: userData });
      } else {
        throw new NotFoundError(NOT_FOUND_ERROR_USER);
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_USER));
      } else {
        next(error);
      }
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};
