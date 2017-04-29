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
waterImage.src = imgFolder + "Water4.png";

// Windmill image
var windmillReady = false;
var windmillImage = new Image();
windmillImage.onload = function () {
	windmillReady = true;
};
windmillImage.src = imgFolder + "WindMill.png";

// Tree image
var treeReady = false;
var treeImage = new Image();
treeImage.onload = function () {
	treeReady = true;
};
treeImage.src = imgFolder + "tree.png";

// Solar Panel image
var solarPanelReady = false;
var solarPanelImage = new Image();
solarPanelImage.onload = function () {
	solarPanelReady = true;
};
solarPanelImage.src = imgFolder + "solarPanel.png";

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

var city = {
	currentPopulation: 0,
	currentWaterLevel: 0,
	currentTemperature: 0,
	currentMoney: 0
};

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
	xHigh: 560,
	xLow: 768,
	x: 0,
	y: 560
};

var lifeLine = {
	progress: 0,
	backgroundColor: "#000000",
	lifeLineColor: "#008000"
};

var oButtons = {};

var bTreeButton = true;
var bSolarCarsButton = true;
var bWindmillButton = true;
var bSolarPanelButton = true;
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
};

var retriveNoOfBuildings = function () {
	return buildings.iNoOfBuildings;
};

var updateWaterLevel = function (percentage) {
	var unitWaterLevel = (water.xLow - water.xHigh) / 100;
	water.y = water.xLow - (unitWaterLevel * percentage);
};

var updatePopulation = function (population) {
	city.currentPopulation = population;
};

var updateTemperature = function (temperature) {
	city.currentTemperature = temperature;
};

var updateWaterLevelValue = function (waterLevel) {
	city.currentWaterLevel = waterLevel;
};

var updateMoney = function (money) {
	city.currentMoney = money;
};

var updateProgressBar = function (percentage) {
	lifeLine.progress = (percentage / 100);
};

// --------------------- API functions for updating the Canvas Ends ------------------------

// --------------------- UI Actions --------------------------------

//Function to check whether a point is inside a rectangle
function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}

// Mouse Position
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  
function drawButton (name) {
	var rect = oButtons[name];
	// Drawing Button Area
	ctx.fillStyle = rect.color;
	ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
	
	// Drawing Button Text
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "16px Times New Roman";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText(name, rect.x + 20, rect.y + 15);
	
}

function makeButton (name, y, onClick) {
	var rect = {
		x:1375,
		y:y,
		width:155,
		height:50,
		onClick: onClick,
		color: "#ff0000"
	};
	
	oButtons[name] = rect;
	
	//Binding the click event on the canvas
	canvas.addEventListener('click', function(evt) {
		var mousePos = getMousePos(canvas, evt);

		if (isInside(mousePos,rect)) {
			onClick();
		}   
	}, false);
}

canvas.addEventListener('mousemove', function(evt) {
		var mousePos = getMousePos(canvas, evt);
		
		var bInside = false;
		for (var name in oButtons) {
			if (isInside(mousePos,oButtons[name])) {
				oButtons[name].color = "#000000";
				bInside = true;
			} else {
				oButtons[name].color = "#ff0000";
			}
		}
		
		if (bInside) {
			canvas.classList.add("cursorOnHover");
		} else {
			canvas.classList.remove("cursorOnHover");
		}
	}, false);

// --------------------- UI Actions Ends --------------------------------

// Moving the Ball
var update = function (modifier) {
	
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
	updateProgressBar(10);
	updateWaterLevel(50);
	/*updatePopulation("1,00,00,000");
	updateTemperature("26 degrees");
	updateWaterLevelValue("60,000 feet");
	updateMoney("20,000 dollars");*/
	
	if(bTreeButton) {
		makeButton("Add Trees", 16, function () {console.log("tree");});
		bTreeButton = false;
	}
	drawButton("Add Trees");
	
	if(bWindmillButton) {
		makeButton("Add Windmill", 74, function () {console.log("windmill");});
		bWindmillButton = false;
	}
	drawButton("Add Windmill");
	
	if(bSolarPanelButton) {
		makeButton("Add Solar Panel", 132, function () {console.log("solar panel");});
		bSolarPanelButton = false;
	}
	drawButton("Add Solar Panel");
	
	if(bSolarCarsButton) {
		makeButton("Add Solar Cars", 190, function () {console.log("solar cars");});
		bSolarCarsButton = false;
	}
	drawButton("Add Solar Cars");
	
	// Draw Tall Buildings
	for (var i=0; i<aTallBuildings.length; i++) {
		if (tallBuildingReady) {
			ctx.drawImage(tallBuildingImage, aTallBuildings[i].x, aTallBuildings[i].y);
		}
	}
	
	// Draw Medium Buildings
	for (var i=0; i<aMediumBuildings.length; i++) {
		if (mediumBuildingReady) {
			ctx.drawImage(mediumBuildingImage, aMediumBuildings[i].x, aMediumBuildings[i].y);
		}
	}
	
	// Draw Small Buildings
	for (var i=0; i<aSmallBuildings.length; i++) {
		if (smallBuildingReady) {
			ctx.drawImage(smallBuildingImage, aSmallBuildings[i].x, aSmallBuildings[i].y);
		}
	}
	
	// Draw Cars
	for (var i=0; i<aCars.length; i++) {
		if (carsReady) {
			ctx.drawImage(carsImage, aCars[i].x, aCars[i].y, 25, 25);
		}
	}
	
	ctx.globalAlpha = 0.8;
	
	if (waterReady) {
		ctx.drawImage(waterImage, water.x, water.y);
	}
	
	ctx.globalAlpha = 1;
	
	// Current Situation of the City 
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "16px Times New Roman";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Population: " + city.currentPopulation, 16, 16);
	ctx.fillText("Temperature: " + city.currentTemperature, 16, 40);
	ctx.fillText("Water Level: " + city.currentWaterLevel, 16, 64);
	ctx.fillText("Money: " + city.currentMoney, 16, 88);
	
	// Life Line Text
	ctx.font = "32px Times New Roman";
	ctx.fillText("Your Life Line", 630, 16);
	
	// Life Line
    var grad = ctx.createLinearGradient(450, 0, 1050, 0);
    grad.addColorStop(0, lifeLine.lifeLineColor);
    grad.addColorStop(lifeLine.progress, lifeLine.lifeLineColor);
	grad.addColorStop(lifeLine.progress, lifeLine.backgroundColor);
	grad.addColorStop(1, lifeLine.backgroundColor);
    ctx.fillStyle = grad;
    ctx.fillRect(450, 50, 600, 25);
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