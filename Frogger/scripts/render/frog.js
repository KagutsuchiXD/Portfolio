MyGame.render.Frog = (function(graphics, assets) {
    'use strict';

    function render(spec) {
        graphics.drawTexture(assets['frog'], spec.center, spec.rotation, spec.size);
    }

    return {
        render: render
    };
}(MyGame.graphics, MyGame.assets));