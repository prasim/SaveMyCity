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
							self.updateCity(data.data.NASADATA.cities[0]);
							return self._gameData;
							console.log('Fetching city data complete');
						})
					}
					
					//To be called on a time series basis
					function updateCity(gameData){
							console.log("City simulation in progress");
							for(i=2000;i<2017;i++) {
								console.log(gameData.Population_2010_16[0][i]);
							}
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
						updateCity : updateCity
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