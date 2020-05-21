const express = require('express');
const MovieService = require('../services/movies');
const passport = require('passport');

const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema,
} = require('../utils/schemas/movies');

const validationHandler = require('../utils/middleware/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

const cacheResponse = require('../utils/cacheResponse');
const {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS,
} = require('../utils/time');

// JWT strategy
require('../utils/auth/strategies/jwt');

function moviesApi(app) {
  const router = express.Router();
  app.use('/api/movies', router);

  const movieService = new MovieService();

  router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:movies']),
    async function (req, res, next) {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
      const { tags } = req.query;
      try {
        const movies = await movieService.getMovies({ tags });

        res.status(200).json({
          data: movies,
          message: 'movies listed',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.get(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    async function (req, res, next) {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
      const { movieId } = req.params;
      try {
        const movie = await movieService.getMovie({ movieId });
        res.status(200).json({
          data: movie,
          message: 'movie retrieved',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:movies']),
    validationHandler(createMovieSchema),
    async function (req, res, next) {
      const { body: movie } = req;
      try {
        const createdMovideId = await movieService.createMovie({ movie });
        res.status(201).json({
          data: createdMovideId,
          message: 'movie created',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.put(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    validationHandler(updateMovieSchema),
    async function (req, res, next) {
      const { movieId } = req.params;
      const { body: movie } = req;
      try {
        const updatedMovideId = await movieService.updateMovie({
          movieId,
          movie,
        });
        res.status(200).json({
          data: updatedMovideId,
          message: 'movie updated',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.patch(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    async function (req, res, next) {
      const { movieId } = req.params;
      const { body: movie } = req;
      try {
        const patchedMovideId = await movieService.patchMovie({
          movieId,
          movie,
        });
        res.status(200).json({
          data: patchedMovideId,
          message: 'movie patched',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.delete(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    async function (req, res, next) {
      const { movieId } = req.params;
      try {
        const deletedMovieId = await movieService.deleteMovie({ movieId });
        res.status(200).json({
          data: deletedMovieId,
          message: 'movie deleted',
        });
      } catch (error) {
        next(error);
      }
    }
  );
}

module.exports = moviesApi;
