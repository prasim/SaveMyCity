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
					function getCityData() {
						var self = this,
							promise = gameService.getGameData();
						promise.then(function (data) {
							self._gameData = '';
							var _data = data.data.NASADATA.cities[0];
							//self._gameData.Population_2010_16 = _data.Population_2010_16[0];
							//self._gameData.Temprature = _data.Temprature[0];
							self.loadCity(data.data.NASADATA.cities[0],self.gameBeginYear,self.gameEndYear);
							//var oRunSimulation = setTimeout(loadCity(gameData),);
							return self._gameData;
							console.log('Fetching city data complete');
						})
					}
					
					//To be called on a time series basis
					function loadCity(gameData , i ,gameEndYear){
							if (i==gameEndYear+1){
								return;
							}					
							console.log("City simulation in progress");
							//var i = 	;
							var _population = [];
							var _numberOfInitBuildings;
							/*for (this.gameBeginYear;i<2017;i++) {
								_population.push(gameData.Population_2010_16[0][i]);
								console.log(gameData.Population_2010_16[0][i]);
							}*/
							//start with these number of buildings
							_numberOfInitBuildings = Math.trunc(gameData.Population_2010_16[0][i]/(gameData.Population_2010_16[0][gameEndYear]/40));
							_numberOfVechicles = Math.trunc(gameData.Population_2010_16[0][i]/(gameData.Population_2010_16[0][gameEndYear]/30));
							
							//number of tress - the current temprature
							_numberOfTrees = Math.trunc(60 - gameData.Temprature[0][i].split(',')[0]);
							console.log(_numberOfVechicles+ ' and  '+_numberOfTrees+' and '+_numberOfInitBuildings);
							//var oRunSimulation = setTimeout(loadCity(gameData,i+1),300);
							setTimeout(loadCity(gameData,i+1,gameEndYear),100);
					}
					
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
					}
					return {
						getCityData : getCityData,
						exp_smoothing : exp_smoothing,
						loadCity : loadCity
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