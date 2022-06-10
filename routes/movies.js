const express = require('express');
const moviesRoutes = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');
const { createMovieValidation, deleteMovieValidation } = require('../middlewares/validation');

moviesRoutes.get('/movies', getMovies);
moviesRoutes.post('/movies', express.json(), createMovieValidation, createMovie);
moviesRoutes.delete('/movies/:movieId', deleteMovieValidation, deleteMovieById);

exports.moviesRoutes = moviesRoutes;
