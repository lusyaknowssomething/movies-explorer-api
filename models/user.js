const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/unauthorized-err');
const { UNAUTHORIZED_ERROR, INVALID_EMAIL } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: INVALID_EMAIL,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function fn(email, password) {
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        throw new UnauthorizedError(UNAUTHORIZED_ERROR);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(UNAUTHORIZED_ERROR);
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
