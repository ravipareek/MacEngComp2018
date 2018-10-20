/**
 * This class handles touch input on a canvas, and processes gestures.
 */
class keyboard {
    /**
     * Gets the canvas associated with the trackpad and normalizes it to prepare it for use.
     * Also creates a context and prepares variables for tracking.
     * @param {string} id - index of the canvas element
     */
    constructor () {

        //state
        // 0 means selecting row/columns
        // 1 means selecting letter
        window.state = 0;
        window.row = 0;
        window.col = 0;
        window.tap = 0;


        //Letter data

        window.keys = [];
        window.keys[0] = [];
        window.keys[0][0] = ['a', 'b', 'c', '1'];
        window.keys[0][1] = ['d', 'e', 'f', '2'];
        window.keys[0][2] = ['g', 'h', 'i', '3'];

        window.keys[1] = [];
        window.keys[1][0] = ['j', 'k', 'l', '4'];
        window.keys[1][1] = ['m', 'n', 'o', '5'];
        window.keys[1][2] = ['p', 'q', 'r', '6'];

        window.keys[2] = [];
        window.keys[2][0] = ['s', 't', 'u', '7'];
        window.keys[2][1] = ['v', 'w', 'x', '8'];
        window.keys[2][2] = ['y', 'z', '9', '0'];
        console.log(this.keys)

        window.dispatchLetter = () => {

            var item = {
                type: 'letter',
                data: window.keys[window.row][window.col][window.tap]
            };
console.log('hi')

            dispatchEvent(new CustomEvent('gesture-complete', {detail: item}));
        }

        window.dispatchEnd = (term) => {

            var item = {
                type: 'gesture',
                data: term
            };

            dispatchEvent(new CustomEvent('gesture-complete', {detail: item}));
        }
    };

    /**
     *  Process gesture input
     * @param {{fingers: number, direction: string}} gestureEvent
     */
    gestureStart(gestureEvent) {
        window.state = true;
    };

    /**
     *  Process gesture input
     * @param {{fingers: number, direction: string}} gestureEvent
     */
    gestureEnd(gestureEvent) {
        var detail = gestureEvent.detail;
        if (detail.fingers === 1) {
            if (detail.direction === "RIGHT") {
                if (window.state === 0) {
                    window.col++;
                    if (window.col > 2)
                        window.col = 2;
                } else if (window.state === 1) {
                    this.dispatchLetter();
                    window.row = 0;
                    window.col = 0;
                    window.tap = 0;
                    window.state = 0
                }
            } else  if (detail.direction === "LEFT") {
                    if (window.state === 0) {
                        window.dispatchEnd('back');
                        window.row = 0;
                        window.col = 0;
                        window.tap = 0;
                        window.state = 0
                    } else {
                        window.row = 0;
                        window.col = 0;
                        window.tap = 0;
                        window.state = 0
                    }
            } else  if (detail.direction === "UP") {
                    window.dispatchEnd('submit');
                    window.row = 0;
                    window.col = 0;
                    window.tap = 0;
                    window.state = 0

            } else  if (detail.direction === "DOWN") {
                if (window.state === 0) {
                    window.row++;
                    if (window.row > 2)
                        row = 2;
                } else if (window.state === 1) {
                    this.dispatchLetter();
                    window.row = 0;
                    window.col = 0;
                    window.tap = 0;
                    window.state = 0
                }
            } else  if (detail.direction === "TOUCH") {
                if (window.state === 0) {
                    window.state = 1;
                } else if (window.state === 1) {
                    window.tap++;
                    if (window.tap > 3) {
                        window.tap = 0;
                    }
                }
            }
        } else {
            if (detail.direction === "LEFT") {
                window.dispatchEnd('delete');
                window.row = 0;
                window.col = 0;
                window.tap = 0;
                window.state = 0
            } else if (detail.direction == "UP") {
                window.dispatchEnd('done');
                window.row = 0;
                window.col = 0;
                window.tap = 0;
                window.state = 0
        }
        }
        console.log(detail.direction)
        console.log(window.state);
        console.log(window.keys[window.row][window.col][window.tap])
    };



}
var a = new keyboard();


addEventListener('gestureStarted', a.gestureStart);
addEventListener('gestureEnded', a.gestureEnd);
