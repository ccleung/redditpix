'use strict';

/* Controllers */

var redditPicsControllers = angular.module('redditPicsControllers', ['infinite-scroll','angularSpinner']);

redditPicsControllers.controller('RedditPicsCtrl', ['$scope', 'Pictures',

  function($scope, Pictures) {
    $scope.subreddits = [
      'aww',
      'pics',
      'funny'
    ];
    $scope.CurrentSubReddit = $scope.subreddits[0];
    $scope.pictures = new Pictures($scope.CurrentSubReddit);
    $scope.getSubRedditData = function(NewSubReddit) {
      // reset index and call next page
      $scope.pictures = new Pictures(NewSubReddit);
      $scope.pictures.nextPage();
    }
  }]);

redditPicsControllers.directive('imageonload', function() {

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var onLoadOrError = function() {
              // only allow more scrolling when all pictures are loaded
              scope.pictures.imagesLoaded++;
              if (scope.pictures.imagesLoaded >= scope.pictures.imgs.length)
              {
                scope.pictures.busy = false;
                scope.pictures.stopSpinner();
                scope.pictures.addClassToSpinnerDiv();
              }
              scope.$apply('imageLoaded=true');
            }
            element.bind('load', function() {
              onLoadOrError();
            });
            element.bind('error', function() {
              onLoadOrError();
            });
        }
    };

});

redditPicsControllers.factory('Pictures', ['$http', 'usSpinnerService', function($http, usSpinnerService) {
  var Pictures = function(subreddit) {
    this.imgs = [];
    this.busy = false;
    this.index = 0;
    this.imagesLoaded = 0;
    this.subreddit = subreddit;
    this.startSpinner = function() { return usSpinnerService.spin('spinner-1'); }
    this.stopSpinner = function() { return usSpinnerService.stop('spinner-1'); }
    this.addClassToSpinnerDiv = function() { 
      var spinnerDiv = document.getElementById('spinner-div');
      if (spinnerDiv.className != "col-xs-12") {
        spinnerDiv.className = "col-xs-12";
      }
    }
    this.removeClassFromSpinnerDiv = function() { 
      var spinnerDiv = document.getElementById('spinner-div');
      if (spinnerDiv.className == "col-xs-12") {
        spinnerDiv.className = "";
      }
    }
  };

  Pictures.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;
    this.startSpinner();

    if (this.imgs.length <= 0) {
      this.removeClassFromSpinnerDiv();
    }

    var url = "https://api.imgur.com/3/gallery/r/" + this.subreddit + "/top/day/" + this.index;
    $http.defaults.headers.common.Authorization = "Client-ID 46ffdf043d06c64";
    $http.get(url).success(function(data) {
      var items = data.data;
      for (var i = 0; i < items.length; i++) {
        this.imgs.push(items[i]);
      }
      this.index++;
    }.bind(this));
  };

  return Pictures;
}]);
