angular.module('system').controller('autocomplete', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {
  console.log('autocomplete controller');

  $scope.open = false;

  $scope.options = [
  [
    {title: 'Embed', type: 'stateChange', action: 'home.embed'},
    {title: 'Create a list', type: 'insertion', kind: 'list'},
    {title: 'Create a table', type: 'insertion', kind: 'table'}
  ],
  [
    {title: 'Expand', templateUrl: 'views/editor-expand-option.html', type: 'view', kind: 'expand'},
    {title: 'Create context', action: ''}

  ]];

    

  $scope.toggle = function () {
    $scope.open = !$scope.open;
    if (!$scope.open) {
      $rootScope.$emit('autocomplete-closed');
    }
  };

  $scope.stateChange = function (item) {
    $state.transitionTo(item.action);
    $scope.toggle();
  };

  $scope.execute = function (item) {
    $scope[item.type](item);
    $scope.toggle();
  };

  $scope.insertion = function (item) {
    $rootScope.$emit('insertion', item.kind);
  };

  $scope.view = function (item) {
    $scope[item.kind]();
  }

  $scope.expand = function () {
    $rootScope.$emit('toggle-editor-expand');
  };

  
  $rootScope.$on('escape-pressed', $scope.toggle);

}]);