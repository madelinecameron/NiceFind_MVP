'use strict';
angular.module('solobuy.controllers', [])

.controller('homeCntrl', function($scope, $state, $http, $q) {
	navigator.geolocation.getCurrentPosition(function(position) {
			$http.get('http://104.236.44.62:3000/dashboard?lat=' + position.coords.latitude + '&long=' + position.coords.longitude).
				success(function(data, status, headers, config) {
					$scope.items = data;
				}).
				error(function(data, status, headers, config) {
					console.log("Failed");
					console.log("Error:" + status);
					return 0;
				});
		});
})
.controller('itemCntrl', function($scope, $state, $stateParams, $http, $q) {
  $http.get('http://104.236.44.62:3000/item/' + $stateParams.id).
    success(function(data, status, headers, config) {
      $scope.item = data[0];
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
});

//$scope.init = function(){
//    $scope.page = 1;
//    $scope.getData()
//    .then(function(res){
//      // success
//      console.log('Data: ', res)
//      $scope.dataList = res.shots;
//    }, function(status){
//      // err
//      $scope.pageError = status;
//    })
//  }
//
//  $scope.setActive = function(index){
//    angular.forEach($scope.dataList, function(data){
//      data.active = false;
//    })
//
//    $scope.dataList[index].active = true
//  }
//
//  $scope.getData = function(){
//    var defer = $q.defer();
//
//        $http.get('http://polling.3taps.com/poll?auth_token=aab1bc69478450008facde2d6824cb0b')
//            .success(function(res) {
//				defer.resolve(res)
//
//            })
//
//    .error(function(status, err){
//      defer.reject(status)
//    })
//
//    return defer.promise;
//  }
//
//  $scope.nextPage = function(){
//    $scope.page += 1;
//
//    $scope.getData()
//    .then(function(res){
//      if($scope.dataList[0]){
//        $scope.dataList = $scope.dataList.concat(res.shots)
//      }
//      else{
//        $scope.dataList = res.shots;
//      }
//      console.log('nextPage: ', $scope.dataList)
//      $scope.$broadcast('scroll.infiniteScrollComplete');
//    })
//  }
//
//  $scope.init();
