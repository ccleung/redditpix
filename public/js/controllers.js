'use strict';

/* Controllers */

var redditPicsControllers = angular.module('redditPicsControllers', ['infinite-scroll']);

redditPicsControllers.controller('RedditPicsCtrl', ['$scope', 'Pictures',

  function($scope, Pictures) {
    $scope.pictures = new Pictures();
  }]);

redditPicsControllers.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {

              // only allow more scrolling when all pictures are loaded
              scope.pictures.imagesLoaded++;
              if (scope.pictures.imagesLoaded >= scope.pictures.imgs.length)
              {
                console.log("NOT BUSY");
                scope.pictures.busy = false;
              }
              scope.$apply('imageLoaded=true');
            });
        }
    };
});

redditPicsControllers.factory('Pictures', function($http) {
  var Pictures = function() {
    this.imgs = [];
    this.busy = false;
    this.index = 0;
    this.imagesLoaded = 0;
  };

  Pictures.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;

    var url = "https://api.imgur.com/3/gallery/r/aww/top/day/" + this.index;
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
});