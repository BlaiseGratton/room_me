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
      
      function getUserInfo(cb){
        $http.get(FIREBASE_URL + '/users/' + $rootScope.user.uid + '.json?auth=' + $rootScope.user.token)
          .success(function(data){
            cb(data);
          })
          .error(function(err){
            console.log(err);
          });
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
      
      function getChatUsers(cb){
        $http.get(FIREBASE_URL + '/chats.json')
          .success(function(data){
            cb(data);
          })
          .error(function(err){
            console.log(err);
          });
      }

      function openChat(user, match){
        var chatId = [user, match];
        chatId = chatId.sort().join("");
        $location.path('/chats/' + chatId);
      }
      
      function getHousing(timestamp, zipcode, cb){
        $http.get('https://search.3taps.com?auth_token=f4bd5054960b9e9319c7d844dccc1682&rpp=100&retvals=annotations,heading,body,external_url&timestamp=' + timestamp + '&location.zipcode=USA-' + zipcode + '&category=RHFR')
          .success(function(data){
            cb(data);
          })
          .error(function(err){
            console.log(err);
          });
      }

      function getMatchInfo(match, cb){
        $http.get(FIREBASE_URL + '/user_list/' + match + '.json?auth=' + $rootScope.user.token)
          .success(function(data){
            cb(data);
          })
          .error(function(err){
            console.log(err);
          });
      }

      function submitProfile(profile){
        $http.put(FIREBASE_URL + '/users/' + $rootScope.user.uid + '/info.json?auth=' + $rootScope.user.token, profile)
          .success(function(data){
            $location.path('/prof');
          })
          .error(function(err){
            console.log(err);
          });

        $http.put(FIREBASE_URL + '/user_list/' + profile.username + '/info.json?auth=' + $rootScope.user.token, profile)
          .success(function(data){
            
          })
          .error(function(err){
            console.log(err);
          });

      }

      function setQuizResults(results, user, cb) {
        $http.put(FIREBASE_URL + '/user_list/' + user + '/quiz.json?auth=' + $rootScope.user.token, results)
        .success(function(data){
          cb(data);
        })
        .error(function(err){
          console.log(err);
        });
        
        $http.put(FIREBASE_URL + '/users/' + $rootScope.user.uid + '/quiz.json?auth=' + $rootScope.user.token, results)
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
        getUserInfo: getUserInfo,
        openChat: openChat,
        getHousing: getHousing,
        getChatUsers: getChatUsers,
        getMatchInfo: getMatchInfo,
      };
    })
}());
