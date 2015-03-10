'use strict';
angular.module('solobuy.controllers', [])
.controller('homeCntrl', function($scope, $state, $http, $q) {
	var lastUpdate  = 0;
	console.log("Trying to update (1)...");
	if(lastUpdate < new Date().getTime()) {  //Hack-ish caching! Woo!
		navigator.geolocation.getCurrentPosition(function(position) {
			console.log("Updating (1)...");
			lastUpdate = new Date(new Date().getTime() + 60000);  //1 minute
			console.log(lastUpdate);
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
		}
		else {
			console.log("Failed");
		}

		$scope.refreshList = function() {
			console.log("Trying to update (2)...");
			if(lastUpdate < new Date().getTime()) {  //Hack-ish caching! Woo!
				navigator.geolocation.getCurrentPosition(function(position) {
					console.log("Updating (2)...");
					lastUpdate = new Date(new Date().getTime() + 60000);  //1 minute
					console.log(lastUpdate);
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
				}
				else {
					$scope.$broadcast('scroll.refreshComplete');
					$scope.$apply();
					return false;
				}
		};
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
.controller('searchCntrl', function($scope, $state, $http, $q) {
	navigator.geolocation.getCurrentPosition(function(position) {
		var nearbyTowns;
		$http.get('http://104.236.44.62:3000/town?lat=' + position.coords.latitude + '&long=' + position.coords.longitude + '&dist=100').
			success(function(data, status, headers, config) {
				console.dir(data);
				nearbyTowns = data.slice(0, 5);
			}).
			error(function(data, status, headers, config) {
				console.log("Failed");
				console.dir(config);
				console.log("Error:" + status);
			});
  		$scope.geo = { distance: 300, nearbyTowns: nearbyTowns }
	});
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
