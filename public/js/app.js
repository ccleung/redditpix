'use strict';

/* App Module */

var redditPicsApp = angular.module('redditPicsApp', [
  'ngRoute',
  'redditPicsControllers',
  'redditPicsFilters',
  'redditPicsAnimations'
]);

redditPicsApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/pics', {
        templateUrl: 'partials/reddit-pics.html',
        controller: 'RedditPicsCtrl'
      }).
      otherwise({
        redirectTo: '/pics'
      });
  }]);