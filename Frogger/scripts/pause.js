MyGame.screens['pause'] = (function(game) {
    'use strict';

    function initialize() {
        document.getElementById('id-continue').addEventListener(
            'click',
            function() { game.showScreen('game-play'); });

        document.getElementById('id-quit').addEventListener(
            'click',
            function() {
                MyGame.screens['game-play'].saveScore();
                game.showScreen('main-menu'); });
    }

    function run() {
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));