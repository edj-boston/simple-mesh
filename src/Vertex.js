'use strict';

class Vertex { // eslint-disable-line no-unused-vars
    constructor (opts) {
        if (opts == undefined) throw new Error('You must pass an `opts` argument to the Vertex constructor');
        if (opts.hasOwnProperty('id') == false) throw new Error('`id` is required');
        if (opts.hasOwnProperty('x') == false) throw new Error('`x` is required');
        if (opts.hasOwnProperty('y') == false) throw new Error('`y` is required');
        if (opts.hasOwnProperty('z') == false) throw new Error('`z` is required');

        this.id = opts.id;
        this.oX = opts.x;
        this.oY = opts.y;
        this.oZ = opts.z;
        this.x = opts.x;
        this.y = opts.y;
        this.z = opts.z;
    }

    draw (ctx, style) {
        // Draw the circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, style.radius, 0, 2 * Math.PI, false);
        ctx.closePath();

        // Style the circle
        ctx.lineWidth = style.lineWidth;
        if (ctx.fillStyle = style.fillStyle) ctx.fill();
        if (ctx.strokeStyle = style.strokeStyle) ctx.stroke();

        // Draw the label
        if (style.labelVisibility) {
            const x = this.x + style.labelOffset.x;
            const y = this.y - style.labelOffset.y;

            ctx.lineWidth = style.labelLineWidth;
            if (ctx.strokeStyle = style.labelStrokeStyle) ctx.strokeText(this.id, x, y);

            if (ctx.fillStyle = style.labelFillStyle) ctx.fillText(this.id, x, y);
        }
    }
}

// Export on server only
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Vertex;
}
