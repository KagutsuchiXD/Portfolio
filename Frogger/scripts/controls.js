MyGame.screens['controls'] = (function(game) {
    'use strict';

    let storageControls;

    function newKeyText(string){
        let keyText = string;
        if(keyText === " "){
            keyText = "Space";
        }
        else if(keyText === "ArrowUp"){
            keyText = "&uarr;";
        }
        else if(keyText === "ArrowLeft"){
            keyText = "&larr;";
        }
        else if(keyText === "ArrowRight"){
            keyText = "&rarr;";
        }
        else if(keyText === "ArrowDown"){
            keyText = "&darr;";
        }
        return keyText;
    }

    function initialize() {
        if(localStorage.getItem('controls') == null){
            controls["up"] = 'ArrowUp';
            controls["down"] = 'ArrowDown';
            controls["left"] = 'ArrowLeft';
            controls["right"] = 'ArrowRight';
            localStorage['controls'] = JSON.stringify(controls);
        }
        else{
            storageControls = localStorage.getItem('controls');
            controls = JSON.parse(storageControls);
        }
        document.getElementById("id-forward").innerHTML = newKeyText(controls["up"]) + " : Forward";
        document.getElementById("id-back").innerHTML = newKeyText(controls["down"]) + " : Backward";
        document.getElementById("id-left").innerHTML = newKeyText(controls["left"]) + " : Move Left";
        document.getElementById("id-right").innerHTML = newKeyText(controls["right"]) + " : Move Right";

        function changeUpControl(e){
            controls["up"] = e.key;
            let keyText = newKeyText(controls["up"]);
            document.getElementById("id-forward").innerHTML = keyText + " : Forward";
            localStorage['controls'] = JSON.stringify(controls);
            window.removeEventListener('keydown', changeUpControl);
        }

        function changeDownControl(e){
            controls["down"] = e.key;
            let keyText = newKeyText(controls["down"]);
            document.getElementById("id-back").innerHTML = keyText + " : Backward";
            localStorage['controls'] = JSON.stringify(controls);
            window.removeEventListener('keydown', changeDownControl);
        }

        function changeLeftControl(e){
            controls["left"] = e.key;
            let keyText = newKeyText(controls["left"]);
            document.getElementById("id-left").innerHTML = keyText + " : Move Left";
            localStorage['controls'] = JSON.stringify(controls);
            window.removeEventListener('keydown', changeLeftControl);
        }

        function changeRightControl(e){
            controls["right"] = e.key;
            let keyText = newKeyText(controls["right"]);
            document.getElementById("id-right").innerHTML = keyText + " : Move Right";
            localStorage['controls'] = JSON.stringify(controls);
            window.removeEventListener('keydown', changeRightControl);
        }

        document.getElementById('id-controls-back').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); });

        document.getElementById('id-forward').addEventListener(
            'click',
            function() {
                document.getElementById("id-forward").innerHTML = "Awaiting Input";
                window.addEventListener('keydown', changeUpControl); });

        document.getElementById('id-back').addEventListener(
            'click',
            function() {
                document.getElementById("id-back").innerHTML = "Awaiting Input";
                window.addEventListener('keydown', changeDownControl); });

        document.getElementById('id-left').addEventListener(
            'click',
            function() {
                document.getElementById("id-left").innerHTML = "Awaiting Input";
                window.addEventListener('keydown', changeLeftControl); });

        document.getElementById('id-right').addEventListener(
            'click',
            function() {
                document.getElementById("id-right").innerHTML = "Awaiting Input";
                window.addEventListener('keydown', changeRightControl); });
    }

    function run() {
        MyGame.sounds.game.play();
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));
