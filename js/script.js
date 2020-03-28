let ball,
    score,
    paddle,
    playingArea,
    gear,
    controls,
    newBtn,
    diffSel,
    doneBtn,
    snd,
    music;

let aWidth,
    aHeight,
    pWidth,
    pHeight,
    dX           = 2,
    dY           = 2,
    pdX          = 48,
    currentScore = 0,
    timer,
    paddleLeft   = 228,
    ballLeft     = 100,
    ballTop      = 8,
    drag         = false,
    sndEnabled   = false,
    musicEnabled = false;

let beepX,
    beepY,
    beepPaddle,
    beepGameover,
    bgMusic;

window.addEventListener('load', init);
window.addEventListener('resize', init);

function init() {
    ball        = document.getElementById('ball');
    score       = document.getElementById('score');
    paddle      = document.getElementById('paddle');
    playingArea = document.getElementById('playingArea');
    gear        = document.getElementById('gear');
    controls    = document.getElementById('controls');
    newBtn      = document.getElementById('new');
    diffSel     = document.getElementById('difficult');
    doneBtn     = document.getElementById('done');
    snd         = document.getElementById('snd');
    music       = document.getElementById('music');

    document.addEventListener('keydown', keyListener, false);

    playingArea.addEventListener('mousedown', mouseDown, false);
    playingArea.addEventListener('mousemove', mouseMove, false);
    playingArea.addEventListener('mouseup',   mouseUp,   false);

    playingArea.addEventListener('touchstart', mouseDown, false);
    playingArea.addEventListener('touchmove',  mouseMove, false);
    playingArea.addEventListener('touchend',   mouseUp,   false);

    gear.addEventListener('click', showSettings, false);
    
    newBtn.addEventListener('click', newGame, false);

    doneBtn.addEventListener('click', hideSettings, false);

    diffSel.addEventListener('change', function() {
        setDifficulty(diffSel.selectedIndex);
    }, false);

    snd.addEventListener('click', toggleSound, false);
    music.addEventListener('click', toggleMusic, false);

    layoutPage();
    
    timer = requestAnimationFrame(start);
}

function layoutPage() {
    aWidth  = innerWidth;
    aHeight = innerHeight;
    pWidth  = aWidth - 22;
    pHeight = aHeight - 22;
    playingArea.style.width  = pWidth + 'px';
    playingArea.style.height = pHeight + 'px';
}

function keyListener(e) {
    let key = e.keyCode;
    if((key == 37 || key == 65) && paddleLeft > 0 ) {
        paddleLeft -= pdX;
        if (paddleLeft < 0) {
            paddleLeft = 0;
        }
    } else if ((key == 39 || key == 68) && paddleLeft < pWidth - 64) {
        paddleLeft += pdX;
        if (paddleLeft > pWidth - 64) {
            paddleLeft = pWidth - 64;
        }       
    }
    paddle.style.left = paddleLeft + 'px';
}

function start() {
    render();
    detectCollisions();
    manageDifficulty();
    
    if (ballTop < pHeight - 46) {
        timer = requestAnimationFrame(start);
    } else {
        gameOver();
    }
}

function render() {
    moveBall();
    updateScore();
}

function moveBall() {
    ballLeft += dX;
    ballTop  += dY;

    ball.style.left = ballLeft + 'px';
    ball.style.top  = ballTop  + 'px';
}

function updateScore() {
    currentScore += 5;
    score.innerHTML = 'Score: ' + currentScore;
}

function detectCollisions() {
    if (collisionX()) {
        dX *= -1;
    }
    if (collisionY()) {
        dY *= -1;
    }
}

function collisionX() {
    if (ballLeft < 4 || ballLeft > pWidth - 20) {
        playSound(beepX);
        return true;
    }
    return false;
}

