const MONGODB_ADDRESS = 'mongodb://localhost:27017/moviesdb';

const NOT_FOUND_ERROR = 'Запрашиваемый ресурс не найден';

const INVALID_LINK = 'Передана некорректная ссылка';

const UNAUTHORIZED_ERROR = 'Неправильные почта или пароль';
const BAD_REQUEST_ERROR_CREATE_MOVIE = 'Переданы некорректные данные при создании фильма';
const BAD_REQUEST_ERROR_DELETE_MOVIE = 'Переданы некорректные данные при удалении фильма';
const NOT_FOUND_ERROR_MOVIE = 'Фильм с указанным _id не найден';
const FORBIDDEN_ERROR_MOVIE = 'Невозможно удалить чужой фильм';
const CONFLICT_ERROR_USER = 'Пользователь с таким email уже зарегистрирован';
const NOT_FOUND_ERROR_USER = 'Запрашиваемый пользователь не найден';
const BAD_REQUEST_ERROR_USER = 'Переданы некорректные данные при обновлении информации о пользователе';

const UNAUTHORIZED_ERROR_AUTH = 'Необходима авторизация';

const SERVER_ERROR = 'На сервере произошла ошибка';

const INVALID_EMAIL = 'Передан некорректный email';

const CRASH_TEST = 'Сервер сейчас упадёт';

module.exports = {
  MONGODB_ADDRESS,
  NOT_FOUND_ERROR,
  INVALID_LINK,
  UNAUTHORIZED_ERROR,
  BAD_REQUEST_ERROR_CREATE_MOVIE,
  BAD_REQUEST_ERROR_DELETE_MOVIE,
  NOT_FOUND_ERROR_MOVIE,
  FORBIDDEN_ERROR_MOVIE,
  CONFLICT_ERROR_USER,
  NOT_FOUND_ERROR_USER,
  BAD_REQUEST_ERROR_USER,
  UNAUTHORIZED_ERROR_AUTH,
  SERVER_ERROR,
  INVALID_EMAIL,
  CRASH_TEST,
};
