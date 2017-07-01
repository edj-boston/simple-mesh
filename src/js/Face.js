'use strict';

class Face { // eslint-disable-line no-unused-vars
    construct (opts) {
        this.vertices = opts.vertices;
        this.fillStyle = opts.fillStyle;
    }

    draw (ctx, style, origin) {
        // Plot the shape
        let first = true;
        ctx.beginPath();
        for (id in this.vertices) {
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
