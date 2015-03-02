// Solobuy Ionic application

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'solobuy' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'solobuy.services' is found in services.js
// 'solobuy.controllers' is found in controllers.js
angular.module('solobuy', ['ionic', 'solobuy.controllers', 'solobuy.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider)  {
  $stateProvider
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    });
    $stateProvider.state('tab.home', {
      url: '/home',
      views: {
        'home-tab': {
          templateUrl: 'templates/tab-home.html',
          controller: 'homeCntrl'
        }
      }
    })
    .state('tab.item', {
      url: '/item/:id',
      views: {
        'home-tab': {
          templateUrl: 'templates/item-detail.html',
          controller: 'itemCntrl',
          resolve: {
            id: function($stateParams) {
              return $stateParams.id
            }
          }
        }
      }
    });
});
