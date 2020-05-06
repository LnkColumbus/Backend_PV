const express = require('express');

const app = express();

const { config } = require('./config/index');
const moviesApi = require('./routes/movies');

moviesApi(app);

app.get('/', function(req, res) {
    res.send('Hello World');
});

app.listen(config.port, function() {
    console.log(`Listening http://localhost:${config.port}`);
});