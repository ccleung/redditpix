'use strict';

/* Controllers */

var redditPicsControllers = angular.module('redditPicsControllers', []);

redditPicsControllers.controller('RedditPicsCtrl', ['$scope', '$http',

  function($scope, $http) {
  	$http.defaults.headers.common.Authorization = "Client-ID 46ffdf043d06c64";
    $http.get('https://api.imgur.com/3/gallery/r/aww/top/day/0').success(function(data) {
      $scope.imgs = data.data;
    });
  }]).directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
              scope.$apply('imageLoaded=true');
            });
        }
    };
});