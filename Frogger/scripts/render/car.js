MyGame.render.Car = (function(graphics) {
    'use strict';

    function render(spec) {
        graphics.drawStaticMover(spec.image, spec.center, spec.rotation, spec.size);
    }

    return {
        render: render
    };
}(MyGame.graphics));