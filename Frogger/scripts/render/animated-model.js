// Renders an animated model based on a spritesheet.
MyGame.render.AnimatedModel = function(spec, graphics) {
    'use strict';
    let animationTime = 0;
    let subImageIndex = 0;
    let subTextureWidth = spec.spriteSheet.width / spec.spriteCount;

    // Update the state of the animation
    function update(elapsedTime) {
        animationTime += elapsedTime;
        // Check to see if we should update the animation frame
        if (animationTime >= spec.spriteTime[subImageIndex]) {
            // When switching sprites, keep the leftover time because
            // it needs to be accounted for the next sprite animation frame.
            animationTime -= spec.spriteTime[subImageIndex];
            subImageIndex += 1;
            // Wrap around from the last back to the first sprite as needed
            subImageIndex = subImageIndex % spec.spriteCount;
        }
    }
    // Render the specific sub-texture animation frame
    function render(model) {
        graphics.drawSubTexture(spec.spriteSheet, subImageIndex, subTextureWidth, model.center, model.rotation, model.size);
    }

    let api = {
        update: update,
        render: render
    };

    return api;
};
