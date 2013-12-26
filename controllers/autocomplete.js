angular.module('system').controller('autocomplete',
  ['$scope', '$state', '$rootScope', 'bucket',
  function ($scope, $state, $rootScope, bucketService) {
  $scope.open = false;
  $scope.choosing = $state.current.data.choosing;

 

  var escapeListener = null;
  $scope.options = [
  [
    {title: 'Embed', type: 'stateChange', action: 'home.embed'},
    {title: 'Create a list', type: 'insertion', kind: 'list'},
    {title: 'Insert code', type: 'insertion', kind: 'code'},
    {title: 'Create a table', type: 'insertion', kind: 'table'},
    {title: 'Create a data bucket', type: 'bucket'}
  ],
  [
    {title: 'Expand', templateUrl: 'views/editor-expand-option.html', type: 'view', kind: 'expand'},
    {title: 'Create something', type: 'stateChange', action: 'home.create'}

  ]];

  $scope.close = function () {
    $scope.open = false;
  };
    

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

  $scope.bucket = function () {
    $rootScope.$emit('bucket');
  };

  $scope.view = function (item) {
    $scope[item.kind]();
  }

  $scope.createContext = function (item) {
    
  };

  $scope.expand = function () {
    $rootScope.$emit('toggle-editor-expand');
  };

  listen();
  

  function listen() {
    escapeListener = $rootScope.$on('escape-pressed', $scope.toggle);
  }

  $rootScope.$on('enable-autocomplete', function () {
    if (!escapeListener) {
     listen();
    }
  });

  $rootScope.$on('disable-autocomplete', function () {
    if (escapeListener) {
      escapeListener();
      escapeListener = null;
    }
  });
  $rootScope.$on('close-autocomplete', function () {
    $scope.close();
  });

}]);