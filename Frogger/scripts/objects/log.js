MyGame.objects.Log = function (spec){

    function update(elapsedTime){
        // Create a normalized direction vector
        let vectorX = Math.cos(spec.rotation);
        let vectorY = Math.sin(spec.rotation);
        //
        // With the normalized direction vector, move the center of the sprite
        spec.center.x += (vectorX * spec.moveRate * elapsedTime);
        spec.center.y += (vectorY * spec.moveRate * elapsedTime);
        if(spec.center.x >= 15 * spec.size.height){
            spec.center.x = -spec.size.width;
        }
    }

    let api = {
        get image() {return spec.image;},
        get size() { return spec.size; },
        get center() { return spec.center; },
        get rotation() { return spec.rotation; },
        get moveRate() {return spec.moveRate},
        update: update,

    };

    return api;
};