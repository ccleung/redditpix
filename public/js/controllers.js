'use strict';

/* Controllers */

var redditPicsControllers = angular.module('redditPicsControllers', ['infinite-scroll','angularSpinner']);

redditPicsControllers.controller('RedditPicsCtrl', ['$scope', 'Pictures',

  function($scope, Pictures) {
    $scope.pictures = new Pictures();
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
  var Pictures = function() {
    this.imgs = [];
    this.busy = false;
    this.index = 0;
    this.imagesLoaded = 0;
    this.startSpinner = function() { return usSpinnerService.spin('spinner-1'); }
    this.stopSpinner = function() { return usSpinnerService.stop('spinner-1'); }
  };

  Pictures.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;
    this.startSpinner();

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
}]);
