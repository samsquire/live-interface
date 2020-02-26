angular.module('system').controller('edit-document', ['$scope', '$rootScope', 'feed', function ($scope, $rootScope, feed) {
  

  feed.fetch(function (docs) {
      // $scope.$apply();
      console.log("In edit mode, received", docs);
      $rootScope.$apply();
  });
  
}]);