angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope) {
})

.controller('SearchCtrl', function($scope, Search) {
  $scope.friends = Search.all();
})

.controller('SearchDetailCtrl', function($scope, $stateParams, Search) {
  $scope.search = Search.get($stateParams.searchId);
})

.controller('AccountCtrl', function($scope) {
});
