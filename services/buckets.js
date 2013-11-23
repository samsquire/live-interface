angular.module('system').service('bucket', ['$http', function BucketService ($http) {

  
    var self = this;

    self.createBucket = function () {
    $http({method: 'GET', url: 'http://localhost:1444/bucket'}).
      success(function(data, status, headers, config) {
        console.log('created bucket', data.guid);
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  };

}]);