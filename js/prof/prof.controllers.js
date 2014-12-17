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
        
        profileFactory.setQuizResults();  

        vm.user.quiz = vm.quiz;
      };

    })
    .controller('MatchController', function(){
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
      
      vm.matches = [];


      // user defines what percent error indicates a match between two responses
      vm.tightness = .75;

      function findMatches(){
        
      }
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
