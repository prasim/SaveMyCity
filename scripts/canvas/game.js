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

//Cars image
var carsReady = false;
var carsImage = new Image();
carsImage.onload = function() {
	carsReady = true;
}
carsImage.src = imgFolder + "smallCar.png";

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


// --------------------- Images End ------------------------

// --------------------- Game Objects -------------------------

var buildings = {
	iNoOfBuildings: 0,
	threshold: 10,
	smallBuildingValue: 1,
	mediumBuildingValue: 2,
	tallBuildingValue: 5
};

var aMediumBuildings = [];

var aSmallBuildings = [];

var aTallBuildings = [];

var aCars = [{
	x:0,
	y:487,
	direction: 'right',
},
{
	x:50,
	y:487,
	direction: 'right',
},
{
	x:canvas.width,
	y:515,
	direction: 'left',
}];

var water = {
	speed: 1,
	xHigh: 560,
	xLow: 768,
	x: 0,
	y: 560
};

var lifeLine = {
	progress: 0,
	low: 0,
	speed: 0.1,
	backgroundColor: "#000000",
	lifeLineColor: "#008000"
};

var rect = {
    x:250,
    y:350,
    width:200,
    height:100
};
var buttons = [{
	top:20,
   	left:20,
    width:200,
    height:100,
    colour: '#05EFFF',
    text: 'Add Buildings',
    funcName: 'addBuilding'
}]
var ballsTouched = 0;
var direction;

// --------------------- Game Objects End -------------------------

// --------------------- API functions for updating the Canvas ------------------------

// Adding buildings to the canvas
var addBuildings = function (iNoOfBuildings) {
	var currentBuildings = iNoOfBuildings;
	// Small Buildings
	var small = Math.min(Math.ceil(iNoOfBuildings / buildings.smallBuildingValue), buildings.threshold);
	aSmallBuildings.splice(0, aSmallBuildings.length);
	var smallBuildings = 250;
	for (var i = 0; i < small; i++) {
		aSmallBuildings.push({
			x: smallBuildings,
			y: (i % 2 === 0) ? 400 : 350
		});
		smallBuildings += 100;
	}
	currentBuildings -= buildings.smallBuildingValue * small;
	
	// Medium Buildings
	var medium = Math.min(Math.ceil(currentBuildings / buildings.mediumBuildingValue), buildings.threshold);
	aMediumBuildings.splice(0, aMediumBuildings.length);
	var mediumBuildings = 300;
	for (var i = 0; i < medium; i++) {
		aMediumBuildings.push({
			x: mediumBuildings,
			y: (i % 2 !== 0) ? 350 : 300
		});
		mediumBuildings += 100;
	}
	currentBuildings -= buildings.mediumBuildingValue * medium;
	
	// Tall Buildings
	var tall = Math.min(Math.ceil(currentBuildings / buildings.tallBuildingValue), buildings.threshold);
	aTallBuildings.splice(0, aTallBuildings.length);
	var tallBuildings = 250;
	for (var i = 0; i < tall; i++) {
		aTallBuildings.push({
			x: tallBuildings,
			y: (i % 2 === 0) ? 250 : 200
		});
		tallBuildings += 100;
	}
	currentBuildings -= buildings.tallBuildingValue * tall;
	
	if (currentBuildings > 0) {
		buildings.threshold += 1;
		addBuildings(currentBuildings);
	}
};

var updateNoOfBuildings = function (iNoOfBuildings) {
	buildings.iNoOfBuildings = iNoOfBuildings;
	addBuildings(iNoOfBuildings);
};

// --------------------- API functions for updating the Canvas Ends ------------------------

// --------------------- UI Actions --------------------------------
var self= this;
canvas.addEventListener('click', function(event) {
    var x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;

    // Collision detection between clicked offset and element.
    buttons.forEach(function(element) {
        if (y > element.top && y < element.top + element.height 
            && x > element.left && x < element.left + element.width) {
        	self[element.funcName]();
        }
    });
}, false);
var smallBuildingsX=0;
var addBuilding = function() {
	aSmallBuildings.push({
		x : smallBuildingsX,
		y : 400
	});
	smallBuildingsX += 50;  
}
/* // Handle mouse position
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
  } */

// --------------------- UI Actions Ends --------------------------------

// Moving the Ball
var update = function (modifier) {
	var life = lifeLine.progress + (lifeLine.speed * modifier);
	if (life <= 1) {
		lifeLine.progress = life;
	} else {
		lifeLine.progress = lifeLine.low;
	}
	var level = water.y + (water.speed * modifier);
	if (level < water.xLow) {
		water.y = level;
	} else {
		water.y = water.xHigh;
	}

	/*cars Movement*/
	aCars.forEach(function(car) {
		if(car.direction == 'left'){
			if (car.x < canvas.width) {
        		car.x = car.x+1;
	        } else {
	        	car.x = 0;
	        }
		}else {
			if (car.x > 0) {
        		car.x = car.x-1;
	        } else {
	        	car.x = canvas.width;
	        }			
		}
        
    });

};

// ----------------------------- Canvas Rendering -------------------------------------
// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
	
	addBuildings(buildings.iNoOfBuildings);
	updateNoOfBuildings(80);
	
	for (var i=0; i<aTallBuildings.length; i++) {
		if (tallBuildingReady) {
			ctx.drawImage(tallBuildingImage, aTallBuildings[i].x, aTallBuildings[i].y);
		}
	}
	for (var i=0; i<aCars.length; i++) {
		if (carsReady) {
			ctx.drawImage(carsImage, aCars[i].x, aCars[i].y, 25, 25);
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
	
	ctx.globalAlpha = 0.8;
	
	if (waterReady) {
		ctx.drawImage(waterImage, water.x, water.y);
	}
	
	ctx.globalAlpha = 1;
	
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Number of balls captured : " + ballsTouched, 32, 32);
	buttons.forEach(function(button) {
		var rect = canvas.getContext("2d");
	    rect.fillStyle = button.colour;
	    rect.fillRect(button.left, button.top, button.width, button.height);
	    rect.fillText(button.text,32,32);
	});
	
	// Life Line
    var grad = ctx.createLinearGradient(0, 0, 1400, 0);
    grad.addColorStop(0, lifeLine.lifeLineColor);
    grad.addColorStop(lifeLine.progress, lifeLine.lifeLineColor);
	grad.addColorStop(lifeLine.progress, lifeLine.backgroundColor);
	grad.addColorStop(1, lifeLine.backgroundColor);
    ctx.fillStyle = grad;
    ctx.fillRect(16, 50, 1400, 25);
};

// ----------------------------- Canvas Rendering Ends -------------------------------------

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