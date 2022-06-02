const validator = require('validator');
const { INVALID_LINK } = require('../utils/constants');

exports.urlValidation = (value, helpers) => {
  if (!validator.isURL(value)) {
    return helpers.message(INVALID_LINK);
  }
  return value;
};
