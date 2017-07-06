'use strict';

class Ctx {
    constructor (lineCap, lineWidth, strokeStyle) {
        this.lineCap = lineCap;
        this.lineWidth = lineWidth;
        this.strokeStyle = strokeStyle;

        this.callStack = [];
    }

    beginPath () {
        this.callStack.push('beginPath');
        return true;
    }

    closePath () {
        this.callStack.push('closePath');
        return true;
    }

    moveTo (x, y) {
        this.callStack.push('moveTo');
        x;
        y;
        return true;
    }

    lineTo (x, y) {
        this.callStack.push('lineTo');
        x;
        y;
        return true;
    }

    stroke () {
        this.callStack.push('stroke');
        return true;
    }

    strokeText () {
        this.callStack.push('strokeText');
        return true;
    }

    fillText () {
        this.callStack.push('fillText');
        return true;
    }

    fill () {
        this.callStack.push('fill');
        return true;
    }

    arc (x, y, radius, sAngle, eAngle, counterclockwise) {
        this.callStack.push('arc');
        x;
        y;
        radius;
        sAngle;
        eAngle;
        counterclockwise;
        return true;
    }

    createLinearGradient (aX, aY, bX, bY) {
        this.callStack.push('createLinearGradient');
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
