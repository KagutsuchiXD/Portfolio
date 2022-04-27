MyGame.objects.Home = function (spec){

    function update(elapsedTime){
        let timing = elapsedTime / 1000;
        if ((Math.round(spec.currentTime + timing)) % 3 === 0){
            spec.fly = true;
        }
        if ((Math.round(spec.currentTime + timing)) % 7 === 0){
            spec.fly = false;
        }
        if ((Math.round(spec.currentTime + timing)) % 8 === 0){
            spec.croc = true;
        }
        if ((Math.round(spec.currentTime + timing)) % 12 === 0){
            spec.croc = false;
        }
        spec.currentTime += timing;
    }

    let api = {
        get size() { return spec.size; },
        get center() { return spec.center; },
        get rotation() { return spec.rotation; },
        get croc() {return spec.croc;},
        get fly() {return spec.fly;},
        get occupied() {return spec.occupied},
        set occupied(val) {spec.occupied = val},
        update: update
    };

    return api;
};