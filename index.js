const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const { config } = require('./config/index');
const authApi = require('./routes/auth');
const moviesApi = require('./routes/movies');
const userMoviesApi = require('./routes/userMovies');
const {
  logErrors,
  wrapErrors,
  errorHandler,
} = require('./utils/middleware/errorHandlers');

const notFoundHandler = require('./utils/middleware/notFoundHandler');

// body parser
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// body parser
app.use(bodyParser.json());

// routes
authApi(app); // ruta de autenticacion
moviesApi(app);
userMoviesApi(app);

// Catch 404
app.use(notFoundHandler);

// Errors middlewares
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.dbPort, function () {
  console.log(
    'Listening http://localhost: \x1b[32m%s\x1b[0m',
    `${config.dbPort}`
  );
});
