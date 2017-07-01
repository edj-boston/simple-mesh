'use strict';

class Edge { // eslint-disable-line no-unused-vars
    construct (opts) {
        this.a = opts.a;
        this.b = opts.b;
    }

    draw (ctx, style, fog) {
        // Plot the line
        ctx.beginPath();
        ctx.moveTo(this.a.x, this.a.y);
        ctx.lineTo(this.b.x, this.b.y);
        ctx.moveTo(0, 0); // Hack so lineCap works
        ctx.closePath();

        ctx.lineCap = style.lineCap;
        ctx.lineWidth = style.lineWidth;
        if (ctx.strokeStyle = style.strokeStyle) ctx.stroke();

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
