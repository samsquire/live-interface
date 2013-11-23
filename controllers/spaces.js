var SpacesController = function SpacesController ($scope, $state, $rootScope, feed, feedRepository) {

  feed.fetch(function (docs) {
      $scope.$apply();
      console.log("Retrieved", docs);
  });

  $scope.items = feed.items;

  $scope.update = function (feedItem) {
    console.log(JSON.stringify(feedItem, null, 4));
    feed.update(feedItem);
  };
};


angular.module('system').controller('spaces', ['$scope', '$state', '$rootScope', 'feed',
  SpacesController
]);