/**
	* This function  is to find the next possible value of the time series
	* @param {array} inputArray is the array of time series input
	* @param {number} alpha value is the relative value to be passed 
	* @param {number} m2 next possible value is returned
*//*
function exp_smoothing(inputArray, alpha){
	var m1,y1;
	m1 = inputArray[0];
	y1 = inputArray[0];
	for(var i=1;i<inputArray.length;i++){
		m2 = alpha* inputArray[i] + (1-alpha) * y1;
		y1 = m2;
	}
	console.log("The new value is "+ m2);
	return m2;
  }*/

  (function(angular){
	var module = angular.module('Game.Algorithms',[
		'Game.Service']);
	module.factory('gameAlgorithms',[
		'gameService',
		function(gameService) {
			
			var currentData = '';
			
			function GameAlgorithms() {
				//adding the entire game data
				this.gameData = "";
				this.gameBeginYear = 2000;
				this.gameEndYear = 2016;
				//newly updated data or temp data
				this._currentGameData = "";
			};

			GameAlgorithms.prototype = (function () {
				
					//Add All the functions here and also in the return block
					function getCityData(scope) {
						//var self = this,
							promise = gameService.getGameData();
						promise.then(function (data) {
							this._gameData = '';
							var _data = data.data.NASADATA.cities[0];
							//self._gameData.Population_2010_16 = _data.Population_2010_16[0];
							//self._gameData.Temprature = _data.Temprature[0];
							this.loadCity(data.data.NASADATA.cities[0],this.gameBeginYear,this.gameEndYear);
							localStorage.setItem('exitGame',false)
							//var oRunSimulation = setTimeout(loadCity(gameData),);
							return this._gameData;
							console.log('Fetching city data complete');
						}.bind(this))
					}
					
					//To be called on a time series basis
					function loadCity(gameData , i ,gameEndYear){
							if (i==gameEndYear+1){
								this.gameData = gameData;
								this.runCity(gameData,i-1,gameEndYear,1.9);
								return;
							}				
							
							var _population = [];
							var _numberOfInitBuildings;
							//to find new population
							/*for (this.gameBeginYear;i<=gameEndYear;i++) {
								_population.push(gameData.Population_2010_16[0][i]);								
							}*/
							//start with these number of buildings
							_numberOfInitBuildings = Math.trunc(gameData.Population_2010_16[0][i]/(gameData.Population_2010_16[0][gameEndYear]/40));
							_numberOfVechicles = Math.trunc(gameData.Population_2010_16[0][i]/(gameData.Population_2010_16[0][gameEndYear]/30));
							
							window._defaultNumberTrees;
							//number of tress - the current temprature
							_numberOfTrees = Math.trunc(100 - gameData.Temprature[0][i].split(',')[0]*1.3);
							console.log(_numberOfVechicles+ ' and  '+_numberOfTrees+' and '+_numberOfInitBuildings);
							//var oRunSimulation = setTimeout(loadCity(gameData,i+1),300);
							updateNoOfBuildings(_numberOfInitBuildings);
							updatePopulation(gameData.Population_2010_16[0][i]);
							updateTemperature(gameData.Temprature[0][i].split(',')[0]);
							updateNoOfTrees(_numberOfTrees);
							_defaultNumberTrees = _numberOfTrees;
							//find percentage for water level
							var sArrayWaterLevel = sortArray(gameData.GroundWaterLevel[0],this.gameBeginYear,this.gameEndYear); 
							//taking 30% of the water level for simulation
							waterPercentage = ((gameData.GroundWaterLevel[0][i] - sArrayWaterLevel[0])/(sArrayWaterLevel[sArrayWaterLevel.length-1] - sArrayWaterLevel[0]))*30;
							updateWaterLevel(100 - Math.trunc(waterPercentage));
							updateWaterLevelValue(gameData.GroundWaterLevel[0][i] + " ft");
							
							
							//updating life line 
							var lifeLine = this.calculateLifeLine(gameData , i);
							updateProgressBar(lifeLine);
							
							setTimeout(function()
								{
										this.loadCity(gameData,i+1,gameEndYear);
								
								}.bind(this),100);
							
					}
					
					function calculateLifeLine(gameData, i){
						window.tresholdMonitor = {};
						tresholdMonitor.populationThreshold="11781204";
						tresholdMonitor.tempratureThreshold="55";
						tresholdMonitor.waterLevelThreshold="3000";
						tresholdMonitor.treeCount = "10";
						fShareInLifeLine = Object.keys(tresholdMonitor).length /18;
						window.populationShareInLifeLine = .06;
						
						var lifeLine = (tresholdMonitor.populationThreshold / gameData.Population_2010_16[0][i]) * populationShareInLifeLine +
						(tresholdMonitor.tempratureThreshold / gameData.Temprature[0][i].split(',')[0]) * fShareInLifeLine +
						(gameData.GroundWaterLevel[0][i]/tresholdMonitor.waterLevelThreshold) * fShareInLifeLine;
						
						return Math.trunc(lifeLine*100);
					}
					
					function sortArray(obj,i,j){
							var sortedArrary = [];
							for (i;i<=j;i++) {
								sortedArrary.push( parseInt(Math.trunc(obj[i])));
								//console.log(_population);
							}
							sortedArrary = sortedArrary.sort(function(a, b){return a-b});
							//console.log(sortedArrary);
							return sortedArrary;
					}
					
					
					//To be called after starting the game
					function runCity(gameData , i,gameEndYear,alpha){
							if (window.exitGame || (gameData.Population_2010_16[0][i]/(gameData.Population_2010_16[0][gameEndYear]))>2){
								return;
							}					
							console.log("City simulation in progress");
							
							var _population = [];
							var _numberOfInitBuildings;
							var j = this.gameBeginYear;
							for (j;j<=i;j++) {
								_population.push(gameData.Population_2010_16[0][j]);
								//console.log(_population);
							}
							var _newPopulation = Math.trunc(this.exp_smoothing(_population.slice(_population.length-10,_population.length),alpha)).toString();
							
							//updates 
							gameData.Population_2010_16[0][++i] = (parseInt(_newPopulation) + parseInt(gameData.Population_2010_16[0][this.gameBeginYear]/10)).toString();
							
							//alpha = alpha;
							//console.log(i+''+gameData.Population_2010_16[0]);
							//start with these number of buildings
							_numberOfInitBuildings = Math.trunc(gameData.Population_2010_16[0][i]/(gameData.Population_2010_16[0][gameEndYear]/40));
							_numberOfVechicles = Math.trunc(gameData.Population_2010_16[0][i]/(gameData.Population_2010_16[0][gameEndYear]/30));
							
							//number of tress - the current temprature
							//_numberOfTrees = Math.trunc(60 - gameData.Temprature[0][i].split(',')[0]);
							//console.log(_numberOfVechicles+ ' and   and '+_numberOfInitBuildings);
							updateNoOfBuildings(_numberOfInitBuildings);
							updatePopulation(gameData.Population_2010_16[0][i]);
							
							//Temprature
							var totalnumberTrees = 80;
							_oldNumber = Math.trunc(100 - gameData.Temprature[0][i-1].split(',')[0]*1.3);
							var _newTemprature= Math.trunc((gameData.Population_2010_16[0][i-1]/gameData.Population_2010_16[0][gameEndYear])*gameData.Temprature[0][gameEndYear].split(',')[0]).toString();
							_newTemprature = _newTemprature - (retriveNoOfTrees() - _defaultNumberTrees)*.2;
							
							
							//_defaultNumberTrees
							//since we are just adding  , reference value not required
							_newTemprature = _newTemprature - retriveNoOfSolarPanels()*.3;
							_newTemprature = _newTemprature - retriveNoOfCars()*.3;
							_newTemprature = _newTemprature - retriveNoOfWindMills()*.3;
							
							updateTemperature(_newTemprature);
							gameData.Temprature[0][i] = _newTemprature+',';
							
							//WaterLevel - consider number of trees here
							var sArrayWaterLevel = sortArray(gameData.GroundWaterLevel[0],this.gameBeginYear,this.gameEndYear); 
							//taking 30% of the water level for simulation
							waterPercentage = ((gameData.GroundWaterLevel[0][i-1] - sArrayWaterLevel[0])/(sArrayWaterLevel[sArrayWaterLevel.length-1] - sArrayWaterLevel[0]))*30;
							gameData.GroundWaterLevel[0][i] = (sArrayWaterLevel[sArrayWaterLevel.length-1] - 3*(retriveNoOfTrees()-_defaultNumberTrees) + 
							Math.trunc((gameData.Population_2010_16[0][i-1]/gameData.Population_2010_16[0][gameEndYear] ))*50).toString(); 
							updateWaterLevel(100 - Math.trunc(waterPercentage));
							updateWaterLevelValue(gameData.GroundWaterLevel[0][i] + " ft");
							
							
							var lifeLine = this.calculateLifeLine(gameData , i);
							updateProgressBar(lifeLine);
							
							setTimeout(
								function() {
										this.runCity(gameData,i,gameEndYear,alpha);
								}.bind(this),1500);							
					}
					
					function exp_smoothing(inputArray, alpha){
						var m1,y1;
						m1 = inputArray[0];
						y1 = inputArray[0];
						for(var i=1;i<inputArray.length;i++){
							m2 = alpha* inputArray[i] + (1-alpha) * y1;
							y1 = m2;
						}
						console.log("The new value is "+ Math.trunc(m2));
						return m2;
					}
					return {
						getCityData : getCityData,
						exp_smoothing : exp_smoothing,
						loadCity : loadCity,
						runCity : runCity,
						sortArray : sortArray,
						calculateLifeLine :calculateLifeLine
					}
				})();			
		 	return {
				
		    	getCurrentInstance : function() {
		    		if(!currentData) {
		    			currentData = new GameAlgorithms();
		    		}
		    		return currentData;
		    	}
		    }
	  	}	
	]);
})(angular);