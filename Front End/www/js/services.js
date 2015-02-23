angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Search', ['$http', function($http) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var search = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
		var json_data;
		$http.get('http://localhost:3000/search?lat=37.956002&long=-91.774363').
			success(function(data, status, headers, config) {
				json_data = data;
				console.log("Json: " + json_data);
			}).
			error(function(data, status, headers, config) {
				console.log("Failed");
				console.log("Error:" + status);
				return 0;
		});
	
		console.log("Returning");
		return json_data;
    },
    get: function(searchId) {
      // Simple index lookup
      return search[searchId];
    }
  }
}]);
