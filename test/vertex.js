'use strict';

const Vertex = require('../src/Vertex');

describe('Vertex', () => {
    it('should throw an error if no opts argument is passed', () => {
        (function () {
            new Vertex();
        }).should.throw('You must pass an `opts` argument to the Vertex constructor');
    });
});
