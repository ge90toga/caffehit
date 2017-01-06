var app = angular.module('caffeinehit.controllers', []);

app.controller("YelpController", function ($scope, YelpService,$ionicListDelegate) {
  $scope.yelp = YelpService;

  $scope.doRefresh = function () {
    if (!$scope.yelp.isLoading) {
      $scope.yelp.refresh().then(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
  };

  $scope.loadMore = function () {
    if (!$scope.yelp.isLoading && $scope.yelp.hasMore) {
      $scope.yelp.next();
    }
  };

  $scope.getDirections = function (cafe) {
    //console.log("opening directions");

    var destination = [
      cafe.location.coordinate.latitude,
      cafe.location.coordinate.longitude
    ];

    var source = [
      $scope.yelp.lat,
      $scope.yelp.lon
    ];

    launchnavigator.navigate(destination,source);
    $ionicListDelegate.closeOptionButtons();

  };

  $scope.openMap = function (cafe) {
    //console.log("opening map");

  };


});
