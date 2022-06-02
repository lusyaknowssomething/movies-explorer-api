const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const {
  BAD_REQUEST_ERROR_CREATE_MOVIE,
  BAD_REQUEST_ERROR_DELETE_MOVIE,
  NOT_FOUND_ERROR_MOVIE,
  FORBIDDEN_ERROR_MOVIE,

} = require('../utils/constants');

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
        next(new BadRequestError(BAD_REQUEST_ERROR_CREATE_MOVIE));
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
      throw new NotFoundError(NOT_FOUND_ERROR_MOVIE);
    })
    .then((movie) => {
      if (movie.owner.toString() !== userId) {
        throw new ForbiddenError(FORBIDDEN_ERROR_MOVIE);
      }
      Movie.findByIdAndRemove(movieId)
        .then((movieForDelete) => {
          res.send({ data: movieForDelete });
        })
        .catch((error) => {
          if (error.name === 'CastError') {
            next(new BadRequestError(BAD_REQUEST_ERROR_DELETE_MOVIE));
          } else {
            next(error);
          }
        });
    })
    .catch(next);
};
