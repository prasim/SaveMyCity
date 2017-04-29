// Create the canvas
var canvas = $("canvas").get()[0];
canvas.width = 1551;
canvas.height = 768;
var ctx = canvas.getContext("2d");

// --------------------- Images ------------------------

var imgFolder = "../../images/"

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = imgFolder + "background.png";

// Water image
var waterReady = false;
var waterImage = new Image();
waterImage.onload = function () {
	waterReady = true;
};
waterImage.src = imgFolder + "Water.jpg";

// Medium Building image
var mediumBuildingReady = false;
var mediumBuildingImage = new Image();
mediumBuildingImage.onload = function () {
	mediumBuildingReady = true;
};
mediumBuildingImage.src = imgFolder + "BuildingMedium.png";

// Tall Building image
var tallBuildingReady = false;
var tallBuildingImage = new Image();
tallBuildingImage.onload = function () {
	tallBuildingReady = true;
};
tallBuildingImage.src = imgFolder + "BuildingTall.png";

// Small Building image
var smallBuildingReady = false;
var smallBuildingImage = new Image();
smallBuildingImage.onload = function () {
	smallBuildingReady = true;
};
smallBuildingImage.src = imgFolder + "BuildingSmall.png";

// Hero image
var playerReady = false;
var playerImage = new Image();
playerImage.onload = function () {
	playerReady = true;
};
playerImage.src = imgFolder + "lol.png";

// Monster image
var ballReady = false;
var ballImage = new Image();
ballImage.onload = function () {
	ballReady = true;
};
ballImage.src = imgFolder + "silverball.png";

// --------------------- Images End ------------------------

// --------------------- Game Objects -------------------------

var aMediumBuildings = [ {
	x: 707,
	y: 350
},
{
	x: 760,
	y: 350
}];

var aSmallBuildings = [ {
	x: 700,
	y: 400
},
{
	x: 753,
	y: 400
}];

var aTallBuildings = [ {
	x: 700,
	y: 250
},
{
	x: 753,
	y: 250
}];

var water = {
	speed: 1,
	xHigh: 560,
	xLow: 768,
	x: 0,
	y: 560
};

var player = {
	speed: 128, // movement in pixels per second
	x: canvas.width/2,
	y: 610
};
var ball = {
	speed: 128,
	y: 0,
	x: 50
};
var ballsTouched = 0;
var direction;

// --------------------- Game Objects End -------------------------

// Handle mouse position
var mousePos;
addEventListener('mousemove', function(evt) {
    mousePos = getMousePos(canvas, evt);
    player.x=mousePos.x;
  }, false);

// Mouse Position
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

// Moving the Ball
var update = function (modifier) {
	var level = water.y + (water.speed * modifier);
	if (level < water.xLow) {
		water.y = level;
	} else {
		water.y = water.xHigh;
	}
	var distance = ball.speed * modifier;
	if(ball.y<640){
		ball.y += distance;
	} else {
		ball.y = 0;
		ball.x = Math.random()*canvas.width;
		direction = (Math.random()<0.5)?false:true;
	}
	if(direction){
		if((ball.x + distance) <= 940) {
			ball.x += distance;
		} else {
			direction=false;
			ball.x -= distance;
		}
	} else {
		if((ball.x - distance) >= 0) {
			ball.x -= distance;
		} else {
			direction=true;
			ball.x += distance;
		}
	}
	// Are they touching?
	//console.log(ball.y);
	if (ball.x >= (player.x - 15) && (player.x + 91) >= ball.x && ball.y>=600 && ball.y<=602) {
		++ballsTouched;
		ball.y = 0;
		ball.x = Math.random()*canvas.width;
		direction = (Math.random()<0.5)?false:true;
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
	
	for (var i=0; i<aTallBuildings.length; i++) {
		if (tallBuildingReady) {
			ctx.drawImage(tallBuildingImage, aTallBuildings[i].x, aTallBuildings[i].y);
		}
	}
	
	for (var i=0; i<aMediumBuildings.length; i++) {
		if (mediumBuildingReady) {
			ctx.drawImage(mediumBuildingImage, aMediumBuildings[i].x, aMediumBuildings[i].y);
		}
	}
	
	for (var i=0; i<aSmallBuildings.length; i++) {
		if (smallBuildingReady) {
			ctx.drawImage(smallBuildingImage, aSmallBuildings[i].x, aSmallBuildings[i].y);
		}
	}
	
	ctx.globalAlpha = 0.5;
	
	if (waterReady) {
		ctx.drawImage(waterImage, water.x, water.y);
	}
	
	ctx.globalAlpha = 1;
	
	if (playerReady) {
		ctx.drawImage(playerImage, player.x, player.y);
	}
	
	if (ballReady) {
		ctx.drawImage(ballImage, ball.x, ball.y);
	}
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Number of balls captured : " + ballsTouched, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();
	
	then = now;
	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
main();