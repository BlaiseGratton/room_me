;(function(){
  'use strict';

  angular.module('roommateApp')
    .config(function($routeProvider){
      $routeProvider
      .when('/', {
        templateUrl: 'views/landing.html'
      })
      .otherwise({redirectTo: '/'});
    })
}());
