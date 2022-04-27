MyGame.input.Keyboard = function () {
    let that = {
        keys: {},
        handlers: {},
        keyPressed: false
    };

    function keyPress(e) {
        if(that.keyPressed === false){
            that.keys[e.key] = e.timeStamp;
        }
    }

    function keyRelease(e) {
        delete that.keys[e.key];
        that.keyPressed = false;
    }

    that.update = function (elapsedTime, spec) {
        for (let key in that.keys) {
            if (that.keys.hasOwnProperty(key) && that.keyPressed === false) {
                if (that.handlers[key]) {
                    that.handlers[key](elapsedTime, spec);
                    that.keyPressed = true;
                }
            }
        }
    };

    that.register = function (key, handler) {
        that.handlers[key] = handler;
    };

    window.addEventListener('keydown', keyPress);
    window.addEventListener('keyup', keyRelease);

    return that;
};