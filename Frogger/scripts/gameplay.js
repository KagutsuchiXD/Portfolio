MyGame.screens['game-play'] = (function(game, objects, renderer, graphics, input, systems, assets) {
    'use strict';

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;
    let gameOver = false;
    let aiOn = false;
    let aiMoveTime;
    let animationTimer;

    let myKeyboard = input.Keyboard();
    let particleSparks = systems.ParticleSystem({
        center: {x: graphics.canvas.width / 2, y: 100 },
        size: { mean: graphics.blockSize / 5, stdev: 4 },
        speed: { mean: 10, stdev: 25 },
        lifetime: { mean: 1, stdev: 1 }
    });
    let particleChunks = systems.ParticleSystem({
        center: {x: graphics.canvas.width / 2, y: 100 },
        size: { mean: graphics.blockSize / 5, stdev: 4 },
        speed: { mean: 50, stdev: 25 },
        lifetime: { mean: 1, stdev: 1 }
    });
    let renderSparks = renderer.ParticleSystem(particleSparks, graphics, assets['spark']);
    let renderChunks = renderer.ParticleSystem(particleChunks, graphics, assets['chunk']);

    let resultTimer;
    let highScore;
    let scoreText;
    let timer;
    let level;
    let lives;
    let atHome;
    let score;

    let frogger;
    let croc;

    let frogRender = renderer.AnimatedModel({
        spriteSheet: assets['frogs'],
        spriteCount: 7,
        spriteTime: [30, 30, 30, 30, 30, 30, 30]
    }, graphics);
    let turtleRender = renderer.AnimatedModel({
        spriteSheet: assets['turtle'],
        spriteCount: 5,
        spriteTime: [500, 500, 500, 500, 500]
    }, graphics);
    let turtleRenderSink = renderer.AnimatedModel({
        spriteSheet: assets['sink'],
        spriteCount: 3,
        spriteTime: [500, 500, 1000]
    }, graphics);
    let crocRender = renderer.AnimatedModel({
        spriteSheet: assets['croc'],
        spriteCount: 3,
        spriteTime: [200, 200, 200]
    }, graphics);

    let carList = {};
    let homeList = {};
    let turtleList = {};
    let logList = {};

    let result;

    function generateHomes(){
        homeList.home1 = objects.Home({
            center: { x: graphics.blockSize + (graphics.blockSize/2), y: graphics.blockSize + (graphics.blockSize/2) },
            radius: graphics.blockSize / 2,
            rotation : 0,
            imageSrc: assets['home'],
            size: { width: graphics.blockSize, height: graphics.blockSize },
            currentTime: 7,
            fly: false,
            croc: false,
            occupied: false
        });
        homeList.home2 = objects.Home({
            center: { x: 4 * graphics.blockSize + (graphics.blockSize/2), y: graphics.blockSize + (graphics.blockSize/2) },
            radius: graphics.blockSize / 2,
            rotation : 0,
            imageSrc: assets['home'],
            size: { width: graphics.blockSize, height: graphics.blockSize },
            currentTime: 13,
            fly: false,
            croc: false,
            occupied: false
        });
        homeList.home3 = objects.Home({
            center: { x: 7 * graphics.blockSize + (graphics.blockSize/2), y: graphics.blockSize + (graphics.blockSize/2) },
            radius: graphics.blockSize / 2,
            rotation : 0,
            imageSrc: assets['home'],
            size: { width: graphics.blockSize, height: graphics.blockSize },
            currentTime: 19,
            fly: false,
            croc: false,
            occupied: false
        });
        homeList.home4 = objects.Home({
            center: { x: 10 * graphics.blockSize + (graphics.blockSize/2), y: graphics.blockSize + (graphics.blockSize/2) },
            radius: graphics.blockSize / 2,
            rotation : 0,
            imageSrc: assets['home'],
            size: { width: graphics.blockSize, height: graphics.blockSize },
            currentTime: 29,
            fly: false,
            croc: false,
            occupied: false
        });
        homeList.home5 = objects.Home({
            center: { x: 13 * graphics.blockSize + (graphics.blockSize/2), y: graphics.blockSize + (graphics.blockSize/2) },
            radius: graphics.blockSize / 2,
            rotation : 0,
            imageSrc: assets['home'],
            size: { width: graphics.blockSize, height: graphics.blockSize },
            currentTime: 37,
            fly: false,
            croc: false,
            occupied: false
        });
    }

    function generateCars(){
        //lane 1 of car1s
        carList.car1 = objects.Car({
            center: { x: graphics.blockSize, y: 12 * graphics.blockSize },
            rotation : Math.PI,
            moveRate: 0.1,
            image: assets['car1'],
            size: { width: graphics.blockSize, height: graphics.blockSize }
        });
        carList.car2 = objects.Car({
            center: { x: 5 * graphics.blockSize, y: 12 * graphics.blockSize },
            rotation : Math.PI,
            moveRate: 0.1,
            image: assets['car1'],
            size: { width: graphics.blockSize, height: graphics.blockSize }
        });
        carList.car3 = objects.Car({
            center: { x: 9 * graphics.blockSize, y: 12 * graphics.blockSize },
            rotation : Math.PI,
            moveRate: 0.1,
            image: assets['car1'],
            size: { width: graphics.blockSize, height: graphics.blockSize }
        });
        carList.car4 = objects.Car({
            center: { x: 13 * graphics.blockSize, y: 12 * graphics.blockSize },
            rotation : Math.PI,
            moveRate: 0.1,
            image: assets['car1'],
            size: { width: graphics.blockSize, height: graphics.blockSize }
        });

        //lane 2 dozers
        carList.dozer1 = objects.Car({
            center: { x: 3 * graphics.blockSize, y: 11 * graphics.blockSize },
            rotation : 0,
            moveRate: 0.08,
            image: assets['dozer'],
            size: { width: graphics.blockSize, height: graphics.blockSize }
        });
        carList.dozer2 = objects.Car({
            center: { x: 8 * graphics.blockSize, y: 11 * graphics.blockSize },
            rotation : 0,
            moveRate: 0.08,
            image: assets['dozer'],
            size: { width: graphics.blockSize, height: graphics.blockSize }
        });
        carList.dozer3 = objects.Car({
            center: { x: 13 * graphics.blockSize, y: 11 * graphics.blockSize },
            rotation : 0,
            moveRate: 0.08,
            image: assets['dozer'],
            size: { width: graphics.blockSize, height: graphics.blockSize }
        });

        // lane 3 car2s
        carList.car5 = objects.Car({
            center: { x: 3 * graphics.blockSize, y: 10 * graphics.blockSize },
            rotation : Math.PI,
            moveRate: 0.06,
            image: assets['car2'],
            size: { width: graphics.blockSize, height: graphics.blockSize }
        });
        carList.car6 = objects.Car({
            center: { x: 6 * graphics.blockSize, y: 10 * graphics.blockSize },
            rotation : Math.PI,
            moveRate: 0.06,
            image: assets['car2'],
            size: { width: graphics.blockSize, height: graphics.blockSize }
        });
        carList.car7 = objects.Car({
            center: { x: 10 * graphics.blockSize, y: 10 * graphics.blockSize },
            rotation : Math.PI,
            moveRate: 0.06,
            image: assets['car2'],
            size: { width: graphics.blockSize, height: graphics.blockSize }
        });
        carList.car8 = objects.Car({
            center: { x: 13 * graphics.blockSize, y: 10 * graphics.blockSize },
            rotation : Math.PI,
            moveRate: 0.06,
            image: assets['car2'],
            size: { width: graphics.blockSize, height: graphics.blockSize }
        });

        // lane 4 racers
        carList.racer1 = objects.Car({
            center: { x: graphics.blockSize, y: 9 * graphics.blockSize },
            rotation : 0,
            moveRate: 0.3,
            image: assets['racer'],
            size: { width: graphics.blockSize, height: graphics.blockSize }
        });
        carList.racer2 = objects.Car({
            center: { x: 4 * graphics.blockSize, y: 9 * graphics.blockSize },
            rotation : 0,
            moveRate: 0.3,
            image: assets['racer'],
            size: { width: graphics.blockSize, height: graphics.blockSize }
        });

        // lane 5 trucks
        carList.truck1 = objects.Car({
            center: { x: 5 * graphics.blockSize, y: 8 * graphics.blockSize },
            rotation : Math.PI,
            moveRate: 0.03,
            image: assets['truck'],
            size: { width: 2 * graphics.blockSize, height: graphics.blockSize }
        });
        carList.truck2 = objects.Car({
            center: { x: 11 * graphics.blockSize, y: 8 * graphics.blockSize },
            rotation : Math.PI,
            moveRate: 0.03,
            image: assets['truck'],
            size: { width: 2 * graphics.blockSize, height: graphics.blockSize }
        });
    }

    function generateRiverObjects(){
        // lane 1 turtles
        turtleList.turtle1 = objects.Turtle({
            center: { x: graphics.blockSize + (graphics.blockSize/2), y: 6 * graphics.blockSize + (graphics.blockSize/2) },
            rotation : Math.PI,
            moveRate: 0.1,
            size: { width: graphics.blockSize, height: graphics.blockSize },
            sinker: false,
            submerged: false,
            timer: 0,
            sinking: false
        });
        turtleList.turtle2 = objects.Turtle({
            center: { x: 2 * graphics.blockSize + (graphics.blockSize/2), y: 6 * graphics.blockSize + (graphics.blockSize/2) },
            rotation : Math.PI,
            moveRate: 0.1,
            size: { width: graphics.blockSize, height: graphics.blockSize },
            sinker: false,
            submerged: false,
            timer: 0,
            sinking: false
        });
        turtleList.turtle3 = objects.Turtle({
            center: { x:  3 * graphics.blockSize + (graphics.blockSize/2), y: 6 * graphics.blockSize + (graphics.blockSize/2) },
            rotation : Math.PI,
            moveRate: 0.1,
            size: { width: graphics.blockSize, height: graphics.blockSize },
            sinker: false,
            submerged: false,
            timer: 0,
            sinking: false
        });
        // sinking turtles
        turtleList.turtle4 = objects.Turtle({
            center: { x:  6 * graphics.blockSize + (graphics.blockSize/2), y: 6 * graphics.blockSize + (graphics.blockSize/2) },
            rotation : Math.PI,
            moveRate: 0.1,
            size: { width: graphics.blockSize, height: graphics.blockSize },
            sinker: true,
            submerged: false,
            timer: 0,
            sinking: false
        });
        turtleList.turtle5 = objects.Turtle({
            center: { x:  7 * graphics.blockSize + (graphics.blockSize/2), y: 6 * graphics.blockSize + (graphics.blockSize/2) },
            rotation : Math.PI,
            moveRate: 0.1,
            size: { width: graphics.blockSize, height: graphics.blockSize },
            sinker: true,
            submerged: false,
            timer: 0,
            sinking: false
        });
        turtleList.turtle6 = objects.Turtle({
            center: { x:  8 * graphics.blockSize + (graphics.blockSize/2), y: 6 * graphics.blockSize + (graphics.blockSize/2) },
            rotation : Math.PI,
            moveRate: 0.1,
            size: { width: graphics.blockSize, height: graphics.blockSize },
            sinker: true,
            submerged: false,
            timer: 0,
            sinking: false
        });

        turtleList.turtle7 = objects.Turtle({
            center: { x:  11 * graphics.blockSize + (graphics.blockSize/2), y: 6 * graphics.blockSize + (graphics.blockSize/2) },
            rotation : Math.PI,
            moveRate: 0.1,
            size: { width: graphics.blockSize, height: graphics.blockSize },
            sinker: false,
            submerged: false,
            timer: 0,
            sinking: false
        });
        turtleList.turtle8 = objects.Turtle({
            center: { x:  12 * graphics.blockSize + (graphics.blockSize/2), y: 6 * graphics.blockSize + (graphics.blockSize/2) },
            rotation : Math.PI,
            moveRate: 0.1,
            size: { width: graphics.blockSize, height: graphics.blockSize },
            sinker: false,
            submerged: false,
            timer: 0,
            sinking: false
        });
        turtleList.turtle9 = objects.Turtle({
            center: { x:  13 * graphics.blockSize + (graphics.blockSize/2), y: 6 * graphics.blockSize + (graphics.blockSize/2) },
            rotation : Math.PI,
            moveRate: 0.1,
            size: { width: graphics.blockSize, height: graphics.blockSize },
            sinker: false,
            submerged: false,
            timer: 0,
            sinking: false
        });

        // lane 2 logs size 3
        logList.log1 = objects.Log({
            center: { x: 2 * graphics.blockSize, y: 5 * graphics.blockSize },
            rotation : 0,
            moveRate: 0.05,
            image: assets['log'],
            size: { width: 3 * graphics.blockSize, height: graphics.blockSize }
        });

        logList.log2 = objects.Log({
            center: { x: 7 * graphics.blockSize, y: 5 * graphics.blockSize },
            rotation : 0,
            moveRate: 0.05,
            image: assets['log'],
            size: { width: 3 * graphics.blockSize, height: graphics.blockSize }
        });

        logList.log3 = objects.Log({
            center: { x: 12 * graphics.blockSize, y: 5 * graphics.blockSize },
            rotation : 0,
            moveRate: 0.05,
            image: assets['log'],
            size: { width: 3 * graphics.blockSize, height: graphics.blockSize }
        });

        // lane 3 logs size 5
        logList.log4 = objects.Log({
            center: { x: 5 * graphics.blockSize, y: 4 * graphics.blockSize },
            rotation : 0,
            moveRate: 0.1,
            image: assets['log'],
            size: { width: 7 * graphics.blockSize, height: graphics.blockSize }
        });

        // lane 4 turtles
        turtleList.turtle10 = objects.Turtle({
            center: { x: graphics.blockSize + (graphics.blockSize/2), y: 3 * graphics.blockSize + (graphics.blockSize/2) },
            rotation : Math.PI,
            moveRate: 0.05,
            size: { width: graphics.blockSize, height: graphics.blockSize },
            sinker: false,
            submerged: false,
            timer: 0
        });
        turtleList.turtle11 = objects.Turtle({
            center: { x: 2 * graphics.blockSize + (graphics.blockSize/2), y: 3 * graphics.blockSize + (graphics.blockSize/2) },
            rotation : Math.PI,
            moveRate: 0.05,
            size: { width: graphics.blockSize, height: graphics.blockSize },
            sinker: false,
            submerged: false,
            timer: 0,
            sinking: false
        });

        turtleList.turtle12 = objects.Turtle({
            center: { x:  5 * graphics.blockSize + (graphics.blockSize/2), y: 3 * graphics.blockSize + (graphics.blockSize/2) },
            rotation : Math.PI,
            moveRate: 0.05,
            size: { width: graphics.blockSize, height: graphics.blockSize },
            sinker: false,
            submerged: false,
            timer: 0,
            sinking: false
        });
        turtleList.turtle13 = objects.Turtle({
            center: { x:  6 * graphics.blockSize + (graphics.blockSize/2), y: 3 * graphics.blockSize + (graphics.blockSize/2) },
            rotation : Math.PI,
            moveRate: 0.05,
            size: { width: graphics.blockSize, height: graphics.blockSize },
            sinker: false,
            submerged: false,
            timer: 0,
            sinking: false
        });

        // sinking turtles
        turtleList.turtle14 = objects.Turtle({
            center: { x:  8 * graphics.blockSize + (graphics.blockSize/2), y: 3 * graphics.blockSize + (graphics.blockSize/2) },
            rotation : Math.PI,
            moveRate: 0.05,
            size: { width: graphics.blockSize, height: graphics.blockSize },
            sinker: true,
            submerged: false,
            timer: 0,
            sinking: false
        });
        turtleList.turtle15 = objects.Turtle({
            center: { x:  9 * graphics.blockSize + (graphics.blockSize/2), y: 3 * graphics.blockSize + (graphics.blockSize/2) },
            rotation : Math.PI,
            moveRate: 0.05,
            size: { width: graphics.blockSize, height: graphics.blockSize },
            sinker: true,
            submerged: false,
            timer: 0,
            sinking: false
        });

        turtleList.turtle16 = objects.Turtle({
            center: { x:  12 * graphics.blockSize + (graphics.blockSize/2), y: 3 * graphics.blockSize + (graphics.blockSize/2) },
            rotation : Math.PI,
            moveRate: 0.05,
            size: { width: graphics.blockSize, height: graphics.blockSize },
            sinker: false,
            submerged: false,
            timer: 0,
            sinking: false
        });
        turtleList.turtle17 = objects.Turtle({
            center: { x:  13 * graphics.blockSize + (graphics.blockSize/2), y: 3 * graphics.blockSize + (graphics.blockSize/2) },
            rotation : Math.PI,
            moveRate: 0.05,
            size: { width: graphics.blockSize, height: graphics.blockSize },
            sinker: false,
            submerged: false,
            timer: 0,
            sinking: false
        });

        // lane 5 logs size 4 and 1 croc
        croc = objects.Croc({
            center: { x: 7 * graphics.blockSize  + (graphics.blockSize/2), y: 2 * graphics.blockSize  + (graphics.blockSize/2) },
            rotation : 0,
            moveRate: 0.1,
            size: { width: 4 * graphics.blockSize, height: graphics.blockSize }
        });

        logList.log5 = objects.Log({
            center: { x: graphics.blockSize, y: 2 * graphics.blockSize },
            rotation : 0,
            moveRate: 0.1,
            image: assets['log'],
            size: { width: 4 * graphics.blockSize, height: graphics.blockSize }
        });

        logList.log6 = objects.Log({
            center: { x: 13 * graphics.blockSize, y: 2 * graphics.blockSize },
            rotation : 0,
            moveRate: 0.1,
            image: assets['log'],
            size: { width: 4 * graphics.blockSize, height: graphics.blockSize }
        });

    }

    function checkSurvival(){
        if (frogger.center.y < 13 * graphics.blockSize && frogger.center.y >= 8 * graphics.blockSize){
            // check if frogger gets hit by a car
            let squished = false;
            Object.keys(carList).forEach(key => {
                if(frogger.center.y > carList[key].center.y && frogger.center.y < carList[key].center.y + carList[key].size.height){
                    if (squished === false){
                        squished = moverDetection(carList[key]);
                        if (squished === true){
                            particleChunks.center = {x:frogger.center.x, y: frogger.center.y};
                            particleChunks.splat();
                            MyGame.sounds.squash.play();
                            deadFrogger();
                        }
                    }
                }
            });
        }
        else if (frogger.center.y < 7 * graphics.blockSize && frogger.center.y >= 2 * graphics.blockSize){
            // check if frogger is ridding on something or falls into the water
            let riding = false;
            Object.keys(turtleList).forEach(key => {
                if(frogger.center.y > turtleList[key].center.y && frogger.center.y < turtleList[key].center.y + turtleList[key].size.height){
                    if (riding === false){
                         riding = moverDetection(turtleList[key]);
                        if (riding === true && turtleList[key].submerged === false){
                            frogger.riding.rotation = turtleList[key].rotation;
                            frogger.riding.moveRate = turtleList[key].moveRate;
                        }
                        else if(riding === true && turtleList[key].submerged === true){
                            MyGame.sounds.plunk.play();
                            deadFrogger();
                        }
                    }
                }
            });
            Object.keys(logList).forEach(key => {
                if(frogger.center.y > logList[key].center.y && frogger.center.y < logList[key].center.y + logList[key].size.height){
                    if (riding === false){
                        riding = moverDetection(logList[key]);
                        if (riding === true){
                            frogger.riding.rotation = logList[key].rotation;
                            frogger.riding.moveRate = logList[key].moveRate;
                        }
                    }
                }
            });
            if(riding === false){
                // check if frog is riding the croc
                riding = moverDetection(croc);
                if (riding === true){
                    if(frogger.center.x >= (croc.center.x + 2.5 * graphics.blockSize)){
                        particleChunks.center = {x:frogger.center.x, y: frogger.center.y};
                        particleChunks.splat();
                        MyGame.sounds.squash.play();
                        deadFrogger();
                    }
                    else{
                        frogger.riding.rotation = croc.rotation;
                        frogger.riding.moveRate = croc.moveRate;
                    }
                }
            }
            if (riding === false){
                MyGame.sounds.plunk.play();
                deadFrogger();
            }
        }
        else if(frogger.center.y < 2 * graphics.blockSize && frogger.center.y >= graphics.blockSize){
            // check if frogger makes it into a home
            let madeIt = false;
            Object.keys(homeList).forEach(key => {
                if (madeIt === false){
                    if(homeDetection(homeList[key])){
                        madeIt = true;
                        if(!homeList[key].croc && !homeList[key].occupied){
                            if(homeList[key].fly){
                                calculateScore(3);
                            }
                            else{
                                calculateScore(2);
                            }
                            homeList[key].occupied = true;
                            atHome += 1;
                            MyGame.sounds.sparkler.play();
                            if(atHome === 5){
                                Object.keys(homeList).forEach(key => {
                                    particleSparks.center = {x: homeList[key].center.x - graphics.blockSize/2,
                                        y: homeList[key].center.y + graphics.blockSize/2 - 10};
                                    particleSparks.sparkler();
                                    particleSparks.center = {x: homeList[key].center.x + graphics.blockSize/2,
                                        y: homeList[key].center.y + graphics.blockSize/2- 10};
                                    particleSparks.sparkler();
                                });
                                MyGame.sounds.win.play();
                                calculateScore(4);
                                gameOver = true;
                            }
                            else{
                                particleSparks.center = {x: homeList[key].center.x - graphics.blockSize/2,
                                    y: homeList[key].center.y + graphics.blockSize/2 - 10};
                                particleSparks.sparkler();
                                particleSparks.center = {x: homeList[key].center.x + graphics.blockSize/2,
                                    y: homeList[key].center.y + graphics.blockSize/2- 10};
                                particleSparks.sparkler();
                            }
                            resetFrogger();
                        }
                        else{
                            MyGame.sounds.plunk.play();
                            deadFrogger();
                        }
                    }
                }
            });
            if(!madeIt){
                MyGame.sounds.plunk.play();
                deadFrogger();
            }
        }
    }
    function moverDetection(obj){
        if((frogger.center.x) < obj.center.x){
            return false;
        }
        else return (frogger.center.x) <= (obj.center.x + obj.size.width);
    }
    function homeDetection(obj){
        if((frogger.center.x) < (obj.center.x - 15)){
            return false;
        }
        else return (frogger.center.x) <= (obj.center.x + 15);
    }

    function calculateScore(modifier){
        switch (modifier){
            case 1:
                score += 10;
                break;
            case 2:
                score += 50 + (Math.ceil(timer) * 10);
                break;
            case 3:
                score += 250 + (Math.ceil(timer) * 10);
                break;
            case 4:
                score += 1000;
                break;
        }
    }

    function saveScore(){
        if (score > 0){
            let swap = false;
            for(let i = 5; i > 0; i--){
                if(scores.hasOwnProperty(i.toString())){
                    if(score > parseInt(scores[i.toString()])){
                        if(!swap){
                            scores[i.toString()] = score.toString();
                            swap = true;
                        }
                        else{
                            let temp = parseInt(scores[i.toString()]);
                            scores[(i+1).toString()] = temp.toString();
                            scores[i.toString()] = score.toString();
                        }
                    }
                }
            }
            localStorage['scores'] = JSON.stringify(scores);
        }
    }

    // Game Loop Functions
    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }
    function update(elapsedTime) {
        particleSparks.update(elapsedTime);
        particleChunks.update(elapsedTime);
        if(gameOver === false){
            if(aiOn){
                aiMoveTime -= elapsedTime;
                if(aiMoveTime <= 0){
                    aiMove(elapsedTime);
                }
            }
            scoreText.updateValue(score);
            timer -= elapsedTime/1000;
            if(timer <= 0){
                deadFrogger();
            }
            Object.keys(carList).forEach(key => {
                carList[key].update(elapsedTime);
            });
            Object.keys(turtleList).forEach(key => {
                turtleList[key].update(elapsedTime);
            });
            Object.keys(logList).forEach(key => {
                logList[key].update(elapsedTime);
            });
            Object.keys(homeList).forEach(key => {
                homeList[key].update(elapsedTime);
            });
            if(frogger.riding.moveRate !== 0){
                frogger.updatePosition(elapsedTime, frogger.riding.rotation, frogger.riding.moveRate);
            }
            croc.update(elapsedTime);
            crocRender.update(elapsedTime);
            if(animationTimer > 0){
                animationTimer -= elapsedTime;
                if(animationTimer < 0){
                    animationTimer = 0;
                }
                frogRender.update(elapsedTime);
            }
            if(turtleList.turtle4.sinking){
                turtleRenderSink.update(elapsedTime);
                turtleRender.update(elapsedTime);
            }
            else{
                turtleRender.update(elapsedTime);
            }
            checkSurvival();
        }
        else{
            if (resultTimer > 0){
                resultTimer -= (elapsedTime / 1000);
            }
            else{
                if (!aiOn){
                    saveScore();
                }
                cancelNextRequest = true;
                game.showScreen('main-menu');
            }
        }
    }
    function render() {
        graphics.clear();
        graphics.drawMap();
        renderer.Text.render(scoreText);
        renderer.Text.render(highScore);
        Object.keys(carList).forEach(key => {
            renderer.Car.render(carList[key]);
        });
        Object.keys(turtleList).forEach(key => {
            if(turtleList[key].sinking){
                turtleRenderSink.render(turtleList[key]);
            }
            else{
                turtleRender.render(turtleList[key]);
            }
        });
        Object.keys(logList).forEach(key => {
            renderer.Log.render(logList[key]);
        });
        Object.keys(homeList).forEach(key => {
            renderer.Home.render(homeList[key]);
        });
        crocRender.render(croc);
        frogRender.render(frogger);
        graphics.drawLives(lives);
        graphics.drawTime(timer);
        renderSparks.render();
        renderChunks.render();
        if(gameOver){
            renderer.Text.render(result);
        }
    }
    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render();

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function newGame(){
        level = 2;
        score = 0;
        atHome = 0;
        if(aiOn){
            lives = 10;
        }
        else {
            lives = 5;
        }
        gameOver = false;

        resultTimer = 3;

        result = objects.Text({
            text: "YOU WIN",
            value: 0.0,
            units: "",
            font: '100pt Arial',
            fillStyle: 'rgba(255, 255, 255, 1)',
            strokeStyle: 'rgba(0, 255, 0, 1)',
            position: { x: graphics.canvas.width / 10, y: graphics.canvas.height / 3 }
        });

        scoreText = objects.Text({
            text: 'SCORE: ',
            value: 0,
            units: ' pts',
            font: '35pt Arial',
            fillStyle: 'rgba(255, 255, 255, 1)',
            strokeStyle: 'rgba(0, 255, 0, 1)',
            position: { x: 0, y: 0 }
        });

        highScore = objects.Text({
            text: ' HI-SCORE: ',
            value: scores["1"],
            units: ' pts',
            font: '35pt Arial',
            fillStyle: 'rgba(255, 255, 255, 1)',
            strokeStyle: 'rgba(255, 0, 0, 1)',
            position: { x: 7 * graphics.blockSize, y: 0 }
        });

        resetFrogger();
        generateHomes();
        generateCars();
        generateRiverObjects();
    }
    function deadFrogger(){
        lives -= 1;
        resetFrogger();
        if(lives <= 0){
            gameOver = true;
            result.text = "GAME OVER";
            result.fillStyle = 'rgba(255, 0, 0, 1)';
        }
    }
    function resetFrogger(){
        if(aiOn){
            aiMoveTime = 500;
        }
        timer = 60;
        frogger = objects.Frog({
            center: { x: 7 * graphics.blockSize + (graphics.blockSize/2), y: 13 * graphics.blockSize + (graphics.blockSize/2) },
            radius: graphics.blockSize / 2,
            rotation : 0,
            image: assets['frog'],
            size: { width: graphics.blockSize, height: graphics.blockSize },
            riding: {rotation: 0, moveRate: 0}
        });
    }

    function up(elapsedTime){
        animationTimer = 210;
        MyGame.sounds.hop.currentTime = 0;
        MyGame.sounds.hop.play();
        frogger.moveForward(elapsedTime);
        frogger.riding.rotation = 0;
        frogger.riding.moveRate = 0;
        checkSurvival();
        if(frogger.center.y !== 13 * graphics.blockSize + (graphics.blockSize/2)){
            calculateScore(1);
        }
    }
    function down(elapsedTime){
        animationTimer = 210;
        MyGame.sounds.hop.currentTime = 0;
        MyGame.sounds.hop.play();
        frogger.moveBack(elapsedTime);
        frogger.riding.rotation = 0;
        frogger.riding.moveRate = 0;
        checkSurvival();
    }
    function left(elapsedTime){
        animationTimer = 210;
        MyGame.sounds.hop.currentTime = 0;
        MyGame.sounds.hop.play();
        frogger.moveLeft(elapsedTime);
        frogger.riding.rotation = 0;
        frogger.riding.moveRate = 0;
        checkSurvival();
    }
    function right(elapsedTime){
        animationTimer = 210;
        MyGame.sounds.hop.currentTime = 0;
        MyGame.sounds.hop.play();
        frogger.moveRight(elapsedTime);
        frogger.riding.rotation = 0;
        frogger.riding.moveRate = 0;
        checkSurvival();
    }

    function aiEndMouse(){
        document.removeEventListener('mousemove', aiEndMouse);
        document.removeEventListener('keydown', aiEndKey);
        aiOn = false;
        cancelNextRequest = true;
        game.showScreen('main-menu');
    }
    function aiEndKey(){
        document.removeEventListener('mousemove', aiEndMouse);
        document.removeEventListener('keydown', aiEndKey);
        aiOn = false;
        cancelNextRequest = true;
        game.showScreen('main-menu');
    }
    function aiCanMoveUp(){
        let canMove = true;
        if (frogger.center.y >= 8 * graphics.blockSize){
            Object.keys(carList).forEach(key => {
                if (canMove === true){
                    if (frogger.center.y - graphics.blockSize > carList[key].center.y && frogger.center.y - graphics.blockSize < carList[key].center.y + carList[key].size.height){
                        if((frogger.center.x >= carList[key].center.x) && (frogger.center.x <= carList[key].center.x + carList[key].size.width)){
                            canMove = false;
                        }
                    }
                }
            });
        }
        else if (frogger.center.y >= 3 * graphics.blockSize){
            let canRide = false;
            Object.keys(turtleList).forEach(key => {
                if(canRide === false){
                    if (frogger.center.y - graphics.blockSize > turtleList[key].center.y && frogger.center.y - graphics.blockSize < turtleList[key].center.y + turtleList[key].size.height){
                        if((frogger.center.x >= turtleList[key].center.x) && (frogger.center.x <= turtleList[key].center.x + turtleList[key].size.width) && turtleList[key].submerged === false){
                            canRide = true;
                        }
                    }
                }
            });
            Object.keys(logList).forEach(key => {
                if(canRide === false){
                    if (frogger.center.y - graphics.blockSize > logList[key].center.y && frogger.center.y - graphics.blockSize < logList[key].center.y + logList[key].size.height){
                        if((frogger.center.x >= logList[key].center.x) && (frogger.center.x <= logList[key].center.x + logList[key].size.width)){
                            canRide = true;
                        }
                    }
                }
            });

            canMove = canRide;
        }
        else if (frogger.center.y >= 2 * graphics.blockSize){
            let canMakeIt = false;
            Object.keys(homeList).forEach(key => {
                if(canMakeIt === false){
                    if((frogger.center.x >= (homeList[key].center.x - 10)) && (frogger.center.x <= (homeList[key].center.x + 10))){
                        canMakeIt = true;
                    }
                }
            });
            canMove = canMakeIt;
        }
        else{
            canMove = false;
        }
        return canMove;
    }
    function aiCanMoveRight(){
        let canMove = true;
        if (frogger.center.y >= 8 * graphics.blockSize){
            Object.keys(carList).forEach(key => {
                if (canMove === true){
                    if (frogger.center.y > carList[key].center.y && frogger.center.y < carList[key].center.y + carList[key].size.height){
                        if((frogger.center.x + graphics.blockSize >= carList[key].center.x) && (frogger.center.x + graphics.blockSize <= carList[key].center.x + carList[key].size.width)){
                            canMove = false;
                        }
                    }
                }
            });
        }
        else if (frogger.center.y >= 3 * graphics.blockSize){
            let canRide = false;
            Object.keys(turtleList).forEach(key => {
                if(canRide === false){
                    if (frogger.center.y > turtleList[key].center.y && frogger.center.y < turtleList[key].center.y + turtleList[key].size.height){
                        if((frogger.center.x + graphics.blockSize >= turtleList[key].center.x) && (frogger.center.x + graphics.blockSize <= turtleList[key].center.x + turtleList[key].size.width) && turtleList[key].submerged === false){
                            canRide = true;
                        }
                    }
                }
            });
            Object.keys(logList).forEach(key => {
                if(canRide === false){
                    if (frogger.center.y > logList[key].center.y && frogger.center.y < logList[key].center.y + logList[key].size.height){
                        if((frogger.center.x + graphics.blockSize >= logList[key].center.x) && (frogger.center.x + graphics.blockSize <= logList[key].center.x + logList[key].size.width)){
                            canRide = true;
                        }
                    }
                }
            });

            canMove = canRide;
        }
        else{
            canMove = false;
        }
        return canMove;
    }
    function aiCanMoveLeft(){
        let canMove = true;
        if (frogger.center.y >= 8 * graphics.blockSize){
            Object.keys(carList).forEach(key => {
                if (canMove === true){
                    if (frogger.center.y > carList[key].center.y && frogger.center.y < carList[key].center.y + carList[key].size.height){
                        if((frogger.center.x - graphics.blockSize >= carList[key].center.x) && (frogger.center.x - graphics.blockSize <= carList[key].center.x + carList[key].size.width)){
                            canMove = false;
                        }
                    }
                }
            });
        }
        else if (frogger.center.y >= 3 * graphics.blockSize){
            let canRide = false;
            Object.keys(turtleList).forEach(key => {
                if(canRide === false){
                    if (frogger.center.y > turtleList[key].center.y && frogger.center.y < turtleList[key].center.y + turtleList[key].size.height){
                        if((frogger.center.x - graphics.blockSize >= turtleList[key].center.x) && (frogger.center.x - graphics.blockSize <= turtleList[key].center.x + turtleList[key].size.width) && turtleList[key].submerged === false){
                            canRide = true;
                        }
                    }
                }
            });
            Object.keys(logList).forEach(key => {
                if(canRide === false){
                    if (frogger.center.y > logList[key].center.y && frogger.center.y < logList[key].center.y + logList[key].size.height){
                        if((frogger.center.x - graphics.blockSize >= logList[key].center.x) && (frogger.center.x - graphics.blockSize <= logList[key].center.x + logList[key].size.width)){
                            canRide = true;
                        }
                    }
                }
            });

            canMove = canRide;
        }
        else{
            canMove = false;
        }
        return canMove;
    }
    function aiCanMoveDown(){
        let canMove = true;
        if (frogger.center.y >= 8 * graphics.blockSize){
            Object.keys(carList).forEach(key => {
                if (canMove === true){
                    if (frogger.center.y + graphics.blockSize > carList[key].center.y && frogger.center.y + graphics.blockSize < carList[key].center.y + carList[key].size.height){
                        if((frogger.center.x >= carList[key].center.x) && (frogger.center.x <= carList[key].center.x + carList[key].size.width)){
                            canMove = false;
                        }
                    }
                }
            });
        }
        else if (frogger.center.y >= 3 * graphics.blockSize){
            let canRide = false;
            Object.keys(turtleList).forEach(key => {
                if(canRide === false){
                    if (frogger.center.y + graphics.blockSize > turtleList[key].center.y && frogger.center.y + graphics.blockSize < turtleList[key].center.y + turtleList[key].size.height){
                        if((frogger.center.x >= turtleList[key].center.x) && (frogger.center.x <= turtleList[key].center.x + turtleList[key].size.width) && turtleList[key].submerged === false){
                            canRide = true;
                        }
                    }
                }
            });
            Object.keys(logList).forEach(key => {
                if(canRide === false){
                    if (frogger.center.y + graphics.blockSize > logList[key].center.y && frogger.center.y + graphics.blockSize < logList[key].center.y + logList[key].size.height){
                        if((frogger.center.x >= logList[key].center.x) && (frogger.center.x <= logList[key].center.x + logList[key].size.width)){
                            canRide = true;
                        }
                    }
                }
            });

            canMove = canRide;
        }
        else{
            canMove = false;
        }
        return canMove;
    }
    function aiMove(elapsedTime){
        if(aiCanMoveUp()){
            up(elapsedTime);
        }
        else if(aiCanMoveRight()){
            right(elapsedTime);
        }
        else if(aiCanMoveDown()){
            down(elapsedTime);
        }
        else if(aiCanMoveLeft()){
            left(elapsedTime);
        }
        aiMoveTime = 500;
    }

    function initialize() {
        myKeyboard.register(controls["up"], up);
        myKeyboard.register(controls["down"], down);
        myKeyboard.register(controls["left"], left);
        myKeyboard.register(controls["right"], right);
        myKeyboard.register('Escape', function() {
            // Stop the game loop by canceling the request for the next animation frame
            cancelNextRequest = true;
            game.showScreen('pause');
        });
        if(aiOn === true){
            document.addEventListener('mousemove', aiEndMouse);
            document.addEventListener('keydown', aiEndKey);
            aiMoveTime = 500;
        }
    }

    function run() {
        initialize();
        MyGame.sounds.game.currentTime = 0;
        MyGame.sounds.game.play();
        newGame();
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize : initialize,
        run : run,
        saveScore: saveScore,
        deadFrogger: deadFrogger,
        get aiOn() {return aiOn},
        set aiOn(val) {aiOn = val}
    };

}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input, MyGame.systems, MyGame.assets));