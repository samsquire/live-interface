var SpacesController = function SpacesController
($scope, $state, $rootScope, feed, cleaner) {

$scope.saveIndex = function (id, index) {
    $scope.nameToIndex[id] = index;
  };

  feed.fetch(function (docs) {
      // $scope.$apply();
      console.log("Retrieved", docs);
      $scope.items.forEach(function (feedItem, index) {
        $scope.saveIndex(feedItem._id, index)
      });
      $rootScope.$apply();
  });

  $scope.items = feed.items;
  $scope.feedIds = feed.ids;
  $scope.nameToIndex = {};

  $scope.openForEditing = function(feedItem) {
    $state.transitionTo('edit', {
      documentId: feedItem._id
    });
  };

  $scope.update = function (feedItem) {
    console.log(cleaner);
    feedItem.contents = cleaner.filter(feedItem.html).html();
    delete feedItem.html;
    console.log(JSON.stringify(feedItem, null, 4));
    feed.update(feedItem, function () {
      console.log("Applying after update");
      $scope.$apply();
    });
  };
  
};


angular.module('system').controller('spaces', ['$scope', '$state', '$rootScope', 'feed', 'cleaner',
  SpacesController
]);