'use strict';

class Ctx {
    constructor (lineCap, lineWidth, strokeStyle) {
        this.lineCap = lineCap;
        this.lineWidth = lineWidth;
        this.strokeStyle = strokeStyle;

        this.functionsCalled = [];
    }

    beginPath () {
        this.functionsCalled.push('beginPath');
        return true;
    }

    closePath () {
        this.functionsCalled.push('closePath');
        return true;
    }

    moveTo (x, y) {
        this.functionsCalled.push('moveTo');
        x;
        y;
        return true;
    }

    lineTo (x, y) {
        this.functionsCalled.push('lineTo');
        x;
        y;
        return true;
    }

    stroke () {
        this.functionsCalled.push('stroke');
        return true;
    }

    fill () {
        this.functionsCalled.push('fill');
        return true;
    }

    createLinearGradient (aX, aY, bX, bY) {
        this.functionsCalled.push('createLinearGradient');
        aX;
        aY;
        bX;
        bY;
        return {
            addColorStop : (num, string) => {
                num;
                string;
                return true;
            }
        };
    }
}

module.exports = Ctx;
