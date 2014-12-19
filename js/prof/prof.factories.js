;(function(){
  'use strict';

  angular.module('roommateApp')
    .factory('profileFactory', function($rootScope, FIREBASE_URL, $http, $location){
      
      function _roomUrl(id){
        if (id) {
          return FIREBASE_URL + '/users/' + $rootScope.user.uid + '/info/' + id + '.json?auth=' + $rootScope.user.token;
        } else {
          return FIREBASE_URL + '/users/' + $rootScope.user.uid + '/info.json?auth=' + $rootScope.user.token;
        }
      }
      
      function getAllQuizResults(cb){
        $http.get(FIREBASE_URL + '/user_list/' + '.json?auth=' + $rootScope.user.token)
          .success(function(data){
            cb(data);
          })
          .error(function(err){
            console.log(err);
          });
      }
      
      function submitProfile(profile){
        $http.put(_roomUrl(), profile)
          .success(function(data){
            
          })
          .error(function(err){
            console.log(err);
          });
      }

      function setQuizResults(results, user, cb) {
        
        var userKey = $rootScope.user.token;

        $http.put(FIREBASE_URL + '/user_list/' + user + '.json?auth=' + $rootScope.user.token, results)
        .success(function(data){
          cb(data.userKey);
        })
        .error(function(err){
          console.log(err);
        });
        

        $http.put(_roomUrl(), results)
        .success(function(data){
          console.log(_roomUrl());
          cb(data);
        })
        .error(function(err){
          console.log(err);
        });
      }
      

      return {
        setQuizResults: setQuizResults,
        getAllQuizResults: getAllQuizResults,
        submitProfile: submitProfile,

      };
    })
}());
