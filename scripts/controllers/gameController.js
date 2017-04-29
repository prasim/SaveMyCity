(function(angular) {
	var module = angular.module('Game.Controller',[
		'Game.Model','Game.Algorithms']);
		module.controller('gameCtrl',[
			'$scope',
			'gameModel', 
			'gameAlgorithms',
			'$timeout',
			function ($scope, gameModel, gameAlgorithms, $timeout) {
				//initalization
				$scope.canvasDisabled = true;
				$scope.hideProgress = true;
				$scope.gameAlgorithms = gameAlgorithms.getCurrentInstance();
				//get current data and start the game
				//$scope.gameAlgorithms.gameData = $scope.gameAlgorithms.getCityData($scope);
				//run the city after the initial time load
				//$scope.gameAlgorithms.updateCity($scope.gameAlgorithms.gameData)
				//var progressGame = setTimeout($scope.gameAlgorithms.updateCity,400);
							
				
				//$scope.gameAlgorithms.getCityData();
				$scope.gameModel = gameModel.getCurrentInstance();
				$scope.gameModel.getGameData();
				$scope.startTheGame = function() {
					$scope.hideProgress = false
					$scope.progressPercentage = 0;
					increaseProgress();
					$timeout((function(scope) {
						$scope.canvasDisabled = false;
						main();
						$scope.gameAlgorithms.gameData = $scope.gameAlgorithms.getCityData($scope);
					}).bind($scope), 3000);
				};
				var increaseProgress = function() {
					$scope.progressPercentage += 10;
					if(!$scope.canvasDisabled){
						return;
					}
					$timeout((function() {
						increaseProgress();
					}), 30);
				}

		}]);
})(angular);