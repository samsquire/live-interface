angular.module('system').controller('shelf', ['$scope', '$rootScope', 'shelfRepository', 'feed',
  function ($scope, $rootScope, shelfRepository, feedRepository) {
  $scope.shelf = shelfRepository.items;
  $scope.objects = shelfRepository.objects;

  $scope.embed = function (item) {

    var embed = {
      type: feedRepository.ids[item.documentId].fields[item.fieldIndex].type,
      index: item.fieldIndex
    };
    $rootScope.$emit('embed-field', embed);
  };

}]);