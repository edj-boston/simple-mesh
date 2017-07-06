'use strict';

class Face { // eslint-disable-line no-unused-vars
    constructor (opts) {
        if (opts == undefined) throw new Error('You must pass an `opts` argument to the Face constructor');
        if (!opts.id) throw new Error('You must pass an `id` option to the Face constructor');
        if (!opts.vertices) throw new Error('You must pass a `vertices` option to the Face constructor');

        this.id = opts.id;
        this.vertices = opts.vertices;
        if (opts.fillStyle) this.fillStyle = opts.fillStyle;
    }

    draw (ctx, style, origin) {
        // Plot the shape
        let first = true;
        ctx.beginPath();
        for (const id in this.vertices) {
            const vertex = this.vertices[id];
            if (first) {
                ctx.moveTo(vertex.x, vertex.y);
                first = false;
            } else {
                ctx.lineTo(vertex.x, vertex.y);
            }
        }
        ctx.closePath();

        // Paint the face
        if (this.fillStyle) {
            ctx.fillStyle = this.fillStyle(origin);
        } else {
            ctx.fillStyle = style.fillStyle;
        }
        ctx.fill();
    }
}

// Export on server only
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Face;
}
