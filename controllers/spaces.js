angular.module('system').controller('spaces', ['$scope', '$state', '$rootScope', 'feed',
  function ($scope, $state, $rootScope, feed, feedRepository) {

  feed.fetch(function (docs) {
      // $scope.items.push.apply($scope.items, docs);
      // $scope.items.push.apply($scope.items, docs);
      $scope.$apply();
      console.log("Retrieved", docs);
  });

  $scope.items = feed.items;
  
  console.log('loaded feed items', feed.items);
  

  $scope.update = function (feedItem) {
    console.log(JSON.stringify(feedItem, null, 4));
    feed.update(feedItem);
  };
  
}]);