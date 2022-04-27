MyGame.render.Home = (function(graphics, assets) {
    'use strict';

    function render(spec) {
        graphics.drawTexture(assets['home'], spec.center, spec.rotation, spec.size);
        if (spec.occupied){
            graphics.drawTexture(assets['frog'], spec.center, spec.rotation, spec.size);
        }else{
            if(spec.croc){
                graphics.drawTexture(assets['mouth'], spec.center, spec.rotation, spec.size);
            }
            else if(spec.fly){
                graphics.drawTexture(assets['fly'], spec.center, spec.rotation, spec.size);
            }
        }
    }

    return {
        render: render
    };
}(MyGame.graphics, MyGame.assets));