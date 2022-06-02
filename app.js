require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const { usersRoutes } = require('./routes/users');
const { moviesRoutes } = require('./routes/movies');
const { createUser, login } = require('./controllers/users');
const { Auth } = require('./middlewares/auth');
const { cors } = require('./middlewares/cors');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const { MONGODB_ADDRESS, NOT_FOUND_ERROR, CRASH_TEST } = require('./utils/constants');
const { rateLimiter } = require('./middlewares/rateLimiter');

const { PORT = 3000 } = process.env;
const app = express();

app.use(rateLimiter);
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.disable('x-powered-by');

app.use((req, res, next) => cors(req, res, next));

mongoose.connect(MONGODB_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB has started ...'))
  .catch((error) => console.log(error));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(CRASH_TEST);
  }, 0);
});

app.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/', Auth, usersRoutes);
app.use('/', Auth, moviesRoutes);

app.use('*', Auth, () => {
  throw new NotFoundError(NOT_FOUND_ERROR);
});

app.use(errors());
app.use(errorLogger); // подключаем логгер ошибок
app.use((err, req, res, next) => errorHandler(err, req, res, next));

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
