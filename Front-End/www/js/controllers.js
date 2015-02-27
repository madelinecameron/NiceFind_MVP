'use strict';
angular.module('starter.controllers', [])

.controller('SearchCtrl', function($scope, Search) {
  $scope.friends = Search.all();
})

.controller('SearchDetailCtrl', function($scope, $stateParams, Search) {
  $scope.search = Search.get($stateParams.searchId);
})

.controller('AccountCtrl', function($scope) {
})

.controller('HomeCtrl', function($scope, $state, $http, $q) {
  console.log('HomeCtrl');


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
  
});


	
