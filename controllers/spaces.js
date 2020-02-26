var SpacesController = function SpacesController
($scope, $state, $rootScope, feed, cleaner) {

$scope.saveIndex = function (id, index) {
    $scope.nameToIndex[id] = index;
  };

  feed.fetch(function (docs) {
      // $scope.$apply();
      console.log("Retrieved", docs);
      $scope.items.forEach(function (feedItem, index) {
        // $scope.saveIndex(feedItem._id, index)
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

  $scope.update = feed.inplaceUpdate(function () {
    console.log("Applying after update");
    $scope.$apply();
  });
  
};


angular.module('system').controller('spaces', ['$scope', '$state', '$rootScope', 'feed', 'cleaner',
  SpacesController
]);