const express = require('express');
const app = express();

const { config } = require('./config/index');
const moviesApi = require('./routes/movies');

app.use(express.json());
moviesApi(app);

app.listen(config.dbPort, function() {
    console.log('Listening http://localhost: \x1b[32m%s\x1b[0m', `${config.dbPort}`);
});