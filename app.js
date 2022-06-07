require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { cors } = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const { CRASH_TEST } = require('./utils/constants');
const { rateLimiter } = require('./middlewares/rateLimiter');
const { router } = require('./routes/index');
const { PORT, MONGODB_ADDRESS } = require('./config');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.disable('x-powered-by');

mongoose.connect(MONGODB_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB has started ...'))
  .catch((error) => console.log(error));

app.use(requestLogger);

app.use(rateLimiter);

app.use((req, res, next) => cors(req, res, next));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(CRASH_TEST);
  }, 0);
});

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use((err, req, res, next) => errorHandler(err, req, res, next));

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
