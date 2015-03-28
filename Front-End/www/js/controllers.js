'use strict';
angular.module('nicefind.controllers', ['ionic'])
.controller('homeCntrl', function($scope, $state, $stateParams, $timeout, Items, Towns, $ionicScrollDelegate) {
		var lastUpdate = 0;
		var farestDist = 0;  //Farest distance seen so far

	if(lastUpdate < new Date().getTime()) {  //Hack-ish caching! Woo!
			navigator.geolocation.getCurrentPosition(function(position) {
				if(typeof $stateParams.maxDist === 'undefined') { //If maxDist is undef, get all
					console.log("Loading items from all!");
					Items.getAll(position, 0).then(function(response) {
						angular.forEach(response.data, function(value, key) {
								//If value is greater than farest dist, assign value else re-assign farestDist
								farestDist = (value.dis > farestDist ? value.dis : farestDist);
						});
						$scope.items = response.data;
					});
				}
				else {
					console.log("Loading items from search query!")
					Items.getSelection($stateParams.category, 0, $stateParams.maxDist, position).then(function(response) {
							angular.forEach(response.data, function(value, key) {
									//If value is greater than farest dist, assign value else re-assign farestDist
									farestDist = (value.dis > farestDist ? value.dis : farestDist);
							});
							$scope.items = response.data;
					});
				}
			 	Towns.getNearest(position).then(function(response) {
					$scope.town = response.data.obj.name;
					$scope.radius = 100;
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

					if(typeof $stateParams.maxDist === 'undefined') {
						$timeout(function() {
								Items.getAll(position, 0).then(function(response) {
								angular.forEach(response.data, function(value, key) {
										//If value is greater than farest dist, assign value else re-assign farestDist
										farestDist = (value.dis > farestDist ? value.dis : farestDist);
								});
								$scope.items = response.data;
							})
						}, 1000);
					}
					else {
						Items.getSelection($stateParams.category, 0, $stateParams.maxDist, position).then(function(response) {
								angular.forEach(response.data, function(value, key) {
										//If value is greater than farest dist, assign value else re-assign farestDist
										farestDist = (value.dis > farestDist ? value.dis : farestDist);
								});
								$scope.items = response.data;
						});
					}

					Towns.getNearest(position).then(function(response) {
						$scope.town = response.data.obj.name;
						$scope.radius = 100;
					});
				});

				$scope.$digest();
				$scope.$broadcast('scroll.refreshComplete');
			}
			else {
				$scope.$digest();
				$scope.$broadcast('scroll.refreshComplete');
			}
		};

		$scope.loadMoreList = function() {
			console.log("Calling load!");
			navigator.geolocation.getCurrentPosition(function(position) {
				if(typeof $stateParams.maxDist === 'undefined') {
					Items.getAll(position, farestDist).then(function(response) {
						angular.forEach(response.data, function(value, key) {
								//If value is greater than farest dist, assign value else re-assign farestDist
								farestDist = (value.dis > farestDist ? value.dis : farestDist);
						});
						response.data.forEach(function(item) {
							$scope.items.push(item);
						});
					});
				}
				else {
					Items.getSelection($stateParams.category, farestDist, $stateParams.maxDist, position).then(function(response) {
						angular.forEach(response.data, function(value, key) {
								//If value is greater than farest dist, assign value else re-assign farestDist
								farestDist = (value.dis > farestDist ? value.dis : farestDist);
						});
						response.data.forEach(function(item) {
							$scope.items.push(item);
						});
					});
				}
			});
		}

		$scope.likeItem = function() {
			console.log("I LIKE THIS!");
		}
})
.controller('itemCntrl', function($scope, $stateParams, Items) {
	Items.getOne($stateParams.id).then(function(response) {
		console.dir(response.data);
		$scope.item = response.data[0];
	});
})
.controller('searchCntrl', function($scope, $timeout, $state, Towns, Items) {
	console.log("WHAT");
	navigator.geolocation.getCurrentPosition(function(position) {
		Towns.getFromDist(position, 100).then(function(response) {
			var nearbyTowns = [];
			response.data.forEach(function(town) {
				nearbyTowns.push(town.obj.name)
			});
			$scope.geo = { distance: 100, nearbyTowns: nearbyTowns };
		});
	});

	$scope.dragSlider = function() {
		if($scope.geo.distance % 100 === 0) {
			var lastUpdate = 0;
			if(lastUpdate < new Date().getTime()) {  //Hack-ish caching! Woo!
				// navigator.geolocation.getCurrentPosition(function(position) {
				// 	lastUpdate = new Date(new Date().getTime() + 3000);  //2 seconds
				// 	var nearbyTowns = [];
				// 	console.log($scope.geo.distance);
				// 	$http.get('http://104.236.44.62:3000/town?lat=' + position.coords.latitude + '&long=' + position.coords.longitude + '&dist=' + $scope.geo.distance).
				// 		success(function(data, status, headers, config) {
				// 			data.forEach(function(town) {
				// 				console.log(town.obj.name);
				// 				nearbyTowns.push(town.obj.name)
				// 			})
				// 		}).
				// 		error(function(data, status, headers, config) {
				// 			console.log("Failed");
				// 			console.dir(config);
				// 			console.log("Error:" + status);
				// 		});
			  // 		$scope.geo.nearbyTowns = nearbyTowns;
				// });
			}
		}
	}
	$scope.search = function(category) {
		$timeout(function() {
			$state.go('tab.results', { category: category, maxDist: $scope.geo.distance });
		});
	}
})
.controller('homeSearchCntrl', function($stateParams, Items) {
	console.log("fsjkdhfjskd");
});

//$scope.CallTel = function(tel) {
//            window.location.href = 'tel:'+ tel;
//}
//imgslide.controller ('ImgSlideCntrl', function(scope) {
//    $scope.imgSlide = function(index) {
//    $ionicSlideBoxDelegate.slide(index, 500);
//    }
//});
