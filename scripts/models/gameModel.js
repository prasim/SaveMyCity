(function(angular){
	var module = angular.module('Game.Model',[
		'Game.Service']);
	module.factory('gameModel',[
		'gameService',
		function(gameService) {
			var currentData = '';
			function GameModel() {
				this.cartData = ''
			};

			GameModel.prototype = (function () {
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
		    			currentData = new GameModel();
		    		}
		    		return currentData;
		    	}
		    }
	  	}	
	]);
})(angular);