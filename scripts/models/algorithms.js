/**
	* This function  is to find the next possible value of the time series
	* @param {array} inputArray is the array of time series input
	* @param {number} alpha value is the relative value to be passed 
	* @param {number} m2 next possible value is returned
*/
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
  
  (function(angular){
	var module = angular.module('Game.Algorithms',[
		'Game.Service']);
	module.factory('algorithms',[
		'gameService',
		function(gameService) {
			
			var currentData = '';
			function GameAlgorithms() {
				//this.cartData = ''
			};

			GameAlgorithms.prototype = (function () {
					function getGameData() {
						var self = this,
							promise = gameService.getGameData();
						promise.then(function (data) {
							self.gameData = data.data.Details;
						})
					}
					return {
						getGameData : getGameData
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