;(function(){
  'use strict';

  angular.module('roommateApp')
    .factory('authFactory', function($rootScope, $location, FIREBASE_URL){
      var factory = {};
      var ref = new Firebase(FIREBASE_URL);
      // $rootScope.user = null;
      $rootScope.user = ref.getAuth();

      factory.requireLogin = function(){
        if (!_isLoggedIn()) {
          $location.path('/login');
        } else if (_hasTemporaryPassword()) {
          $location.path('/changepassword');
        }
      };

      factory.disallowLogin = function() {
        if (_isLoggedIn()) {
          $location.path('/prof');
        }
      };

      function _isLoggedIn(){
        return Boolean(ref.getAuth());
      }

      function _hasTemporaryPassword(){
        return ref.getAuth().password.isTemporaryPassword;
      }

      factory.login = function(email, pass, cb){
        ref.authWithPassword({
            email    : email,
            password : pass
          }, function(error, authData) {
            if (error === null) {
              $rootScope.user = ref.getAuth();
              console.log('user logged in successfully', authData);
              cb();
            } else {
              console.log('error logging in user:', error);
            }
          }
        );
      };

      factory.changePassword = function(oldPass, newPass, cb){
        ref.changePassword({
          email       : ref.getAuth().password.email,
          oldPassword : oldPass,
          newPassword : newPass
        }, function(error) {
          if (error === null) {
            console.log('password changed successfully');
            cb();
          } else {
            console.log('error changing password:', error);
          }
        });
      }

      factory.logout = function(cb){
        ref.unauth(function(){
          cb();
        });
      };

      factory.register = function(email, pass, user, cb){
        ref.createUser({
            email    : email,
            password : pass,
            username : user,
          }, function(error, authData, user) {
            if (error === null) {
              console.log('User created successfully', authData);
              cb();
            } else {
              console.log('Error creating user:', error);
            }
          }
        );
      };
      factory.resetPassword = function(email){
        ref.resetPassword({
            email : email
          }, function(error) {
            if (error === null) {
              console.log('Password reset email sent successfully');
            } else {
              console.log('Error sending password reset email:', error);
            }
          }
        );
      };

      return factory;
    }) 
}());
