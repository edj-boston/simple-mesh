'use strict';

const Ctx = require('../lib/mockCtx'),
    SimpleMesh = require('../src/SimpleMesh');

describe('SimpleMesh', () => {
    it('should throw an error if no `context` argument is passed', () => {
        (function () {
            new SimpleMesh();
        }).should.throw('A `context` argument is required');
    });

    it('should throw an error if no `opts` argument is passed', () => {
        (function () {
            new SimpleMesh(new Ctx);
        }).should.throw('A `opts` argument is required');
    });

    it('should turn options into properties', () => {
        const mesh = new SimpleMesh(new Ctx, {
            vertices : {
                'abcde' : { id : 'abcde' },
                'fghij' : { id : 'fghij' }
            }
        });
        mesh.vertices.should.have.keys('abcde', 'fghij');
    });

    describe('validate()', () => {
        it('should reject a non-boolean `fog` option', () => {
            (function () {
                new SimpleMesh(new Ctx(), { fog : 'string' });
            }).should.throw('The `fog` property must be boolean');
        });

        it('should reject a non-object `origin` option', () => {
            (function () {
                new SimpleMesh(new Ctx(), { origin : 'string' });
            }).should.throw('The `origin` property must be an object');
        });

        it('should reject a non-numeric `origin.x` option', () => {
            (function () {
                new SimpleMesh(new Ctx(), { origin : { x : 'string' } });
            }).should.throw('The `origin.x` property must be a number');
        });

        it('should reject a non-numeric `origin.y` option', () => {
            (function () {
                new SimpleMesh(new Ctx(), { origin : { y : 'string' } });
            }).should.throw('The `origin.y` property must be a number');
        });

        it('should reject a non-numeric `origin.z` option', () => {
            (function () {
                new SimpleMesh(new Ctx(), { origin : { z : 'string' } });
            }).should.throw('The `origin.z` property must be a number');
        });

        it('should reject a non-object `theta` option', () => {
            (function () {
                new SimpleMesh(new Ctx(), { theta : 'string' });
            }).should.throw('The `theta` property must be an object');
        });

        it('should reject a non-numeric `theta.x` option', () => {
            (function () {
                new SimpleMesh(new Ctx(), { theta : { x : 'string' } });
            }).should.throw('The `theta.x` property must be a number');
        });

        it('should reject a non-numeric `theta.y` option', () => {
            (function () {
                new SimpleMesh(new Ctx(), { theta : { y : 'string' } });
            }).should.throw('The `theta.y` property must be a number');
        });

        it('should reject a non-numeric `theta.z` option', () => {
            (function () {
                new SimpleMesh(new Ctx(), { theta : { z : 'string' } });
            }).should.throw('The `theta.z` property must be a number');
        });

        it('should reject a non-boolean `vertexVisibility` option', () => {
            (function () {
                new SimpleMesh(new Ctx(), { vertexVisibility : 'string' });
            }).should.throw('The `vertexVisibility` property must be boolean');
        });

        it('should reject a non-object `vertexStyle` option', () => {
            (function () {
                new SimpleMesh(new Ctx(), { vertexStyle : 'string' });
            }).should.throw('The `vertexStyle` property must be an object');
        });

        it('should reject a non-boolean `edgeVisibility` option', () => {
            (function () {
                new SimpleMesh(new Ctx(), { edgeVisibility : 'string' });
            }).should.throw('The `edgeVisibility` property must be boolean');
        });

        it('should reject a non-object `edgeStyle` option', () => {
            (function () {
                new SimpleMesh(new Ctx(), { edgeStyle : 'string' });
            }).should.throw('The `edgeStyle` property must be an object');
        });

        it('should reject a non-boolean `faceVisibility` option', () => {
            (function () {
                new SimpleMesh(new Ctx(), { faceVisibility : 'string' });
            }).should.throw('The `faceVisibility` property must be boolean');
        });

        it('should reject a non-object `faceStyle` option', () => {
            (function () {
                new SimpleMesh(new Ctx(), { faceStyle : 'string' });
            }).should.throw('The `faceStyle` property must be an object');
        });
    });

    describe('generateUniqueId()', () => {
        it('should generate 5-character alphanumeric id\'s', () => {
            const mesh = new SimpleMesh(new Ctx, {});
            mesh.generateUniqueId().should.match(/^[a-zA-Z0-9]{5}$/);
        });
    });
});
