let MyGame = {
    screens : {},
    input: {},
    objects: {},
    render: [],
    systems: {},
    assets: {},
    sounds: {}
};
let controls = {
    "up": null,
    "down": null,
    "left": null,
    "right": null
};
let scores = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0
};

//------------------------------------------------------------------
//
// Purpose of this code is to bootstrap (maybe I should use that as the name)
// the rest of the application.  Only this file is specified in the index.html
// file, then the code in this file gets all the other code and assets
// loaded.
//
//------------------------------------------------------------------
MyGame.loader = (function() {
    'use strict';
    let scriptOrder = [{
        scripts: ['random'],
        message: 'Random number generator loaded',
        onComplete: null
    }, {
        scripts: ['systems/particles'],
        message: 'Particle system model loaded',
        onComplete: null
    },{
        scripts: ['objects/car'],
        message: 'Car object loaded',
        onComplete: null
    },{
        scripts: ['objects/croc'],
        message: 'Croc object loaded',
        onComplete: null
    },{
        scripts: ['objects/frog'],
        message: 'Frog object loaded',
        onComplete: null
    },{
        scripts: ['objects/home'],
        message: 'Home object loaded',
        onComplete: null
    },{
        scripts: ['objects/log'],
        message: 'Log object loaded',
        onComplete: null
    },{
        scripts: ['objects/turtle'],
        message: 'Turtle object loaded',
        onComplete: null
    },{
        scripts: ['objects/text'],
        message: 'Text object loaded',
        onComplete: null
    }, {
        scripts: ['render/core'],
        message: 'Rendering core loaded',
        onComplete: null
    }, {
        scripts: ['render/particles'],
        message: 'Particle system renderer loaded',
        onComplete: null
    },{
        scripts: ['render/frog'],
        message: 'Frog renderer loaded',
        onComplete: null
    },{
        scripts: ['render/animated-model'],
        message: 'Animated Model renderer loaded',
        onComplete: null
    },{
        scripts: ['render/text'],
        message: 'Text renderer loaded',
        onComplete: null
    },{
        scripts: ['render/car'],
        message: 'Car renderer loaded',
        onComplete: null
    },{
        scripts: ['render/home'],
        message: 'Home renderer loaded',
        onComplete: null
    },{
        scripts: ['render/log'],
        message: 'Log renderer loaded',
        onComplete: null
    }, {
        scripts: ['game'],
        message: 'Game loop and model loaded',
        onComplete: null
    },{
        scripts: ['about'],
        message: 'About screen loaded',
        onComplete: null
    },{
        scripts: ['controls'],
        message: 'Controls screen loaded',
        onComplete: null
    },{
        scripts: ['input-keyboard'],
        message: 'Key bindings loaded',
        onComplete: null
    },{
        scripts: ['gameplay'],
        message: 'Game play screen loaded',
        onComplete: null
    },{
        scripts: ['highscores'],
        message: 'High scores screen loaded',
        onComplete: null
    },{
        scripts: ['pause'],
        message: 'Paused screen loaded',
        onComplete: null
    },{
        scripts: ['mainmenu'],
        message: 'Menu screen loaded',
        onComplete: null
    }];

    let assetOrder = [{
        key: 'grass',
        source: '/assets/grass.png'
    }, {
        key: 'hedge',
        source: '/assets/hedge.png'
    }, {
        key: 'home',
        source: '/assets/home.png'
    }, {
        key: 'road',
        source: '/assets/road.png'
    }, {
        key: 'water',
        source: '/assets/water.png'
    },{
        key: 'frogs',
        source: '/assets/frog-sprites.png'
    },{
        key: 'croc',
        source: '/assets/croc.png'
    },{
        key: 'frog',
        source: '/assets/frog.png'
    },{
        key: 'turtle',
        source: '/assets/turtle-sprites.png'
    },{
        key: 'sink',
        source: '/assets/sinking-sprites.png'
    },{
        key: 'fly',
        source: '/assets/fly.png'
    },{
        key: 'mouth',
        source: '/assets/mouth.png'
    },{
        key: 'log',
        source: '/assets/log.png'
    },{
        key: 'car1',
        source: '/assets/car1.png'
    },{
        key: 'car2',
        source: '/assets/car2.png'
    },{
        key: 'racer',
        source: '/assets/racer.png'
    },{
        key: 'truck',
        source: '/assets/truck.png'
    },{
        key: 'dozer',
        source: '/assets/doser.png'
    },{
        key: 'spark',
        source: '/assets/spark.png'
    },{
        key: 'chunk',
        source: '/assets/chunk.png'
    },{
        key: 'theme',
        source: '/assets/sounds/theme.mp3'
    },{
        key: 'coin',
        source: '/assets/sounds/coin-in.mp3'
    },{
        key: 'hop',
        source: '/assets/sounds/hop.mp3'
    },{
        key: 'plunk',
        source: '/assets/sounds/plunk.mp3'
    },{
        key: 'squash',
        source: '/assets/sounds/squash.mp3'
    },{
        key: 'win',
        source: '/assets/sounds/win.mp3'
    },{
        key: 'sparklers',
        source: '/assets/sounds/sparklers.mp3'
    }];

    //------------------------------------------------------------------
    //
    // Helper function used to load scripts in the order specified by the
    // 'scripts' parameter.  'scripts' expects an array of objects with
    // the following format...
    //    {
    //        scripts: [script1, script2, ...],
    //        message: 'Console message displayed after loading is complete',
    //        onComplete: function to call when loading is complete, may be null
    //    }
    //
    //------------------------------------------------------------------
    function loadScripts(scripts, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (scripts.length > 0) {
            let entry = scripts[0];
            require(entry.scripts, function() {
                console.log(entry.message);
                if (entry.onComplete) {
                    entry.onComplete();
                }
                scripts.shift();    // Alternatively: scripts.splice(0, 1);
                loadScripts(scripts, onComplete);
            });
        } else {
            onComplete();
        }
    }

    //------------------------------------------------------------------
    //
    // Helper function used to load assets in the order specified by the
    // 'assets' parameter.  'assets' expects an array of objects with
    // the following format...
    //    {
    //        key: 'asset-1',
    //        source: 'asset/.../asset.png'
    //    }
    //
    // onSuccess is invoked per asset as: onSuccess(key, asset)
    // onError is invoked per asset as: onError(error)
    // onComplete is invoked once per 'assets' array as: onComplete()
    //
    //------------------------------------------------------------------
    function loadAssets(assets, onSuccess, onError, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (assets.length > 0) {
            let entry = assets[0];
            loadAsset(entry.source,
                function(asset) {
                    onSuccess(entry, asset);
                    assets.shift();    // Alternatively: assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                },
                function(error) {
                    onError(error);
                    assets.shift();    // Alternatively: assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                });
        } else {
            onComplete();
        }
    }

    //------------------------------------------------------------------
    //
    // This function is used to asynchronously load image and audio assets.
    // On success the asset is provided through the onSuccess callback.
    // Reference: http://www.html5rocks.com/en/tutorials/file/xhr2/
    //
    //------------------------------------------------------------------
    function loadAsset(source, onSuccess, onError) {
        let xhr = new XMLHttpRequest();
        let fileExtension = source.substr(source.lastIndexOf('.') + 1);    // Source: http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript

        if (fileExtension) {
            xhr.open('GET', source, true);
            xhr.responseType = 'blob';

            xhr.onload = function() {
                let asset = null;
                if (xhr.status === 200) {
                    if (fileExtension === 'png' || fileExtension === 'jpg') {
                        asset = new Image();
                    } else if (fileExtension === 'mp3') {
                        asset = new Audio();
                    } else {
                        if (onError) { onError('Unknown file extension: ' + fileExtension); }
                    }
                    asset.onload = function() {
                        window.URL.revokeObjectURL(asset.src);
                    };
                    asset.src = window.URL.createObjectURL(xhr.response);
                    if (onSuccess) { onSuccess(asset); }
                } else {
                    if (onError) { onError('Failed to retrieve: ' + source); }
                }
            };
        } else {
            if (onError) { onError('Unknown file extension: ' + fileExtension); }
        }

        xhr.send();
    }

    //------------------------------------------------------------------
    //
    // Called when all the scripts are loaded, it kicks off the demo app.
    //
    //------------------------------------------------------------------
    function mainComplete() {
        console.log('It is all loaded up');
        MyGame.game.initialize();
    }

    //
    // Start with loading the assets, then the scripts.
    console.log('Starting to dynamically load project assets');
    loadAssets(assetOrder,
        function(source, asset) {    // Store it on success
            MyGame.assets[source.key] = asset;
        },
        function(error) {
            console.log(error);
        },
        function() {
            console.log('All game assets loaded');
            console.log('Starting to dynamically load project scripts');
            loadScripts(scriptOrder, mainComplete);
        }
    );

}());
