'use strict';

const Face = require('../src/Face');

describe('Face', () => {
    it('should throw an error if no opts argument is passed', () => {
        (function () {
            new Face();
        }).should.throw('You must pass an `opts` argument to the Face constructor');
    });
});
