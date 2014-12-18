;(function(){
  'use strict';

  angular.module('roommateApp')
    .config(function($routeProvider){
      $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController',
        controllerAs: 'login',
        resolve: {
          data: function(authFactory){
            authFactory.disallowLogin();
          }
        }
      })
      .when('/logout', {
        template: '',
        controller: 'LogoutController'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'LoginController',
        controllerAs: 'register'
      })
      .when('/changepassword', {
        templateUrl: 'views/changepassword.html',
        controller: 'ChangePasswordController',
        controllerAs: 'changepw',
        private: true
      })
    })
    .run(function($rootScope, authFactory){
      $rootScope.$on('$routeChangeStart', function(event, nextRoute, priorRoute){
        if (nextRoute.$$route && nextRoute.$$route.private) {
          authFactory.requireLogin();
        }
      })
    })
}());
