(function(angular) {
	var module = angular.module('Game.Controller',[
		'Game.Model','Game.Algorithms']);
		module.controller('gameCtrl',[
			'$scope',
			'gameModel', 
			'gameAlgorithms',
			function ($scope, gameModel, gameAlgorithms) {
				//initalization
				$scope.gameAlgorithms = gameAlgorithms.getCurrentInstance();
				//get current data and start the game
				$scope.gameAlgorithms.gameData = $scope.gameAlgorithms.getCityData();
				//run the city after the initial time load
				//$scope.gameAlgorithms.updateCity($scope.gameAlgorithms.gameData)
				//var progressGame = setTimeout($scope.gameAlgorithms.updateCity,400);
							
				
				//$scope.gameAlgorithms.getCityData();
				$scope.gameModel = gameModel.getCurrentInstance();
				$scope.gameModel.getGameData();
		}]);
})(angular);