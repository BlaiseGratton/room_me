;(function(){
  'use strict';

  angular.module('roommateApp')
    .controller('NavController', function($rootScope){
      var vm = this;
      vm.getAuth = function(){
        return $rootScope.user ? true : false;
      };
    })
    .controller('ProfileController', function(profileFactory, $rootScope){
      var vm = this;

      profileFactory.getUserInfo(function(data){
        vm.user = data;
      });   
      
    }) 
    .controller('MatchController', function(FIREBASE_URL, $http, $rootScope, $scope, profileFactory){
      var vm = this;
     
      vm.user = { username: ""};
 
      profileFactory.getUserInfo(function(data){
        vm.user = data;
      }); 
       
      profileFactory.getAllQuizResults(function(data){
        vm.user_list = data;
        vm.findMatches(vm.user.info.username);
      });
      
      profileFactory.getChatUsers(function(data){
        vm.chats = data;
      });
      
      vm.checkChats = function(match){
        for (var chat in vm.chats){ 
          if (chat.indexOf(match.info.username) !== -1 && chat.indexOf(vm.user.info.username) !== -1){ 
            return "chatting";
          }
        }
      }

      vm.matches = [];
     
      // user defines what percent error registers as a match between two responses
      vm.tightness = 66.6;

      $scope.$watch("matchCtrl.tightness", function(newVal, oldVal){
        vm.findMatches(vm.user.info.username);
      }, true);
    
      vm.findMatches = function(userId){
        vm.matches = [];
        for (var key in vm.user_list) {
          if (key !== userId) {
            var match = vm.user_list[key];
            var user = vm.user;
            if (user.quiz.ques12 === match.quiz.ques12 || match.quiz.ques13 === "no" || match.quiz.ques13 === "yes" && user.quiz.ques12 === "no" || user.quiz.ques13 === "yes" && match.quiz.ques12 === "no"){
              if (match.quiz.ques11 === "yes" || match.quiz.ques11 === "no" && user.quiz.ques10 === "no" || match.quiz.ques10 === "no" && user.quiz.ques11 === "no" ){
                if (match.quiz.ques9 === "no" && match.quiz.ques8 === user.quiz.ques8 || user.quiz.ques9 === "no" && match.quiz.ques8 === user.quiz.ques8 || match.quiz.ques9 === "yes" && user.quiz.ques9 === "yes" || match.quiz.ques8 === user.quiz.ques8){
                  var quesDiff = [];
                  quesDiff.push(Math.abs((user.quiz.ques7 - match.quiz.ques7) / 10));
                  quesDiff.push(Math.abs((user.quiz.ques6 - match.quiz.ques5) / 10));
                  quesDiff.push(Math.abs(((10 - user.quiz.ques4) - match.quiz.ques3) / 10));
                  if (user.quiz.ques2 < match.quiz.ques1){
                    quesDiff.push(0);
                  } else {
                    quesDiff.push(Math.abs((user.quiz.ques2 - match.quiz.ques1) / 10));
                  }
                  var avgDiff = (quesDiff.reduce(function(prev, cur) {
                    return prev + cur;
                  })) / 4;
                  if (avgDiff <= (100-vm.tightness)/100){
                    vm.matches.push(match);
                  }
                }
              }
            }
          }
        }
      }

      vm.openChat = function(username){
        profileFactory.openChat(vm.user.info.username, username);
      }

    })
    .controller('ChatController', function(profileFactory, $http, $scope, $location, $rootScope){
      var vm = this;
      vm.chatId = $location.$$path.slice(7);
     
      vm.userQueries = {
        bedrooms: "2br",
        areas: ['-Select an area-'],
      };

      vm.timestamp = '-Select a time range-';

      vm.areaZipcodes = {
        'Downtown': "37201|37219",
        'Brentwood': [37027],
        'Sylvan Park': [37209],
        'East Nashville': [37206],
        'Midtown': [37203],
        'Bellevue': [37221],
        'Belle Meade': [37205],
        'Green Hills': [37215],
        'Antioch': [37013],
        'South Nashville': [37211],
        'Oak Hill': [37220],
        'Percy Priest': [37217],
        'Lafayette': [37210],
        '12 South': [37204],
        'Hillsboro Village': [37212],
        'Germantown': [37208],
        'East Riverfront': [37213],
        'Donelson': [37214],
        'Hermitage': [37076],
        'Madison': [37115],
        'Inglewood': [37216],
        'Whites Creek': [37189],
        'Bordeaux': [37218],
      };
     
      vm.findHousing = function(){
        var zip = vm.areaZipcodes[vm.userQueries.area];
        profileFactory.getHousing(vm.timestamp, zip, function(data){
          vm.housing = data;
          console.log(vm.housing);
          vm.results = [];
          vm.housing.postings.forEach(function(listing){
            if (listing.annotations.bedrooms === vm.userQueries.bedrooms){                
                vm.results.push(listing);
            }
          });
        });
      };

      profileFactory.getUserInfo(function(data){
        vm.user = data;
        vm.username = vm.user.info.username;
        vm.match = vm.chatId.replace(vm.username, "");
        vm.getMatchInfo(vm.match);
      });
      
      vm.getMatchInfo = function(match){
        profileFactory.getMatchInfo(match, function(data){
          vm.matchInfo = data;
          vm.matchAreas(vm.matchInfo, vm.user);
        });
      };
       
      vm.matchAreas = function(matchInfo, user){
        vm.matchedAreas = [];
        user.info.areas.forEach(function(area){
          matchInfo.info.areas.forEach(function(area_match){
            if (area === area_match){
              if (typeof(area) === "string") {
                vm.matchedAreas.push(area);
              }
            }
          });
        });
        vm.userQueries.areas = vm.matchedAreas;
      }
      
      vm.removeListing = function(listingId){
        vm.listingsRef.child(listingId).remove();
      };

      vm.savedResults = [];

      vm.listingsRef = new Firebase('https://roommate-finder.firebaseio.com/chats/listings/' + vm.chatId);

      vm.saveListing = function(result){
        vm.listingsRef.push({url: result.external_url, heading: result.heading});
      };

      vm.listingsRef.on('value', function(snapshot){
        vm.savedResults = snapshot.val();
        $scope.$apply();
      });

      vm.messagesRef = new Firebase('https://roommate-finder.firebaseio.com/chats/' + vm.chatId);

      /*
      *  Chat functionality derived directly from Chat example at https://www.firebase.com/docs/web/examples.html
     */

      vm.messageField = $('#messageInput');
      vm.messageList = $('#messages');

      vm.messageField.keypress(function(e){
        if (vm.messageField.val() !== '' && e.keyCode == 13) {
          vm.message = vm.messageField.val();
          vm.messagesRef.push({name: vm.username, text: vm.message});
          vm.messageField.val('');
        }
      });

      vm.messagesRef.on('child_added', function(snapshot){
        vm.data = snapshot.val();
        vm.username = vm.data.name;
        vm.message = vm.data.text;

        vm.messageElement = $("<li>");
        vm.nameElement = $("<strong class='example-chat-username'></strong>");
        vm.nameElement.text(vm.username);
        vm.messageElement.text(vm.message).prepend(vm.nameElement);

        vm.messageList.append(vm.messageElement);

        vm.messageList[0].scrollTop = vm.messageList[0].scrollHeight; 
      });
      //end of Firebase Chat example
        
    })
    .controller('EditController', function($scope, $rootScope, profileFactory){
      var vm = this;
      
      vm.areas = [
        "Bellevue",
        "West Nashville (Belle Meade)",
        "Green Hills",
        "Brentwood",
        "Antioch",
        "South Nashville",
        "Oak Hill",
        "West Nashville (Sylvan Park)",
        "Percy Priest/Nashboro Village",
        "Lafayette",
        "12 South/Berry Hill",
        "Hillsboro Village",
        "Midtown",
        "Germantown",
        "Downtown",
        "East Riverfront",
        "Donelson",
        "East Nashville",
        "Hermitage",
        "Madison",
        "Inglewood",
        "Whites Creek",
        "Bordeaux"
      ];

      $scope.checkAll = function() {
        if ($scope.selectedAll) {
          $scope.selectedAll = true;
          vm.user.info.areas = vm.areas;
        } else {
          $scope.selectedAll = false;
          vm.user.info.areas = null;
        }
      }

      profileFactory.getUserInfo(function(data){
        vm.user = data;
      });

      vm.submitProfile = function(){
        profileFactory.submitProfile(vm.user.info);
      }

    })
    .controller('QuizController', function($rootScope, profileFactory){
      var vm = this;

      profileFactory.getUserInfo(function(data){
        vm.user = data;
        vm.user.quiz.name = vm.user.info.username;
      });
      
      vm.setQuizResults = function(){
        profileFactory.setQuizResults(vm.user.quiz, vm.user.info.username, function(data){
        });  
      };

    })
    .controller('AboutModalController', function($scope, $modal, $log){
      $scope.open = function(size) {

        var modalInstance = $modal.open({
          templateUrl: 'views/_about-modal.html',
          controller: '',
          size: size,
        });

        modalInstance.result.then(function(selectedItem){
        }, function(){
          $log.info('Modal dismissed at: ' + new Date());
        });
      };
    })
    .controller('PrivacyModalController', function($scope, $modal, $log){
      $scope.open = function(size) {

        var modalInstance = $modal.open({
          templateUrl: 'views/_privacy-modal.html',
          controller: '',
          size: size,
        });

        modalInstance.result.then(function(selectedItem){
        }, function(){
          $log.info('Modal dismissed at: ' + new Date());
        });
      };
    })
    .controller('LicenseModalController', function($scope, $modal, $log){
      $scope.open = function(size) {

        var modalInstance = $modal.open({
          templateUrl: 'views/_license-modal.html',
          controller: '',
          size: size,
        });

        modalInstance.result.then(function(selectedItem){
        }, function(){
          $log.info('Modal dismissed at: ' + new Date());
        });
      };
    })
    .controller('MapModalController', function($scope, $modal, $log){
      $scope.open = function(size) {

        var modalInstance = $modal.open({
          templateUrl: 'views/_map-modal.html',
          controller: '',
          size: size,
        });

        modalInstance.result.then(function(selectedItem){
        }, function(){
          $log.info('Modal dismissed at: ' + new Date());
        });
      };
    })




}());
