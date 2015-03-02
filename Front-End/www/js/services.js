angular.module('solobuy.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Search', function() {
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
		navigator.geolocation.getCurrentPosition(function(position) {
			$http.get('http://104.236.44.62:3000/search?lat=' + position.coord.latitude + '&long=' + position.coords.longitude).
				success(function(data, status, headers, config) {
					console.log(data);
					return data;
				}).
				error(function(data, status, headers, config) {
					console.log("Failed");
					console.log("Error:" + status);
					return 0;
				});
		});
    },
    get: function(searchId) {
      // Simple index lookup
      return search[searchId];
    }
  }
});
