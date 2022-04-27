MyGame.graphics = (function(assets) {
    'use strict';

    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');
    let blockSize = canvas.width / 15;

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawTexture(image, center, rotation, size) {
        context.save();

        context.translate(center.x , center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            center.x - size.width / 2,
            center.y - size.height / 2,
            size.width, size.height);

        context.restore();
    }

    function drawStaticMover(image, center, rotation, size) {
        context.save();

        context.drawImage(
            image,
            center.x,
            center.y,
            size.width, size.height);

        context.restore();
    }

    function drawSubTexture(image, index, subTextureWidth, center, rotation, size) {
        context.save();

        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        //
        // Pick the selected sprite from the sprite sheet to render
        context.drawImage(
            image,
            subTextureWidth * index, 0,      // Which sub-texture to pick out
            subTextureWidth, image.height,   // The size of the sub-texture
            center.x - size.height / 2,           // Where to draw the sub-texture
            center.y - size.height / 2,
            size.width, size.height);

        context.restore();
    }

    function drawMap(){
        context.save();
        for (let x = 0; x < 15; x++){
            for (let y = 1; y < 14; y++){
                if (y === 1){
                    context.drawImage(assets['hedge'], (x) * blockSize, (y) * blockSize, blockSize, blockSize);
                }
                else if(y === 7 || y === 13){
                    context.drawImage(assets['grass'], (x) * blockSize, (y) * blockSize, blockSize, blockSize);
                }
                else if(y < 7){
                    context.drawImage(assets['water'], (x) * blockSize, (y) * blockSize, blockSize, blockSize);
                }
                else if(y < 13){
                    context.drawImage(assets['road'], (x) * blockSize, (y) * blockSize, blockSize, blockSize);
                }
            }
        }
        context.restore();
    }

    function drawLives(lives){
        if (lives > 0){
            context.drawImage(assets['frog'], 14 * blockSize, 14 * blockSize, blockSize, blockSize);
        }
        if (lives > 1){
            context.drawImage(assets['frog'], 13 * blockSize, 14 * blockSize, blockSize, blockSize);
        }
        if (lives > 2){
            context.drawImage(assets['frog'], 12 * blockSize, 14 * blockSize, blockSize, blockSize);
        }
        if (lives > 3){
            context.drawImage(assets['frog'], 11 * blockSize, 14 * blockSize, blockSize, blockSize);
        }
        if (lives > 4){
            context.drawImage(assets['frog'], 10 * blockSize, 14 * blockSize, blockSize, blockSize);
        }
    }

    function drawTime(timer){
        context.save();
        context.font = '50pt Arial';
        context.fillStyle = 'rgba(0, 255, 0, 1)';
        context.strokeStyle = 'rgba(255, 255, 255, 1)';
        context.textBaseline = 'top';
        context.fillText("Time:", 0, 14 * blockSize);
        context.strokeText("Time:", 0, 14 * blockSize);

        context.fillRect(3 * blockSize,14 * blockSize, timer * blockSize / 10, blockSize);
        context.restore();
    }

    function drawText(spec) {
        let output;
        if(spec.units === ""){
            output = spec.text;
        }
        else{
            output = spec.text + spec.value + spec.units;
        }
        context.save();

        context.font = spec.font;
        context.fillStyle = spec.fillStyle;
        context.strokeStyle = spec.strokeStyle;
        context.textBaseline = 'top';
        context.fillText(output, spec.position.x, spec.position.y);
        context.strokeText(output, spec.position.x, spec.position.y);

        context.restore();
    }

    let api = {
        get canvas() { return canvas; },
        get blockSize() {return blockSize;},
        clear: clear,
        drawTexture: drawTexture,
        drawStaticMover: drawStaticMover,
        drawText: drawText,
        drawMap: drawMap,
        drawTime: drawTime,
        drawLives: drawLives,
        drawSubTexture: drawSubTexture
    };

    return api;
}(MyGame.assets));