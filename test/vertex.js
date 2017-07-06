'use strict';

const Ctx = require('../lib/mockCtx'),
    Vertex = require('../src/Vertex');

describe('Vertex', () => {
    it('should throw an error if no opts argument is passed', () => {
        (function () {
            new Vertex();
        }).should.throw('You must pass an `opts` argument to the Vertex constructor');
    });

    it('should throw an error if no `id` is passed', () => {
        (function () {
            new Vertex({});
        }).should.throw('You must pass an `id` option to the Vertex constructor');
    });

    it('should throw an error if no `x` option is passed', () => {
        (function () {
            new Vertex({
                id : 'abcde'
            });
        }).should.throw('You must pass an `x` option to the Vertex constructor');
    });

    it('should throw an error if no `y` vertex is passed', () => {
        (function () {
            new Vertex({
                id : 'abcde',
                x  : 0
            });
        }).should.throw('You must pass a `y` option to the Vertex constructor');
    });

    it('should throw an error if no `z` vertex is passed', () => {
        (function () {
            new Vertex({
                id : 'abcde',
                x  : 0,
                y  : 0
            });
        }).should.throw('You must pass a `z` option to the Vertex constructor');
    });

    it('should convert opts into properties', () => {
        const vertex = new Vertex({
            id : 'abcde',
            x  : 0,
            y  : 0,
            z  : 0
        });
        vertex.id.should.equal('abcde');
        vertex.x.should.equal(0);
        vertex.y.should.equal(0);
        vertex.z.should.equal(0);
    });

    describe('draw()', () => {
        it('should call specific methods', () => {
            const vertex = new Vertex({
                id : 'abcde',
                x  : 0,
                y  : 0,
                z  : 0
            });
            const ctx = new Ctx('round', 1, '#000000');
            vertex.draw(ctx, {
                radius          : 0,
                labelVisibility : false
            });
            ctx.callStack.should.eql([ 'beginPath', 'arc', 'closePath', 'fill', 'stroke' ]);
        });

        it('should draw labels', () => {
            const vertex = new Vertex({
                id : 'abcde',
                x  : 0,
                y  : 0,
                z  : 0
            });
            const ctx = new Ctx('round', 1, '#000000');
            vertex.draw(ctx, {
                radius          : 0,
                labelVisibility : true,
                labelOffset     : {
                    x : 0,
                    y : 0
                }
            });
            ctx.callStack.should.eql([ 'beginPath', 'arc', 'closePath', 'fill', 'stroke', 'strokeText', 'fillText' ]);
        });
    });
});
