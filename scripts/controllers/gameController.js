(function(angular) {
	var module = angular.module('Game.Controller',[
		'Game.Model','Game.Algorithms']);
		module.controller('gameCtrl',[
			'$scope',
			'gameModel', 
			'gameAlgorithms',
			function ($scope, gameModel, gameAlgorithms) {
				$scope.gameAlgorithms = gameAlgorithms.getCurrentInstance();
				$scope.gameAlgorithms.getCityData();
				$scope.gameModel = gameModel.getCurrentInstance();
				$scope.gameModel.getGameData();
		}]);
})(angular);