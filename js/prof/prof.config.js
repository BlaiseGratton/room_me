;(function(){
  'use strict';

  angular.module('roommateApp')
    .config(function($routeProvider){
      $routeProvider
      .when('/prof', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileController',
        controllerAs: 'profCtrl',
        private: true
      })
      .when('/prof/edit', {
        templateUrl: 'views/edit-profile.html',
        controller: 'EditController',
        controllerAs: 'profCtrl',
        private: true
      })
      .when('/prof/quiz', {
        templateUrl: 'views/quiz.html',
        controller: 'QuizController',
        controllerAs: 'quizCtrl',
        private: true
      })
      .when('/prof/matches', {
        templateUrl: 'views/matches.html',
        controller: 'MatchController',
        controllerAs: 'matchCtrl',
        private: true
      })
      .when('/chats/:id', {
        templateUrl: 'views/chat.html',
        controller: 'ChatController',
        controllerAs: 'chatCtrl', 
      })
      /*.when('/prof/:id', {
        templateUrl: 'views/show.html',
        controller: 'ProfileController',
        controllerAs: 'show',
        // private: true
      })
      .when('/prof/:id/edit', {
        templateUrl: 'views/form.html',
        controller: 'ProfileController',
        controllerAs: 'todo',
        // private: true
      })*/
    })
}());
