;(function(){
  'use strict';

  angular.module('roommateApp')
    .controller('ProfileController', function(profileFactory){
      var vm = this;

      vm.users = [
        {
          name: "Blaise",
          ques1: 1,
          ques2: 2,
          ques3: 3,
          ques4: 4,
          ques5: 5
        },
        {
          name: "Mark",
          ques1: 1,
          ques2: 2,
          ques3: 3,
          ques4: 4,
          ques5: 5
        },
        {
          name: "Matt",
          ques1: 2,
          ques2: 3,
          ques3: 4,
          ques4: 5,
          ques5: 4
        }
      ];

      vm.user = {

        name: "Blaise",
        about: "Lorem ipsum dolor sit et amet, quia hunc adhuc non etiam sed alteram noverim.",
        areas: "West End",
        quiz: {
          ques1: 5,
          ques2: 3,
          ques3: 1,
          ques4: 4,
          ques5: 3
        },

      };
      
      vm.setQuizResults = function(){
        
        profileFactory.setQuizResults(vm.quiz, function(data){
        
        });  

        vm.user.quiz = vm.quiz;
      };

    })
    .controller('MatchController', function($scope){
      var vm = this;
    
      vm.users = [
        {
          name: "Blaise",
          ques1: 1,
          ques2: 2,
          ques3: 3,
          ques4: 4,
          ques5: 5
        },
        {
          name: "Mark",
          ques1: 1,
          ques2: 2,
          ques3: 3,
          ques4: 4,
          ques5: 5
        },
        {
          name: "Matt",
          ques1: 2,
          ques2: 3,
          ques3: 4,
          ques4: 5,
          ques5: 4
        },
        {
          name: "Whodat",
          ques1: 3,
          ques2: 1,
          ques3: 3,
          ques4: 2,
          ques5: 1
        },
        {
          name: "Julio",
          ques1: 5,
          ques2: 3,
          ques3: 3,
          ques4: 4,
          ques5: 3
        },
        {
          name: "Rachel",
          ques1: 3,
          ques2: 3,
          ques3: 5,
          ques4: 5,
          ques5: 5
        },
        {
          name: "Brynn",
          ques1: 2,
          ques2: 2,
          ques3: 3,
          ques4: 4,
          ques5: 1
        },
        {
          name: "Lee",
          ques1: 1,
          ques2: 5,
          ques3: 1,
          ques4: 1,
          ques5: 5
        },
        {
          name: "Martha",
          ques1: 5,
          ques2: 4,
          ques3: 5,
          ques4: 4,
          ques5: 5
        },
      ];
      
      vm.matches = [];
     
      // user defines what percent error registers as a match between two responses
      vm.tightness = 50;

      $scope.$watch("matchCtrl.tightness", function(newVal, oldVal){
        vm.findMatches(0);
      }, true);
    
      $scope.showTightness = function(value) {
        return value.toString();
      };

      
      vm.findMatches = function(userId){
        vm.matches = [];
        var user = vm.users[userId];
        for(var i = 0; i < vm.users.length; i++){
          if (i !== userId) {
            var quesDiff = [];
            quesDiff.push(Math.abs((user.ques1 - vm.users[i].ques1) / 5));
            quesDiff.push(Math.abs((user.ques2 - vm.users[i].ques2) / 5));
            quesDiff.push(Math.abs((user.ques3 - vm.users[i].ques3) / 5));
            quesDiff.push(Math.abs((user.ques4 - vm.users[i].ques4) / 5));
            quesDiff.push(Math.abs((user.ques5 - vm.users[i].ques5) / 5));
            var avgDiff = (quesDiff.reduce(function(prev, cur) {
              return prev + cur;
            })) / 5;

            if (avgDiff <= (100-vm.tightness)/100) {
              vm.matches.push(vm.users[i]);
            }
          }
        }
      };

      vm.findMatches(0);

    })
    .controller('EditController', function(){
      var vm = this;

    })
    .controller('QuizController', function(){
      var vm = this;

      vm.someFunc = function(){

    };

  })

}());
