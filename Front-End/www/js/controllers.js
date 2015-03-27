'use strict';
angular.module('nicefind.controllers', ['ionic'])
.controller('homeCntrl', function($scope, $state, $stateParams, $timeout, Items, Towns, $ionicScrollDelegate) {
	var init = false;
	var maxDist, category;
	$timeout(function() {
		console.log("AAA" + $stateParams.category);
	});
	console.log(typeof $stateParams.category != "undefined");
	if(typeof $stateParams.givenItems != "undefined" && !init) {
		console.log("Loading items from search results!");
		init = true;
		maxDist = $stateParams.maxDist;
		category = $stateParams.category;
	}
	else {
		console.log("Loading items from query / dashboard!");
		var lastUpdate = 0;
		var farestDist = 0;  //Farest distance seen so far

		if(lastUpdate < new Date().getTime()) {  //Hack-ish caching! Woo!
				navigator.geolocation.getCurrentPosition(function(position) {
					if(typeof maxDist === 'undefined') { //If maxDist is undef, get all
						Items.getAll(position, 0).then(function(response) {
							angular.forEach(response.data, function(value, key) {
									//If value is greater than farest dist, assign value else re-assign farestDist
									farestDist = (value.dis > farestDist ? value.dis : farestDist);
							});
							$scope.items = response.data;
						});
					}
					else {
						Items.getSelection(category, farestDist, maxDist, position).then(function(response) {
							$state.go('tab.home', { givenItems: response.data});
							console.log($state.is('tab.home'));
						})
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
		}

		$scope.refreshList = function() {
			console.log("Trying to update (2)...");
			if(lastUpdate < new Date().getTime()) {  //Hack-ish caching! Woo!
				navigator.geolocation.getCurrentPosition(function(position) {
					console.log("Updating (2)...");
					lastUpdate = new Date(new Date().getTime() + 60000);  //1 minute

					$timeout(function() {
							Items.getAll(position, 0).then(function(response) {
							angular.forEach(response.data, function(value, key) {
									//If value is greater than farest dist, assign value else re-assign farestDist
									farestDist = (value.dis > farestDist ? value.dis : farestDist);
							});
							$scope.items = response.data;
						})
					}, 1000);

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
				Items.getAll(position, farestDist).then(function(response) {
					angular.forEach(response.data, function(value, key) {
							//If value is greater than farest dist, assign value else re-assign farestDist
							farestDist = (value.dis > farestDist ? value.dis : farestDist);
					});
					response.data.forEach(function(item) {
						$scope.items.push(item);
					});
					$timeout(function() {
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$ionicScrollDelegate.resize();
					});

				});
			})
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
.controller('searchCntrl', function($scope, $state, Towns, Items) {
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
		$state.go('tab.home.search', { category: category, maxDist: $scope.geo.distance });
	}
})
.controller('searchResultsCntrl', function($stateParams, Items) {
	console.log($stateParams.category);
	console.log("HERE!");
})
.controller('loginCntrl', function($scope, $state, $http, $ionicPopup) {
	$scope.login = function(user) {
		$http.post('http://104.236.44.62:3000/users/login', {username: user.username, password: user.password}).
			success(function(data, status, headers, config) {
				if(data.success) {
					window.localStorage["sid"] = data.session;
					console.log("SessionID: " + window.localStorage["sid"]);
					$state.go('tab.home');
				}
				else {
					$ionicPopup.alert({
						title: "Login failed",
						template: "Username or password is invalid!"
					});
				}
			}).
			error(function(data, status, headers, config) {
				console.log("Failed");
				console.dir(config);
				console.log("Error:" + status);
			});
	}

	$scope.register = function() {
		$state.go('register'); //Redirect to register state
	}
})
.controller('registerCntrl', function($scope, $state, $q, $http, $timeout, $ionicPopup, $ionicLoading) {
	$scope.passType = "password";
	$scope.displayErrors = "none";
	$scope.register = function(user) {
		try {
				$http.post('http://104.236.44.62:3000/users/register', {username: user.username, password: user.password, email: user.email}).
					success(function(data, status, headers, config) {
						$ionicLoading.show({
								template: "Successfully registered! Redirecting...",
								duration: 2000 //Show popup for 2000ms
							});
						$timeout($state.go('tab.home'), 6000); //Go to state tab.home in 6000ms
					}).
					error(function(data, status, headers, config) {
						console.log(data.message);
						$ionicPopup.alert({
							template: data.message
						});
					});
			}
			catch(e) {
				console.log("Error: " + e);
			}
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
