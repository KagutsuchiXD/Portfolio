MyGame.screens['main-menu'] = (function(game) {
    'use strict';
    let stop = false;

    function initialize() {
        document.getElementById('id-new-game').addEventListener(
            'click',
            function() {
                stop = true;
                MyGame.sounds.coin.play();
                MyGame.screens['game-play'].aiOn = false;
                game.showScreen('game-play');});

        document.getElementById('id-high-scores').addEventListener(
            'click',
            function() {
                stop = true;
                game.showScreen('high-scores');
            });

        document.getElementById('id-controls').addEventListener(
            'click',
            function() {
                stop = true;
                game.showScreen('controls');
            });

        document.getElementById('id-about').addEventListener(
            'click',
            function() {
                stop = true;
                game.showScreen('about');
            });
    }

    function run() {
        MyGame.sounds.game.play();
        stop = false;
        let timeLeft = 10;
        let timer = setInterval(function(){
            if (!stop){
                if(timeLeft === 0){
                    clearInterval(timer);
                    MyGame.screens['game-play'].aiOn = true;
                    game.showScreen('game-play');
                }
                timeLeft -= 1;
            }
            else{
                clearInterval(timer);
            }
        }, 1000);
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));