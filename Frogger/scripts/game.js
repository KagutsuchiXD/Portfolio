MyGame.game = (function(screens, assets){
    'use strict';
    MyGame.sounds.game = assets['theme'];
    MyGame.sounds.game.loop = true;
    MyGame.sounds.win = assets['win'];
    MyGame.sounds.hop = assets['hop'];
    MyGame.sounds.coin = assets['coin'];
    MyGame.sounds.plunk = assets['plunk'];
    MyGame.sounds.squash = assets['squash'];
    MyGame.sounds.sparkler = assets['sparklers'];

    function showScreen(id) {
        let active = document.getElementsByClassName('active');
        for (let screen = 0; screen < active.length; screen++) {
            active[screen].classList.remove('active');
        }

        screens[id].run();

        document.getElementById(id).classList.add('active');
    }

    function initialize() {
        let screen = null;

        for (screen in screens) {
            if (screens.hasOwnProperty(screen)) {
                screens[screen].initialize();
            }
        }

        showScreen('main-menu');
    }

    return {
        initialize : initialize,
        showScreen : showScreen
    };
}(MyGame.screens, MyGame.assets));