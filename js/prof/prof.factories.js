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
      
      function getAnchor(cb){
        var timestamp = new Date().getTime() - 263000000;
        timestamp = timestamp.toString().slice(0, 10);
        $http.get('https://polling.3taps.com/anchor?auth_token=f4bd5054960b9e9319c7d844dccc1682&timestamp=' + timestamp)
          .success(function(data){
            cb(data);
          })
          .error(function(err){
            console.log(err);
          });
      }

      function getHousing(anchor, cb){
        console.log(anchor);
        $http.get('https://polling.3taps.com/poll?auth_token=f4bd5054960b9e9319c7d844dccc1682&anchor=' + anchor + '&location.city=usa-nas-nas&category=RHFR|RSUB')
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
        getAnchor: getAnchor,
      };
    })
}());
