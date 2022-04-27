MyGame.objects.Frog = function(spec){
    spec.alive = true;

    function moveForward(elapsedTime){
        if (spec.center.y >= 2 * spec.size.width){
            spec.center.y -= 1 * spec.size.width;
        }
        spec.rotation = Math.PI;
    }

    function moveBack(elapsedTime){
        if (spec.center.y < 13 * spec.size.width){
            spec.center.y += 1 * spec.size.width;
        }
        spec.rotation = 0;
    }

    function moveLeft(elapsedTime){
        if(spec.center.x >= 1 * spec.size.width){
            spec.center.x -= 1 * spec.size.width;
        }
        spec.rotation = Math.PI/2;
    }

    function moveRight(elapsedTime){
        if (spec.center.x < 14 * spec.size.width){
            spec.center.x += 1 * spec.size.width;
        }
        spec.rotation = -Math.PI/2;
    }

    function updatePosition(elapsedTime, rotation, moveRate){
        // Create a normalized direction vector
        let vectorX = Math.cos(rotation);
        let vectorY = Math.sin(rotation);
        //
        // With the normalized direction vector, move the center of the sprite
        spec.center.x += (vectorX * moveRate * elapsedTime);
        spec.center.y += (vectorY * moveRate * elapsedTime);
        if (spec.center.x <= 0){
            MyGame.screens['game-play'].deadFrogger();
        }
        else if(spec.center.x >= 15 * spec.size.height){
            MyGame.screens['game-play'].deadFrogger();
        }
    }

    let api = {
        get size() { return spec.size; },
        get center() { return spec.center; },
        get rotation() { return spec.rotation; },
        get riding() {return spec.riding;},
        updatePosition: updatePosition,
        moveForward: moveForward,
        moveBack: moveBack,
        moveLeft: moveLeft,
        moveRight: moveRight
    };

    return api;
};