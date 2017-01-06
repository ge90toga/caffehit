var app = angular.module('caffeinehit.services', []);

app.service("YelpService", function ($q, $http, $cordovaGeolocation,$ionicPopup) {
  var self = {
    'page': 1,
    'isLoading': false,
    'hasMore': true,
    'results': [],
    'lat': -33.9123514,
    'lon': 151.2396461,
    'refresh': function () {
      self.results = [];
      self.page = 1;
      self.isLoading = false;
      self.hasMore = true;
      return self.load();
    },
    'next': function () {
      self.page += 1;
      return self.load();
    },
    'load': function () {
      self.isLoading = true;
      var deferred = $q.defer();

      ionic.Platform.ready(function () {
        $cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: false})
          .then(
            function (position) { //success callback after getting user's position
              self.lat = position.coords.latitude;
              self.lon = position.coords.longitude;

              var params = {
                page: self.page,
                lat: self.lat,
                lon: self.lon
              };

              $http.get('http://api.codecraft.tv/samples/v1/coffee/', {params: params})
                .then(function (obj) {
                  self.isLoading = false;
                  console.log(obj.data);
                  if (obj.data.businesses.length == 0) {
                    self.hasMore = false;
                  } else {
                    angular.forEach(obj.data.businesses, function (business) {
                      self.results.push(business);
                    });
                  }
                  deferred.resolve();
                }, function (obj) {
                  self.isLoading = false;
                  deferred.reject(obj.data);
                });

            },function(err){
              console.log("error in position");
              $ionicPopup.alert({
                'title': "Please turn on the geolocation service",
                'template': "It seems like you switched off the location service permission for this app"
              });

            });
      });

      return deferred.promise;
    }
  };

  self.load();

  return self;
});
