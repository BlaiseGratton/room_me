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
        console.log(data);

      }); 
       
      profileFactory.getAllQuizResults(function(data){
        vm.user_list = data;
        console.log(vm.user_list);
      });
      
      vm.matches = [];
     
      // user defines what percent error registers as a match between two responses
      vm.tightness = 50;

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
    .controller('ChatController', function(profileFactory, $location, $rootScope){
      var vm = this;
      
      vm.chatId = $location.$$path.slice(7);

      profileFactory.getUserInfo(function(data){
        vm.user = data;
      });

      vm.url = 'https://roommate-finder.firebaseio.com/chats/' + vm.chatId + '?auth=' + $rootScope.user.token;
      console.log(vm.url);
      vm.messagesRef = new Firebase('https://roommate-finder.firebaseio.com/chats/' + vm.chatId);
      
      // REGISTER DOM ELEMENTS
      vm.messageField = $('#messageInput');
      vm.nameField = $('#nameInput');
      vm.messageList = $('#example-messages');

      // LISTEN FOR KEYPRESS EVENT
      vm.messageField.keypress(function (e) {
        if (e.keyCode == 13) {
          //FIELD VALUES
          vm.username = vm.nameField.val();
          vm.message = vm.messageField.val();

          //SAVE DATA TO FIREBASE AND EMPTY FIELD
          vm.messagesRef.push({name: vm.username, text: vm.message});
          vm.messageField.val('');
        }
      });

      // Add a callback that is triggered for each chat message.
      vm.messagesRef.limitToLast(10).on('child_added', function (snapshot) {
        //GET DATA
        vm.data = snapshot.val();
        vm.username = vm.data.name || "anonymous";
        vm.message = vm.data.text;

        //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
        vm.messageElement = $("<li>");
        vm.nameElement = $("<strong class='example-chat-username'></strong>");
        vm.nameElement.text(vm.username);
        vm.messageElement.text(vm.message).prepend(vm.nameElement);

        //ADD MESSAGE
        vm.messageList.append(vm.messageElement);

        //SCROLL TO BOTTOM OF MESSAGE LIST
        vm.messageList[0].scrollTop = vm.messageList[0].scrollHeight; 
      });
        
    })
    .controller('EditController', function(profileFactory){
      var vm = this;
      
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
