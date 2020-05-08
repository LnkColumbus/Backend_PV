const assert = require('assert');
const proxyquire = require('proxyquire'); // requerir el servicio y reemplazar el servicio por nuestro mock

const { MongoLibMock, getAllStub } = require('../utils/mocks/mongoLib');
const { moviesMock } = require('../utils/mocks/movies');

describe('services - movies', () => {
    const MoviesService = proxyquire('../services/movies', {
        '../lib/mongo': MongoLibMock
    });

    const moviesService = new MoviesService();

    describe('when getMovies method is callled', async() => {
        it('should call the getAll MongoLib method', async() => {
            await moviesService.getMovies({});
            assert.strictEqual(getAllStub.called, true);
        });

        it('should return an array of movies', async() => {
            const result = await moviesService.getMovies({});
            const expected = moviesMock;
            assert.deepEqual(result, expected);
        });
    });
});