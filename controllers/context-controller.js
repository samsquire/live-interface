angular.module('system').controller('contextController', ['$scope', 'model', '$state', 'metadata',
  function ($scope, model, $state, metadata) {

  $scope.activeField = model;
  $scope.metadata = metadata;
      
  $scope.code = false;
  $scope.transposed = false;

  $scope.toggleCode = function () {
    $scope.code = !$scope.code;
  };

  $scope.show = function (toggle) {
    $scope.open = toggle;
  };

  $scope.transpose = function () {
    console.log('transposing');
    $scope.transposed = !$scope.transposed;
  };

  $scope.connect = function (item) {
    // console.log($scope.activeField, $scope.activeDocument._id);

    $state.transitionTo('home.connect', {
      documentId: $scope.activeDocument._id,
      fieldIndex: metadata.fieldIndex,
      instanceName: metadata.instanceName
    });
  };



}]);