function collisionY() {
    if (ballTop < 4) {
        playSound(beepY);
        return true;
    }
    if (ballTop > pHeight - 62) {
        // if(ballLeft >= paddleLeft + 16 && ballLeft < paddleLeft + 48) {
        //     if (dX > 0) {
        //         dX = 2;
        //     } else {
        //         dX = -2;
        //     }
        //     ballTop -= 5;
        //     playSound(beepPaddle);
        //     return true;
        // } else if (ballLeft >= paddleLeft && ballLeft < paddleLeft + 16) {
        //     if (dX > 0) {
        //         dX = 8;
        //     } else {
        //         dX = -8;
        //     }
        //     ballTop -= 5;
        //     playSound(beepPaddle);
        //     return true;
        // } else if (ballLeft >= paddleLeft + 48 && ballLeft <= paddleLeft + 64) {
        //     if (dX > 0) {
        //         dX = 8;
        //     } else {
        //         dX = -8;
        //     }
        //     ballTop -= 5;
        //     playSound(beepPaddle);
        //     return true;
        // }
        if(ballLeft + 8 >= paddleLeft && ballLeft <= paddleLeft + 8 + 64) {
            dX += Math.round((ballLeft + 8 - (paddleLeft + 32)) / 8);
            ballTop -= 10;
            return true;
        }
    }
    return false;
}

function manageDifficulty() {
    if(currentScore % 1000 == 0) {
        if (dY > 0) {
            dY += 1;
        } else {
            dY -= 1;
        }
    }
}

function gameOver() {
    playSound(beepGameover);
    cancelAnimationFrame(timer);
    score.innerHTML += '   Game Over!';
    score.style.backgroundColor = 'rgb(128, 0, 0)';
}

function mouseDown(e) {
    drag = true;
}

function mouseUp(e) {
    drag = false;
}

function mouseMove(e) {
    if(drag) {
        e.preventDefault();
        paddleLeft = e.clientX - 32 || e.targetTouches[0].pageX - 32;
        if(paddleLeft < 0) {
            paddleLeft = 0;
        }
        if(paddleLeft > pWidth - 64) {
            paddleLeft = pWidth - 64;
        }
        paddle.style.left = paddleLeft + 'px';
    }
}

function showSettings() {
    controls.style.display = 'block';
    cancelAnimationFrame(timer);
}

function hideSettings() {
    controls.style.display = 'none';
    timer = requestAnimationFrame(start);
}

function setDifficulty(diff) {
    switch(diff) {
        case 1: {
            dY  = 2;
            pdX = 48;
            break;
        }
        case 1: {
            dY  = 4;
            pdX = 32;
            break;
        }
        case 2: {
            dY  = 6;
            pdX = 16;
            break;
        }
        default: {
            dY  = 2;
            pdX = 48;
        }
    }
}

function newGame() {
    ballTop = 8;
    ballLeft = 100;
    currentScore = 0;
    dX = 2;
    setDifficulty(diffSel.selectedIndex);
    score.style.backgroundColor = 'rgb(32, 128, 64)';
    hideSettings();
}

function initAudio() {
    beepX        = new Audio('sounds/beepx.mp3');
    beepY        = new Audio('sounds/beepY.mp3');
    beepPaddle   = new Audio('sounds/beepPaddle.mp3');
    beepGameover = new Audio('sounds/beepGameOver.mp3');
    bgMusic      = new Audio('sounds/music.mp3');

    beepX.volume = 0;
    beepY.volume = 0;
    beepPaddle.volume = 0;
    beepGameover.volume = 0;
    bgMusic.volume = 0;
    
    beepX.play();
    beepY.play();
    beepPaddle.play();
    beepGameover.play();
    bgMusic.play();

    beepX.pause();
    beepY.pause();
    beepPaddle.pause();
    beepGameover.pause();
    bgMusic.pause();

    beepX.volume = 1;
    beepY.volume = 1;
    beepPaddle.volume = 1;
    beepGameover.volume = 1;
    bgMusic.volume = 1;
}

function toggleSound() {
    if(beepX == null) {
        initAudio();
    }
    sndEnabled = !sndEnabled;
}

function playSound(objSound) {
    if(sndEnabled) {
        objSound.play();
    }
}

function toggleMusic() {
    if(bgMusic == null) {
        initAudio();
    }
    if(musicEnabled) {
        bgMusic.pause();
    } else {
        bgMusic.loop = true;
        bgMusic.play();
    }
    musicEnabled = !musicEnabled;
}