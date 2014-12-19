;(function(){
  'use strict';

  angular.module('roommateApp')
    .controller('ProfileController', function(profileFactory){
      var vm = this;

      profileFactory.getUserInfo(function(data){
        vm.user = data;
      });   

      vm.setQuizResults = function(){
        vm.user.quiz.name = vm.user.username;
        profileFactory.setQuizResults(vm.user.quiz, vm.user.username, function(data){
        
        });  

        vm.user.quiz = vm.quiz;
      };

    })
    .controller('MatchController', function(FIREBASE_URL, $http, $rootScope, $scope, profileFactory){
      var vm = this;
     
      vm.user = {username: ""};
 
      profileFactory.getUserInfo(function(data){
        vm.user = data;
        console.log(data);
      }); 
       
      
      
      vm.matches = [];
     
      // user defines what percent error registers as a match between two responses
      vm.tightness = 50;

      $scope.$watch("matchCtrl.tightness", function(newVal, oldVal){
        vm.findMatches(vm.user.username);
      }, true);
    
      $scope.showTightness = function(value) {
        return value.toString();
      };

      /*vm.user = {

        name: "Eevee",
        about: "Lorem ipsum dolor sit et amet, quia hunc adhuc non etiam sed alteram noverim.",
        areas: "West End",
        quiz: {
          name: this.name,
          ques1: 5,
          ques2: 3,
          ques3: 1,
          ques4: 4,
          ques5: 3
        },

      };*/
      
      vm.findMatches = function(userId){
        vm.matches = [];
        for (var key in vm.user_list) {
          if (key !== userId) {
            var quesDiff = [];
            quesDiff.push(Math.abs((vm.user.quiz.ques1 - vm.user_list[key].ques1) / 5));
            quesDiff.push(Math.abs((vm.user.quiz.ques2 - vm.user_list[key].ques2) / 5));
            quesDiff.push(Math.abs((vm.user.quiz.ques3 - vm.user_list[key].ques3) / 5));
            quesDiff.push(Math.abs((vm.user.quiz.ques4 - vm.user_list[key].ques4) / 5));
            quesDiff.push(Math.abs((vm.user.quiz.ques5 - vm.user_list[key].ques5) / 5));
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
      
      vm.findMatches(vm.user.username);

    })
    .controller('EditController', function(profileFactory){
      var vm = this;
      
      profileFactory.getUserInfo(function(data){
        vm.user = data;
      });

      vm.submitProfile = function(){
        profileFactory.submitProfile(vm.info);
      }

    })
    .controller('QuizController', function(profileFactory){
      var vm = this;

      profileFactory.getUserInfo(function(data){
        vm.user = data;
      });
      
      profileFactory.getAllQuizResults(function(data){
        vm.user_list = data;
        console.log(vm.user_list);
      });
      
  })

}());
