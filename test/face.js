'use strict';

const Ctx = require('../lib/mockCtx'),
    Face = require('../src/Face');

describe('Face', () => {
    it('should throw an error if no opts argument is passed', () => {
        (function () {
            new Face();
        }).should.throw('You must pass an `opts` argument to the Face constructor');
    });

    it('should throw an error if no `id` option is passed', () => {
        (function () {
            new Face({});
        }).should.throw('You must pass an `id` option to the Face constructor');
    });

    it('should throw an error if no `vertices` option is passed', () => {
        (function () {
            new Face({
                id : 'abcde'
            });
        }).should.throw('You must pass a `vertices` option to the Face constructor');
    });

    it('should convert options into properties', () => {
        const face = new Face({
            id       : 'abcde',
            vertices : { foo : 'bar' }
        });
        face.id.should.equal('abcde');
        face.vertices.should.deepEqual({ foo : 'bar' });
    });

    it('should convert the optional `fillStyle` option into a property', () => {
        const face = new Face({
            id        : 'abcde',
            vertices  : { foo : 'bar' },
            fillStyle : '#000000'
        });
        face.fillStyle.should.equal('#000000');
    });

    describe('draw()', () => {
        it('should call specific methods', () => {
            const face = new Face({
                id       : 'abcde',
                vertices : {
                    'fghik' : { id : 'fghij' },
                    'klmno' : { id : 'klmno' }
                },
                fillStyle : origin => {
                    origin;
                    return true;
                }
            });
            const ctx = new Ctx('round', 1, '#000000');
            face.draw(ctx, {
                lineCap     : 'butt',
                lineWidth   : 2,
                strokeStyle : '#ffffff'
            }, false);
            ctx.functionsCalled.should.containEql('beginPath', 'moveTo', 'lineTo', 'closePath', 'fill');
        });

        it('should use style.fillStyle if the object does not have it\'s own', () => {
            const face = new Face({
                id       : 'abcde',
                vertices : {
                    'fghik' : { id : 'fghij' },
                    'klmno' : { id : 'klmno' }
                }
            });
            const ctx = new Ctx('round', 1, '#000000');
            face.draw(ctx, {
                lineCap     : 'butt',
                lineWidth   : 2,
                strokeStyle : '#ffffff',
                fillStyle   : '#000000'
            }, false);
            ctx.functionsCalled.should.containEql('beginPath', 'moveTo', 'lineTo', 'closePath', 'fill');
        });
    });
});
