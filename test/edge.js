'use strict';

const Ctx = require('../lib/mockCtx'),
    Edge = require('../src/Edge');

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

    it('should throw an error if no `a` vertex is passed', () => {
        (function () {
            new Edge({
                id : 'abcde'
            });
        }).should.throw('You must pass an `a` option to the Edge constructor');
    });

    it('should throw an error if no `b` vertex is passed', () => {
        (function () {
            new Edge({
                id : 'abcde',
                a  : { id : 'fghik' }
            });
        }).should.throw('You must pass an `b` option to the Edge constructor');
    });

    it('should convert opts into properties', () => {
        const edge = new Edge({
            id : 'abcde',
            a  : { id : 'fghik' },
            b  : { id : 'lmnop' }
        });
        edge.id.should.equal('abcde');
        edge.a.id.should.equal('fghik');
        edge.b.id.should.equal('lmnop');
    });

    describe('draw()', () => {
        it('should call specific methods', () => {
            const edge = new Edge({
                id : 'abcde',
                a  : { id : 'fghik' },
                b  : { id : 'lmnop' }
            });
            const ctx = new Ctx('round', 1, '#000000');
            edge.draw(ctx, {
                lineCap     : 'butt',
                lineWidth   : 2,
                strokeStyle : '#ffffff'
            }, false);
            ctx.functionsCalled.should.containEql('beginPath', 'moveTo', 'lineTo', 'stroke');
        });

        it('should call additional methods for fog', () => {
            const edge = new Edge({
                id : 'abcde',
                a  : { id : 'fghik' },
                b  : { id : 'lmnop' }
            });
            const ctx = new Ctx('round', 1, '#000000');
            edge.draw(ctx, {
                lineCap     : 'butt',
                lineWidth   : 2,
                strokeStyle : '#ffffff'
            }, true);
            ctx.functionsCalled.should.containEql('beginPath', 'moveTo', 'lineTo', 'stroke', 'createLinearGradient');
        });
    });

    describe('generateRgbZ()', () => {
        it('should return a valid string string calculated from the `z` value', () => {
            const edge = new Edge({
                id : 'abcde',
                a  : { id : 'fghik' },
                b  : { id : 'lmnop' }
            });
            edge.generateRgbZ(100).should.equal('rgb(150, 150, 150)');
        });
    });
});
