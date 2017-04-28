(function(angular) {
	var module = angular.module('Game.Service',[]);
	module.service('gameService',[
		'$http',
		function($http) {
			this.getGameData = function() {
				return $http.get('../runitMan/data.json').success(function(data) {
					return data;
				})
			};
	}]);
})(angular);