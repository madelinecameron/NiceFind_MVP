angular.module('nicefind.services', [])
.factory('Items', function($http) {
  return {
    getAll: function(position, minDist) {
      return $http.get('http://104.236.44.62:3000/items?lat=' + position.coords.latitude + '&long=' + position.coords.longitude + '&minDist=' + minDist);
    },
    getSelection: function(category, minDist, maxDist, position) {
      return $http.get('http://104.236.44.62:3000/items?lat=' + position.coords.latitude + '&long=' + position.coords.longitude + '&minDist=' + minDist + '&maxDist=' + maxDist + '&category=' + category);
    },
    getOne: function(id) {
      return $http.get('http://104.236.44.62:3000/items/' + id);
    }
  }
})
.factory('Towns', function($http) {
  return {
      getNearest: function(position) {
        return $http.get('http://104.236.44.62:3000/towns?lat=' + position.coords.latitude + '&long=' + position.coords.longitude + '&nearest=1');
      },
      getFromDist: function(position, dist) {
        return $http.get('http://104.236.44.62:3000/towns?lat=' + position.coords.latitude + '&long=' + position.coords.longitude + '&dist=' + dist);
      }
    }
});
