'use strict';

const Edge = require('../src/Edge');

describe('Edge', () => {
    it('should throw an error if no opts argument is passed', () => {
        (function () {
            new Edge();
        }).should.throw('You must pass an `opts` argument to the Edge constructor');
    });

    it('should throw an error if no `id` is passed', () => {
        (function () {
            new Edge({});
        }).should.throw('You must pass an `id` option to the Edge constructor');
    });

    it('should throw an error if no `id` is passed', () => {
        (function () {
            new Edge({
                id : 'abcde'
            });
        }).should.throw('You must pass an `a` option to the Edge constructor');
    });

    it('should throw an error if no `id` is passed', () => {
        (function () {
            new Edge({
                id : 'abcde',
                a  : {
                    id : 'fghik'
                }
            });
        }).should.throw('You must pass an `b` option to the Edge constructor');
    });
});
