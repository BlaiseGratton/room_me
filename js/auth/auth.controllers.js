;(function(){
  'use strict';

  angular.module('roommateApp')
    .controller('LoginController', function(authFactory, $scope, $location){
      var vm = this;
      
      vm.login = function(){
        authFactory.login(vm.email, vm.password, function(){
          $location.path('/prof');
          $scope.$apply();
        });
      };

      vm.register = function(){
        authFactory.register(vm.email, vm.password, function(){
          vm.login();
        });
      };

      vm.forgotPassword = function(){
        authFactory.resetPassword(vm.email);
      };
      
    })
    .controller('LogoutController', function($scope, $location, authFactory){
      authFactory.logout(function(){
        $location.path('/login');
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
