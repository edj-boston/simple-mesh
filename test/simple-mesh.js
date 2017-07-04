'use strict';

const SimpleMesh = require('../src/SimpleMesh');

describe('SimpleMesh', () => {
    it('should throw an error if no opts argument is passed', () => {
        (function () {
            new SimpleMesh();
        }).should.throw('A `context` argument is required');
    });
});
