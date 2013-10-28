angular.module('system').controller('spaces', ['$scope', '$state', '$rootScope', 'feed', function ($scope, $state, $rootScope, feed) {

  $scope.items = [];
  $scope.ids = {};

  feed.items(function (docs) {
      docs.forEach(function (doc) {
        if ($scope.ids.hasOwnProperty(doc._id)) {
          console.log('already existing doc', doc, doc._id);
          $.extend($scope.ids[doc._id], doc);  
        } else {
          $scope.ids[doc._id] = doc;
          $scope.items.push(doc);
        }
      });
      // $scope.items.push.apply($scope.items, docs);
      $scope.$apply(true);
  });

  $scope.update = function (feedItem) {
    feed.update(feedItem);
  };
  
}]);