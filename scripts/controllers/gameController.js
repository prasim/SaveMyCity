(function(angular) {
	var module = angular.module('Game.Controller',[
		'Game.Model']);
		module.controller('gameCtrl',[
			'$scope',
			'gameModel',
			function ($scope, gameModel) {
				$scope.gameModel = gameModel.getCurrentInstance();
				$scope.gameModel.getGameData();
		}]);
})(angular);