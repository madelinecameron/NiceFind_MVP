angular.module('starter.controllers',  [])

.controller('HomeCtrl', function($scope, $http, Search) {
	$http.get('http://localhost:3000/search?lat=37.956002&long=-91.774363').
		success(function(data, status, headers, config) {
			$scope.items = data;
			console.log("Json: " + $scope.items);
		}).
		error(function(data, status, headers, config) {
			console.log("Failed");
			console.log("Error:" + status);
			return 0;
	});
})

.controller('SearchCtrl', function($scope, Search) {
  $scope.friends = Search.all();
})

.controller('SearchDetailCtrl', function($scope, $stateParams, Search) {
  $scope.search = Search.get($stateParams.searchId);
})

.controller('AccountCtrl', function($scope) {
});
