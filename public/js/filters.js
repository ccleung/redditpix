var redditPicsFilters = angular.module('redditPicsFilters', []);

redditPicsFilters.filter('thumbnailSize', function() {
  return function(input, size) {
  	var str = input;
  	var i = input.lastIndexOf('.');
  	if (i != -i) {
  		str = str.substr(0, i) + size + str.substr(i);
  	}
    return str;
  };
});

redditPicsFilters.filter('redditUrl', function() {
  return function(url) {
  	var baseUrl = "https://reddit.com";
    return baseUrl + url;
  };
});

