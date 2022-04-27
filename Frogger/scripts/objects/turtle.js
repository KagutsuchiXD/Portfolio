MyGame.objects.Turtle = function (spec){

    function update(elapsedTime){
        // Create a normalized direction vector
        let vectorX = Math.cos(spec.rotation);
        let vectorY = Math.sin(spec.rotation);
        //
        // With the normalized direction vector, move the center of the sprite
        spec.center.x += (vectorX * spec.moveRate * elapsedTime);
        spec.center.y += (vectorY * spec.moveRate * elapsedTime);
        if (spec.center.x <= -spec.size.width){
            spec.center.x = 15 * spec.size.height;
        }
        if(spec.sinker === true){
            spec.submerged = false;
            spec.timer += elapsedTime;
            if(spec.timer >= 3500 && spec.timer <= 4500){
                spec.submerged = true;
            }
            else{
                if(spec.timer >= 4500){
                    spec.timer = 0;
                }
                if(spec.timer > 2500){
                    spec.sinking = true;
                }
                else{
                    spec.sinking = false;
                }
            }
        }
    }

    let api = {
        get size() { return spec.size; },
        get center() { return spec.center; },
        get rotation() { return spec.rotation; },
        get moveRate() {return spec.moveRate},
        get sinker() {return spec.sinker},
        get submerged() {return spec.submerged},
        get sinking() {return spec.sinking;},
        update: update,

    };

    return api;
};