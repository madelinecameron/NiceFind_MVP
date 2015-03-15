'use strict';
angular.module('solobuy.controllers', [])
.controller('homeCntrl', function($scope, $state, $http, $q) {
	var lastUpdate = 0;
	var farestDist = 0;  //Farest distance seen so far

	console.log("Trying to update (1)...");
	if(lastUpdate < new Date().getTime()) {  //Hack-ish caching! Woo!
		navigator.geolocation.getCurrentPosition(function(position) {
			console.log("Updating (1)...");
			lastUpdate = new Date(new Date().getTime() + 60000);  //1 minute
			console.log(lastUpdate);
			$http.get('http://104.236.44.62:3000/search?lat=' + position.coords.latitude + '&long=' + position.coords.longitude).
				success(function(data, status, headers, config) {
					angular.forEach(data, function(value, key) {
							//If value is greater than farest dist, assign value else re-assign farestDist
							farestDist = (value.dis > farestDist ? value.dis : farestDist);
					});
					console.log(farestDist);
					$scope.items = data;
				}).
				error(function(data, status, headers, config) {
					console.log("Failed");
					console.dir(config);
					console.log("Error:" + status);
					return 0;
				});

				$http.get('http://104.236.44.62:3000/town?lat=' + position.coords.latitude + '&long=' + position.coords.longitude + '&nearest=1').
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

						$http.get('http://104.236.44.62:3000/town?lat=' + position.coords.latitude + '&long=' + position.coords.longitude + '&nearest=1').
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

		$scope.loadMoreList = function() {
			navigator.geolocation.getCurrentPosition(function(position) {
				$http.get('http://104.236.44.62:3000/search?lat=' + position.coords.latitude + '&long=' + position.coords.longitude + '&minDist=' + farestDist).
					success(function(data, status, headers, config) {
						//Don't try to be clever here. forEach makes this go *crazy*...
						for(var i = 0; i < 100; i++) {
							$scope.items.push(data[i]);
						}
						$scope.$broadcast('scroll.infiniteScrollComplete');
						return true;
					}).
					error(function(data, status, headers, config) {
						console.log("Failed");
						console.dir(config);
						console.log("Error:" + status);
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$scope.$apply();
						return 0;
					});
				});
		}

		$scope.likeItem = function() {
			console.log("I LIKE THIS!");
		}
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
		var nearbyTowns = [];
		var townText;
		$http.get('http://104.236.44.62:3000/town?lat=' + position.coords.latitude + '&long=' + position.coords.longitude + '&dist=100').
			success(function(data, status, headers, config) {
				data.forEach(function(town) {
					nearbyTowns.push(town.obj.name)
				})
			}).
			error(function(data, status, headers, config) {
				console.log("Failed");
				console.dir(config);
				console.log("Error:" + status);
			});
  		$scope.geo = { distance: 100, nearbyTowns: nearbyTowns }
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
})
.controller('accountCntrl', function($scope, $state, $q) {
  console.log("I don't do anything! :D")
})
.controller('loginCntrl', function($scope, $state, $q) {
	$scope.login = function() {
		console.log($scope.loginForm.username);
	}

	$scope.register = function() {
		$state.go('register'); //Redirect to register state
	}
})
.controller('registerCntrl', function($scope, $state, $q) {
	$scope.register = function() {
		$state.go('register');
	}
});

//$scope.CallTel = function(tel) {
//            window.location.href = 'tel:'+ tel;
//}
//imgslide.controller ('ImgSlideCntrl', function(scope) {
//    $scope.imgSlide = function(index) {
//    $ionicSlideBoxDelegate.slide(index, 500);
//    }
//});
