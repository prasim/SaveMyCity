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

// Cloud image
var cloudReady = false;
var cloudImage = new Image();
cloudImage.onload = function () {
	cloudReady = true;
};
cloudImage.src = imgFolder + "cloud.png";

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

var aCars = [];

var aSolarPanels = [];

var aWindMills = [];

var aTrees = [];

var aClouds = [];

var water = {
	xHigh: 560,
	xLow: 768,
	x: 0,
	y: 560
};

var lifeLine = {
	progress: 0,
	backgroundColor: "#e9f6fb",
	lifeLineColor: "#008000",
	normal: "#008000",
	danger: "#ff0000",
	warning: "#ff4500"
};

var oButtons = {};

var bTreeButton = true;
var bSolarCarsButton = true;
var bWindmillButton = true;
var bSolarPanelButton = true;
var bClouds = true;
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

var addCars = function (iNoOfCars) {
	if (iNoOfCars > aCars.length) {
		for(var i = 0; i < (iNoOfCars - aCars.length); i++) {
			var carSpec = {
				x: (aCars.length > 1) ? (aCars[aCars.length - 2].direction === 'right') ? aCars[aCars.length - 2].x + 50 : aCars[aCars.length - 2].x - 50 : canvas.width,
				y: (aCars.length > 0 && aCars[aCars.length - 1].direction === 'right') ? 515 : 487,
				direction: (aCars.length > 0 && aCars[aCars.length - 1].direction === 'right') ? 'left' : 'right',
			};
			aCars.push(carSpec);
		}
	} else {
		aCars.splice(0, aCars.length - iNoOfCars);
	}
};

var retriveNoOfCars = function () {
	return aCars.length;
};

var addSolarPanels = function (iNoOfSolarPanels) {
	aSolarPanels.splice(0, aSolarPanels.length);
	var x=0, y=320, xLim=230;
	for(var i = 0; i < iNoOfSolarPanels; i++) {
		aSolarPanels.push({
			x: x,
			y: y
		});
		if ((x + 20) <= xLim) {
			x+=20;
		} else {
			x=0;
			y+=20;
		}
	}
};

var retriveNoOfSolarPanels = function () {
	return aSolarPanels.length;
};

var addWindMills = function (iNoOfWindMills) {
	aWindMills.splice(0, aWindMills.length);
	var x=1300, y=320, xLim=canvas.width;
	for(var i = 0; i < iNoOfWindMills; i++) {
		aWindMills.push({
			x: x,
			y: y
		});
		if ((x + 20) <= xLim) {
			x+=20;
		} else {
			x=1300;
			y+=20;
		}
	}
};

var retriveNoOfWindMills = function () {
	return aWindMills.length;
};

var addTrees = function (iNoOfTrees) {
	aTrees.splice(0, aTrees.length);
	var x=0, y=460, xLim=canvas.width;
	for(var i = 0; i < iNoOfTrees; i++) {
		aTrees.push({
			x: x,
			y: y
		});
		if ((x + 20) <= xLim) {
			x+=20;
		} else {
			x=0;
			y=520;
		}
	}
};

var retriveNoOfTrees = function () {
	return aTrees.length;
};

var updateNoOfTrees = function (iNoOfTrees) {
	addTrees(iNoOfTrees);
};

var addClouds = function (iNoOfClouds) {
	aClouds.splice(0, aClouds.length);
	var x=0;
	for(var i = 0; i < iNoOfClouds; i++) {
		aClouds.push({
			x: x,
			y: 120
		});
		x+=250;
	}
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
	if(lifeLine.progress > 0.40) {
		lifeLine.lifeLineColor = lifeLine.normal;
	} else if (lifeLine.progress <= 0.40 && lifeLine.progress > 0.10) {
		lifeLine.lifeLineColor = lifeLine.warning;
	} else {
		lifeLine.lifeLineColor = lifeLine.danger;
	}
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
	
	/* For Clouds*/
	for(var i = 0; i < aClouds.length; i++) {
		aClouds[i].x += 1;
		if (aClouds[i].x > canvas.width) {
			aClouds[i].x = 0;
		}
	}
};

// ----------------------------- Canvas Rendering -------------------------------------
// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
	
	addBuildings(buildings.iNoOfBuildings);
	addSolarPanels(aSolarPanels.length);
	//updateProgressBar(100);
	//updateWaterLevel(50);
	//addCars(10);
	/*updatePopulation("1,00,00,000");
	updateTemperature("26 degrees");
	updateWaterLevelValue("60,000 feet");
	updateMoney("20,000 dollars");*/
	if (bClouds) {
		addClouds(6);
		bClouds = false;
	}
	
	// Clouds
	for (var i=0; i<aClouds.length; i++) {
		if (cloudReady) {
			ctx.drawImage(cloudImage, aClouds[i].x, aClouds[i].y);
		}
	}
	
	if(bTreeButton) {
		makeButton("Add Trees", 16, function () {
			addTrees(aTrees.length + 1);
		});
		bTreeButton = false;
	}
	drawButton("Add Trees");
	
	if(bWindmillButton) {
		makeButton("Add Windmill", 74, function () {
			addWindMills(aWindMills.length + 1);
		});
		bWindmillButton = false;
	}
	drawButton("Add Windmill");
	
	if(bSolarPanelButton) {
		makeButton("Add Solar Panel", 132, function () {
			addSolarPanels(aSolarPanels.length + 1);
		});
		bSolarPanelButton = false;
	}
	drawButton("Add Solar Panel");
	
	if(bSolarCarsButton) {
		makeButton("Add Solar Cars", 190, function () {
			addCars(aCars.length + 1);
		});
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
	
	// Draw Solar Panels
	for (var i=0; i<aSolarPanels.length; i++) {
		if (solarPanelReady) {
			ctx.drawImage(solarPanelImage, aSolarPanels[i].x, aSolarPanels[i].y, 25, 25);
		}
	}
	
	// Draw WindMills
	for (var i=0; i<aWindMills.length; i++) {
		if (windmillReady) {
			ctx.drawImage(windmillImage, aWindMills[i].x, aWindMills[i].y, 25, 25);
		}
	}
	
	// Draw Trees
	for (var i=0; i<aTrees.length; i++) {
		if (treeReady) {
			ctx.drawImage(treeImage, aTrees[i].x, aTrees[i].y, 25, 25);
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
	ctx.font = "22px Times New Roman";
	ctx.fillText("Your Life Line", 670, 16);
	
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