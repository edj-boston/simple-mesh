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

    describe('rotateX()', () => {
        it('should do correct matrix math', () => {
            const mesh = new SimpleMesh(new Ctx, {
                vertices : {
                    'abcde' : { id : 'abcde', x : 1, y : 1, z : 1 }
                }
            });
            mesh.rotateX(100);
            mesh.vertices['abcde'].x.should.eql(1);
            mesh.vertices['abcde'].y.should.eql(-1.1584559306791382);
            mesh.vertices['abcde'].z.should.eql(0.8111595753452777);
        });
    });

    describe('rotateY()', () => {
        it('should do correct matrix math', () => {
            const mesh = new SimpleMesh(new Ctx, {
                vertices : {
                    'fghij' : { id : 'fghij', x : 2, y : 2, z : 2 }
                }
            });
            mesh.rotateY(100);
            mesh.vertices['fghij'].x.should.eql(-2.3169118613582764);
            mesh.vertices['fghij'].y.should.eql(2);
            mesh.vertices['fghij'].z.should.eql(1.6223191506905554);
        });
    });

    describe('rotateX()', () => {
        it('should do correct matrix math', () => {
            const mesh = new SimpleMesh(new Ctx, {
                vertices : {
                    'klmno' : { id : 'klmno', x : 3, y : 3, z : 3 }
                }
            });
            mesh.rotateZ(100);
            mesh.vertices['klmno'].x.should.eql(-3.4753677920374146);
            mesh.vertices['klmno'].y.should.eql(2.4334787260358333);
            mesh.vertices['klmno'].z.should.eql(3);
        });
    });

    describe('reset()', () => {
        it('should return the `x`, `y`, and `z` properties of each vertex to their original state', () => {
            const mesh = new SimpleMesh(new Ctx, {
                vertices : {
                    'abcde' : { id : 'abcde', x : 3, y : 3, z : 3, oX : 3, oY : 3, oZ : 3 }
                }
            });
            mesh.rotateX(100);
            mesh.vertices['abcde'].x.should.eql(3);
            mesh.vertices['abcde'].y.should.eql(-3.4753677920374146);
            mesh.vertices['abcde'].z.should.eql(2.4334787260358333);
            mesh.reset();
            mesh.vertices['abcde'].x.should.eql(3);
            mesh.vertices['abcde'].y.should.eql(3);
            mesh.vertices['abcde'].z.should.eql(3);
        });
    });

    describe('scale()', () => {
        it('should alter the `x`, `y`, and `z` properties of each vertex', () => {
            const mesh = new SimpleMesh(new Ctx, {
                vertices : {
                    'abcde' : { id : 'abcde', x : 3, y : 3, z : 3 }
                }
            });
            const vertex = mesh.vertices['abcde'];
            vertex.x.should.eql(3);
            vertex.y.should.eql(3);
            vertex.z.should.eql(3);
            mesh.scale(100);
            vertex.x.should.eql(300);
            vertex.y.should.eql(300);
            vertex.z.should.eql(300);
        });
    });

    describe('translate()', () => {
        it('should alter the `x`, `y`, and `z` properties of each vertex', () => {
            const mesh = new SimpleMesh(new Ctx, {
                vertices : {
                    'abcde' : { id : 'abcde', x : 3, y : 3, z : 3 }
                }
            });
            const vertex = mesh.vertices['abcde'];
            vertex.x.should.eql(3);
            vertex.y.should.eql(3);
            vertex.z.should.eql(3);
            mesh.translate({ x : 25, y : 25, z : 25 });
            vertex.x.should.eql(28);
            vertex.y.should.eql(-28);
            vertex.z.should.eql(28);
        });
    });

    describe('rotate()', () => {
        const mesh = new SimpleMesh(new Ctx, {
            vertices : {
                'pqrst' : { id : 'pqrst', x : 3, y : 3, z : 3 }
            }
        });

        it('should validate the arguments', () => {
            (function () {
                mesh.rotate('a', 'y', 100);
            }).should.throw('Axis A must be one of x, y, or z');

            (function () {
                mesh.rotate('x', 'b', 100);
            }).should.throw('Axis B must be one of x, y, or z');

            (function () {
                mesh.rotate('x', 'y', false);
            }).should.throw('Theta must be numeric');
        });
    });

    describe('generateUniqueId()', () => {
        it('should generate 5-character alphanumeric id\'s', () => {
            const mesh = new SimpleMesh(new Ctx, {});
            mesh.generateUniqueId().should.match(/^[a-zA-Z0-9]{5}$/);
        });
    });
});
