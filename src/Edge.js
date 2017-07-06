'use strict';

class Edge { // eslint-disable-line no-unused-vars
    constructor (opts) {
        if (opts == undefined) throw new Error('You must pass an `opts` argument to the Edge constructor');
        if (!opts.id) throw new Error('You must pass an `id` option to the Edge constructor');
        if (!opts.a) throw new Error('You must pass an `a` option to the Edge constructor');
        if (!opts.b) throw new Error('You must pass an `b` option to the Edge constructor');

        this.id = opts.id;
        this.a = opts.a;
        this.b = opts.b;
    }

    draw (ctx, style, fog) {
        ctx.beginPath();
        ctx.moveTo(this.a.x, this.a.y);
        ctx.lineTo(this.b.x, this.b.y);

        ctx.lineCap = style.lineCap;
        ctx.lineWidth = style.lineWidth;
        ctx.strokeStyle = style.strokeStyle
        ctx.stroke();

        // Calculate the z-index fog
        if (fog) {
            const grad = ctx.createLinearGradient(this.a.x, this.a.y, this.b.x, this.b.y);
            grad.addColorStop(0, this.generateRgbZ(this.a.z));
            grad.addColorStop(1, this.generateRgbZ(this.b.z));
            ctx.strokeStyle = grad;
            ctx.stroke();
        }
    }

    /* Helper to build an RBG string based on z-index */
    generateRgbZ (z) {
        const r = Math.round(100 + (z * 0.5));
        const g = Math.round(100 + (z * 0.5));
        const b = Math.round(100 + (z * 0.5));

        return `rgb(${r}, ${g}, ${b})`;
    }
}

// Export on server only
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Edge;
}
