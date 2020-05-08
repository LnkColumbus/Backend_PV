const sinon = require('sinon'); // StubOnMocks para determinar si nuestros servicios fueron llamados o no

const { moviesMock, filteredMoviesMock } = require('./movies');

const getAllStub = sinon.stub();
// 'movies' es la collection de Mongo
getAllStub.withArgs('movies').resolves(moviesMock); // withArgs resuelva con cierta respuesta

const tagQuery = { tags: { $in: ['Drama'] } };
getAllStub.withArgs('movies', tagQuery).resolves(filteredMoviesMock('Drama'));

const createStub = sinon.stub().resolves(moviesMock[0].id);

class MongoLibMock {
    getAll(collection, query) {
        return getAllStub(collection, query);
    }

    create(collection, data) {
        return createStub(collection, data);
    }
}

module.exports = {
    getAllStub,
    createStub,
    MongoLibMock
};