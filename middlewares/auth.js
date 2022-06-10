const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const { UNAUTHORIZED_ERROR_AUTH } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

exports.Auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(UNAUTHORIZED_ERROR_AUTH);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    throw new UnauthorizedError(UNAUTHORIZED_ERROR_AUTH);
  }
  req.user = payload;

  next();
};
