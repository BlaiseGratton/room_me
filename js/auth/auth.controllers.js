;(function(){
  'use strict';

  angular.module('roommateApp')
    .controller('LoginController', function(authFactory, $rootScope, $scope, $location){
      var vm = this;
      
      vm.login = function(){
        authFactory.login(vm.email, vm.password, function(){
          $location.path('/');
          $scope.$apply();
        });
      };

      vm.register = function(){
        authFactory.register(vm.email, vm.password, vm.user, function(){
          vm.login();
        });
      };

      vm.forgotPassword = function(){
        authFactory.resetPassword(vm.email);
      };
      
    })
    .controller('LogoutController', function($scope, $rootScope, $location, authFactory){
      authFactory.logout(function(){
        $location.path('/login');
        $rootScope.user = false;
        $scope.$apply();
      });

    })
    .controller('ChangePasswordController', function($scope, authFactory, $location){
      var vm = this;
      vm.changePassword = function(){
        authFactory.changePassword(vm.oldPassword, vm.newPassword, function(){
          $location.path('/logout');
          $scope.$apply();
        })
      };
    })
}());
