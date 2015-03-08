'use strict';
angular.module('solobuy.controllers', [])
.controller('homeCntrl', function($scope, $state, $http, $q) {
	navigator.geolocation.getCurrentPosition(function(position) {
		//$http.defaults.headers.get = { 'If-Checked-Since' : new Date().getTime() };
		$http.get('http://104.236.44.62:3000/search?lat=' + position.coords.latitude + '&long=' + position.coords.longitude).
			success(function(data, status, headers, config) {
				$scope.items = data;
			}).
			error(function(data, status, headers, config) {
				console.log("Failed");
				console.dir(config);
				console.log("Error:" + status);
				return 0;
			});

			$http.get('http://104.236.44.62:3000/town?lat=' + position.coords.latitude + '&long=' + position.coords.longitude).
				success(function(data, status, headers, config) {
					$scope.town = data.obj.name;
					$scope.radius = 100;
				}).
				error(function(data, status, headers, config) {
					console.log("Failed");
					console.log("Error:" + status);
					$scope.town = "NaN";
					$scope.radius = 100;
					return 0;
				});
		});
})
.controller('itemCntrl', function($scope, $state, $stateParams, $http, $q) {
  $http.get('http://104.236.44.62:3000/item/' + $stateParams.id).
    success(function(data, status, headers, config) {
      $scope.item = data[0];
			$scope.imageList = data[0].image_urls;
    }).
    error(function(data, status, headers, config) {
      console.log("Failed");
      console.log("Error:" + status);
      return 0;
    });
})
.controller('searchCntrl', function($scope, $state, $q) {
  console.log("I don't do anything! :D")
})
.controller('accountCntrl', function($scope, $state, $q) {
  console.log("I don't do anything! :D")
})

//$scope.CallTel = function(tel) {
//            window.location.href = 'tel:'+ tel;
//}
//imgslide.controller ('ImgSlideCntrl', function(scope) {
//    $scope.imgSlide = function(index) {
//    $ionicSlideBoxDelegate.slide(index, 500);
//    }
//});
