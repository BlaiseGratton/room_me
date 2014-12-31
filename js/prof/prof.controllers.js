;(function(){
  'use strict';

  angular.module('roommateApp')
    .controller('ProfileController', function(profileFactory){
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
        console.log(vm.chats);
      });
      
      vm.checkChats = function(match){
        for (var chat in vm.chats){ 
          if (chat.indexOf(match.name) !== -1 && chat.indexOf(vm.user.info.username) !== -1){ 
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
    
      $scope.showTightness = function(value) {
        return value.toString();
      };

      vm.findMatches = function(userId){
        vm.matches = [];
        for (var key in vm.user_list) {
          if (key !== userId) {
            var quesDiff = [];
            quesDiff.push(Math.abs((vm.user.quiz.ques1 - vm.user_list[key].ques1) / 10));
            quesDiff.push(Math.abs((vm.user.quiz.ques2 - vm.user_list[key].ques2) / 10));
            quesDiff.push(Math.abs((vm.user.quiz.ques3 - vm.user_list[key].ques3) / 10));
            quesDiff.push(Math.abs((vm.user.quiz.ques4 - vm.user_list[key].ques4) / 10));
            quesDiff.push(Math.abs((vm.user.quiz.ques5 - vm.user_list[key].ques5) / 10));
            var avgDiff = (quesDiff.reduce(function(prev, cur) {
              return prev + cur;
            })) / 5;
            if (avgDiff <= (100-vm.tightness)/100) {
              var match = vm.user_list[key];
              vm.matches.push(match);
            }
          }
        }
      };

      vm.openChat = function(username){
        profileFactory.openChat(vm.user.info.username, username);
      }

    })
    .controller('ChatController', function(profileFactory, $http, $location, $rootScope){
      var vm = this;
      vm.chatId = $location.$$path.slice(7);
     
      profileFactory.getHousing(function(data){
        vm.housing = data;
        console.log(vm.housing);
      });
      
      vm.userQueries = {
        bedrooms: "2br",
        areas: "downtown",
      };
     
      vm.areaZipcodes = {
        'downtown': [37201, 37219],
        'brentwood': [37027],
        'sylvan-park': [37209],
        'east-nashville': [37206],
        'midtown': [37203],
      }

      vm.findHousing = function(){
        vm.results = [];
        vm.housing.postings.forEach(function(listing){
          if (listing.annotations.bedrooms === vm.userQueries.bedrooms){
            var zips = vm.areaZipcodes[vm.userQueries.areas];
            zips.forEach(function(zip){
              if (listing.location.zipcode.indexOf(zip) !== -1){
                vm.results.push(listing);
              }
            });
          }
        });
      };

      profileFactory.getUserInfo(function(data){
        vm.user = data;
        vm.username = vm.user.info.username;
        vm.match = vm.chatId.replace(vm.username, "");
      });
      
      vm.messagesRef = new Firebase('https://roommate-finder.firebaseio.com/chats/' + vm.chatId);

      /*
      *  Chat functionality derived directly from Chat example at https://www.firebase.com/docs/web/examples.html
     */

      vm.messageField = $('#messageInput');
      vm.messageList = $('#example-messages');

      vm.messageField.keypress(function (e) {
        if (vm.messageField.val() !== '' && e.keyCode == 13) {
          vm.message = vm.messageField.val();

          vm.messagesRef.push({name: vm.username, text: vm.message});
          vm.messageField.val('');
        }
      });

      vm.messagesRef.limitToLast(10).on('child_added', function (snapshot) {
        vm.data = snapshot.val();
        vm.username = vm.data.name || "anonymous";
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
    .controller('EditController', function(profileFactory){
      var vm = this;
      
      vm.areas = ["East Nashville", "Sylvan Park", "Sylvan Heights", "Brentwood", "Inglewood", "West End", "Downtown"];

      profileFactory.getUserInfo(function(data){
        vm.user = data;
      });

      vm.submitProfile = function(){
        profileFactory.submitProfile(vm.user.info);
      }

    })
    .controller('QuizController', function(profileFactory){
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

}());
