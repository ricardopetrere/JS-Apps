var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x;
var y;
var dx;
var dy;
var ballRadius = 10;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX;


var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score=0;
var maxScore = 0;

var lives = 3;

var bricks = [];

resetBallPaddle();
for (var c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	for (var r = 0; r < brickRowCount; r++) {
		bricks[c][r] = {x:0,y:0,status:1};
		maxScore++;
	}
}

function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status==1) {
            	/*
            	if(x+ballRadius>=b.x&&x-ballRadius<=b.x+brickWidth&&y+ballRadius>=b.y&&y-ballRadius<=b.y+brickHeight) {
            		b.status=0;
            		if()
            	}
            	*/
            	var hit=false;
            	if((x+ballRadius>=b.x&&x-ballRadius<=b.x+brickWidth)&&y>b.y&&y<b.y+brickHeight) {
					dx=-dx;
					hit=true;
				}
				if((y+ballRadius>=b.y&&y-ballRadius<=b.y+brickHeight)&&x>b.x&&x<b.x+brickWidth) {
					dy=-dy;
					hit=true;
				}
				if(hit) {
					b.status=0;
					score++;
				}
            }
        }
    }
}

function draw() {
	ctx.clearRect(0,0,canvas.width, canvas.height);
	drawBall();
	drawBricks();
	drawPaddle();
	drawScore();
	drawLives();
	if(score==maxScore) {
		alert("You Win!");
		document.location.reload();
	}
	if(!lives) {
		alert("Game Over");
		document.location.reload();
	}
	collisionDetection();

	if(x+ballRadius>=canvas.width||x-ballRadius<=0) {
		dx=-dx;
	}

	if(y-ballRadius<=0) {
		dy=-dy;
	} else if(y+ballRadius>=canvas.height) {
		if(x>paddleX&&x<paddleX+paddleWidth&&y+ballRadius>=canvas.height-paddleHeight) {
			dy=-dy;
			dy*=1.05;
		}
		else {
			lives--;
			if(lives) {
				resetBallPaddle();
			}
			/*
			if(!lives) {
				alert("Game Over");
				document.location.reload();
			} else {
				resetBallPaddle();
			}
			*/
		}
	}

	x += dx;
	y += dy;
	if(rightPressed && paddleX<canvas.width-paddleWidth) {
	    paddleX += 7;
	}
	else if(leftPressed && paddleX>0) {
	    paddleX -= 7;
	}
	requestAnimationFrame(draw);
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawBricks() {
	for (var c = 0; c < brickColumnCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			if(bricks[c][r].status==1) {
				var brickX = (c*(brickWidth + brickPadding))+brickOffsetLeft;
				var brickY = (r*(brickHeight + brickPadding))+brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX,brickY,brickWidth,brickHeight);
				ctx.fillStyle="#0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function drawLives() {
	ctx.font = "16px Arial Bold";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Lives: "+lives, canvas.width-65,20);
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Score: "+score,8,20);
}

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if(relativeX > paddleWidth/2 && relativeX < canvas.width-paddleWidth/2) {
		paddleX = relativeX - paddleWidth/2;
	}
}

function resetBallPaddle() {
	x = canvas.width/2;
	y = canvas.height-30;
	dx = 2;
	dy = -2;
	paddleX = (canvas.width-paddleWidth)/2;
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

draw();
