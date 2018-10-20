/**
 * This class handles touch input on a canvas, and processes gestures.
 */
class touchpad {
    /**
     * Gets the canvas associated with the trackpad and normalizes it to prepare it for use.
     * Also creates a context and prepares variables for tracking.
     * @param {string} id - index of the canvas element
     */
    constructor (id) {
        //Minimum pixels that need to be moves to acknowledge an event
        this.gestureThreshold = 25;


        this.touchArea = document.getElementById(id);

        // Update canvas bounds and set the internal resolution to match it's size to make drawing work
        const touchPadBounds = this.touchArea.getBoundingClientRect();
        this.touchArea.width = touchPadBounds.width;
        this.touchArea.height = touchPadBounds.height;

        // Touch offset
        this.offSetX = touchPadBounds.x;
        this.offSetY = touchPadBounds.y;

        // Get drawing Context
        this.ctx = this.touchArea.getContext('2d');

        // Total tracking
        this.gesutureStart = [];
        this.gesutureEnd = [];
    };

    /**
     * Debugs touch input by drawing dots on the screen
     * @param {TouchEvent} event
     */
    touchDebug(event) {
        var colour = ["#ff0000", '#00ff00', '#0000ff', '#ff00ff'];
        for (var i = 0; i < event.touches.length; i++) {
            var touch = event.touches[i];
            this.ctx.beginPath();
            this.ctx.arc(touch.pageX - this.offSetX, touch.pageY - this.offSetY, 5, 0, 2 * Math.PI, true);
            this.ctx.strokeStyle = colour[touch.identifier];
            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    /**
     * Function that processes the start and end of touch events
     * @param {TouchEvent} event
     */
    touchStart (event) {

        // Use the event's data to call out to the appropriate gesture handlers
        switch (event.touches.length) {
            // since a 2 finger start will be after a 1 finger 1 we need to track ti
            case 2:
                // Overwrites and startes prepping for two finger input
                this.gesutureStart = event.touches;
                break;
            case 1:
                this.gesutureStart = event.touches;
                break;
        }
    };

    /**
     * Function that tracks a fingers progresson
     * @param {TouchEvent} event
     */
    touchEnd (event) {
        // Use the event's data to call out to the appropriate gesture handlers
        switch (event.touches.length) {
            // If one finger on this event then there used to be two fingers, 0 means there was 1
            case 1, 0:
                // Since there will be a `0` event occur after the `1 finger` event. we use `gesutureStart` to identify
                if (this.gesutureStart.length > 0) {
                    this.dispatchGestureEvent(this.calculateGesture(this.gestureThreshold));
                }
        }
    };


    /**
     * Function that tracks when a finger is removed
     * @param {TouchEvent} event
     */
    touchMove (event) {
        // Use the event's data to track the current gesture movement
        this.gesutureEnd = event.touches;
    };


    /**
     * Function that uses the tracked data to calculate the type of gesture that was completed
     * @param {number} threshold - the point at which a tap is differentiated from a gesture
     * @return {{fingers: number, direction: string}} - the number of fingers and the gesture
     */
    calculateGesture(threshold) {
        var gesture = {
            fingers: 0,
            direction: "touch"
        };
        switch(this.gesutureStart.length) {
            case 2:
                gesture.fingers = 2;
                break;
            case 1:
                gesture.fingers = 1;
                break;
        }

        // Calculate total movement in the x and y, and normalize the finger positions
        var xDist = [];
        var yDist = [];

        var xAvgDist = 0;
        var yAvgDist = 0;

        if (this.gesutureEnd.length > 0) {
            for (var i = 0; i < gesture.fingers; i++) {
                xDist[i] = this.gesutureStart[i].clientX - this.gesutureEnd[i].clientX;
                xDist[i] = Math.abs(xDist[i]) < threshold ? 0 : xDist[i];
                xAvgDist += xDist[i];
                yDist[i] = this.gesutureStart[i].clientY - this.gesutureEnd[i].clientY;
                yDist[i] = Math.abs(yDist[i]) < threshold ? 0 : yDist[i];
                yAvgDist += yDist[i];
            }
        }

        xAvgDist = xAvgDist/gesture.fingers;
        yAvgDist = yAvgDist/gesture.fingers;

        if (Math.abs(xAvgDist) < threshold && Math.abs(yAvgDist) < threshold) {
            gesture.direction = "TOUCH";
        } else if (Math.abs(xAvgDist) < Math.abs(yAvgDist)) {
            gesture.direction = yAvgDist > 0 ? "UP" : "DOWN";
        } else {
            gesture.direction = xAvgDist > 0 ? "LEFT" : "RIGHT";
        }

        //Clear the current gesture info
        this.gesutureStart = [];
        this.gesutureEnd = [];

        return gesture;
    }

    /**
     * Dispactes a gesture event
     * @param {{fingers: number, direction: string}} gesture
     * @param {boolean} state - true = start, false = end
     */
    dispatchGestureEvent(gesture) {
        dispatchEvent(new CustomEvent('gestureEnded', {detail: gesture}));
    }
}

document.addEventListener("DOMContentLoaded", function() {
    var canvas = new touchpad("touchpad-canvas");

    canvas.touchArea.addEventListener('touchstart', function (event) {
        canvas.touchStart(event);
        canvas.touchDebug(event);
    }, false);


    canvas.touchArea.addEventListener('touchmove', function (event) {
        canvas.touchMove(event);
        canvas.touchDebug(event);
    }, false);


    canvas.touchArea.addEventListener('touchend', function (event) {
        canvas.touchEnd(event);
        canvas.touchDebug(event);
    }, false);
});