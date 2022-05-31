const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send({ data: movies });
    })
    .catch((error) => next(error));
};

exports.createMovie = (req, res, next) => {
  Movie.create({ owner: req.user._id, ...req.body })
    .then((movie) => res.send({ data: movie }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(error);
      }
    });
};

exports.deleteMovieById = (req, res, next) => {
  const userId = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail()
    .catch(() => {
      throw new NotFoundError('Фильм с указанным _id не найден.');
    })
    .then((movie) => {
      if (movie.owner.toString() !== userId) {
        throw new ForbiddenError('Невозможно удалить чужой фильм');
      }
      Movie.findByIdAndRemove(movieId)
        .then((movieForDelete) => {
          res.send({ data: movieForDelete });
        })
        .catch((error) => {
          if (error.name === 'CastError') {
            next(new BadRequestError('Переданы некорректные данные при удалении фильма'));
          } else {
            next(error);
          }
        });
    })
    .catch(next);
};
