angular.module('system').controller('connect', ['$rootScope', '$state', '$scope', '$stateParams',
  function ($rootScope, $state, $scope, $stateParams) {

  $scope.open = true;
  $scope.id = $stateParams.documentId;
  $scope.fieldIndex = $stateParams.fieldIndex;
  $scope.instanceName = $stateParams.instanceName;


  $scope.close = function () {
    $scope.open = false;
    $state.transitionTo('home');
    $rootScope.$emit('enable-autocomplete');
  }

  $rootScope.$emit('disable-autocomplete');
  $rootScope.$emit('close-autocomplete');

  $rootScope.$on('escape-pressed', function () {
    $scope.close();
  });

}]);